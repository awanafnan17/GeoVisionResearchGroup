import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import type { Role } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { SECURITY_CONFIG } from "@/lib/constants";
import { AuthenticationError, AuthorizationError } from "@/lib/api-error";
import { isDemoPasswordBlocked, createAuditLog } from "@/lib/security";

export type SessionUser = {
  id: string;
  email: string;
  name: string;
  role: Role | string;
  image?: string | null;
};

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  secret: process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET,
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        loginChannel: { label: "Login Channel", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const email = (credentials.email as string).trim().toLowerCase();
        const password = credentials.password as string;
        const rawChannel = (credentials.loginChannel as string | undefined)?.trim().toLowerCase();
        const loginChannel: "staff" | "user" = rawChannel === "staff" ? "staff" : "user";

        const user = await prisma.user.findUnique({
          where: { email },
        });

        if (!user || !user.password) {
          await prisma.auditLog.create({
            data: {
              action: "LOGIN_FAILED",
              entity: "User",
              entityId: email,
              newValue: { reason: "User not found" },
            },
          });
          return null;
        }

        // Check if account is active
        if (!user.isActive) {
          await prisma.auditLog.create({
            data: {
              userId: user.id,
              action: "LOGIN_FAILED",
              entity: "User",
              entityId: user.id,
              newValue: { reason: "Account deactivated" },
            },
          });
          return null;
        }

        // Check if account is currently locked
        const now = new Date();
        if (user.lockedUntil && user.lockedUntil > now) {
          await prisma.auditLog.create({
            data: {
              userId: user.id,
              action: "LOGIN_FAILED",
              entity: "User",
              entityId: user.id,
              newValue: {
                reason: "Account locked",
                lockedUntil: user.lockedUntil.toISOString(),
              },
            },
          });
          return null;
        }

        // Block predictable demo passwords on any remote/cloud database or when BLOCK_DEMO_PASSWORDS=true
        if (isDemoPasswordBlocked(password)) {
          await prisma.auditLog.create({
            data: {
              userId: user.id,
              action: "LOGIN_FAILED",
              entity: "User",
              entityId: user.id,
              newValue: {
                reason: "Predictable demo credential blocked in cloud environment",
              },
            },
          });
          return null;
        }

        // Compare password
        const isValid = await bcrypt.compare(password, user.password);

        if (!isValid) {
          // If a previous lockout has expired, reset base attempts before incrementing
          const baseAttempts =
            user.lockedUntil && user.lockedUntil <= now ? 0 : user.loginAttempts;
          const newAttempts = baseAttempts + 1;
          const updateData: { loginAttempts: number; lockedUntil?: Date | null } = {
            loginAttempts: newAttempts,
            lockedUntil: null,
          };

          // Lock account after max attempts
          if (newAttempts >= SECURITY_CONFIG.MAX_LOGIN_ATTEMPTS) {
            updateData.lockedUntil = new Date(
              Date.now() + SECURITY_CONFIG.LOCKOUT_DURATION_MINUTES * 60 * 1000
            );
          }

          await prisma.user.update({
            where: { id: user.id },
            data: updateData,
          });

          await prisma.auditLog.create({
            data: {
              userId: user.id,
              action: "LOGIN_FAILED",
              entity: "User",
              entityId: user.id,
              newValue: {
                reason: "Invalid password",
                attempts: newAttempts,
                locked: newAttempts >= SECURITY_CONFIG.MAX_LOGIN_ATTEMPTS,
              },
            },
          });

          return null;
        }

        // Channel RBAC enforcement
        const STAFF_ROLES: (Role | string)[] = ["SUPERADMIN", "ADMIN", "GEOSENTRY_MANAGER"];
        const USER_ROLES: (Role | string)[] = ["STUDENT", "EXPERT"];

        if (loginChannel === "staff") {
          if (!STAFF_ROLES.includes(user.role)) {
            await createAuditLog({
              userId: user.id,
              action: "LOGIN_FAILED",
              entity: "User",
              entityId: user.id,
              newValue: {
                reason: "CHANNEL_MISMATCH",
                channel: "staff",
                role: user.role,
                email: user.email,
              },
            });
            return null;
          }
        } else {
          // loginChannel === "user"
          if (!USER_ROLES.includes(user.role)) {
            await createAuditLog({
              userId: user.id,
              action: "LOGIN_FAILED",
              entity: "User",
              entityId: user.id,
              newValue: {
                reason: "CHANNEL_MISMATCH",
                channel: "user",
                role: user.role,
                email: user.email,
              },
            });
            return null;
          }
        }

        // Success - reset login attempts
        await prisma.user.update({
          where: { id: user.id },
          data: {
            loginAttempts: 0,
            lockedUntil: null,
            lastLoginAt: new Date(),
          },
        });

        // Audit log success
        await prisma.auditLog.create({
          data: {
            userId: user.id,
            action: "LOGIN",
            entity: "User",
            entityId: user.id,
          },
        });

        return {
          id: user.id,
          email: user.email,
          name: user.name ?? "",
          role: user.role,
          image: user.image,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as unknown as SessionUser).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        const u = session.user as unknown as Record<string, unknown>;
        u.id = token.id as string;
        u.role = token.role as string;
      }
      return session;
    },
  },
});

/**
 * Server-side authentication & RBAC enforcement helper.
 * Verifies the active session AND confirms the user is still active and unlocked in PostgreSQL.
 */
export async function requireSessionUser(
  allowedRoles?: readonly (Role | string)[]
): Promise<SessionUser> {
  const session = await auth();
  const sessionUser = session?.user as SessionUser | undefined;

  if (!sessionUser?.id) {
    throw new AuthenticationError("Authentication required");
  }

  const dbUser = await prisma.user.findUnique({
    where: { id: sessionUser.id },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      image: true,
      isActive: true,
      lockedUntil: true,
    },
  });

  if (!dbUser || !dbUser.isActive) {
    throw new AuthenticationError("Account is inactive or no longer exists");
  }

  if (dbUser.lockedUntil && dbUser.lockedUntil > new Date()) {
    throw new AuthenticationError("Account is temporarily locked");
  }

  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(dbUser.role)) {
    throw new AuthorizationError("You do not have permission to perform this action");
  }

  return {
    id: dbUser.id,
    email: dbUser.email,
    name: dbUser.name ?? "",
    role: dbUser.role,
    image: dbUser.image,
  };
}
