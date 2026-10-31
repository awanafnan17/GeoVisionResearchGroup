"use client";

import { useSession as useNextAuthSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import type { SessionUser } from "@/types";

export function useSession() {
  const { data: session, status } = useNextAuthSession();

  return {
    user: session?.user as SessionUser | null,
    isLoading: status === "loading",
    isAuthenticated: status === "authenticated",
    role: (session?.user as SessionUser | undefined)?.role ?? null,
  };
}

const roleRedirects: Record<string, string> = {
  SUPERADMIN: "/superadmin/dashboard",
  ADMIN: "/admin/dashboard",
  EXPERT: "/expert/dashboard",
  GEOSENTRY_MANAGER: "/geosentry-portal/dashboard",
  STUDENT: "/student/dashboard",
};

export function useRequireAuth(allowedRoles?: string[]) {
  const { user, isLoading, isAuthenticated, role } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      router.replace("/login");
      return;
    }

    if (allowedRoles && role && !allowedRoles.includes(role)) {
      const redirect = roleRedirects[role] ?? "/";
      router.replace(redirect);
    }
  }, [isLoading, isAuthenticated, role, allowedRoles, router]);

  return { user, isLoading };
}
