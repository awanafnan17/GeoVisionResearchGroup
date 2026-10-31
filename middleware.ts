import { NextResponse, type NextRequest } from "next/server";
import { normalizeCallbackUrl } from "./lib/auth-redirect";

// Full security headers applied to every response
// CSP is intentionally permissive for Next.js dev mode inline scripts
const securityHeaders: Record<string, string> = {
  "Content-Security-Policy":
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://fonts.googleapis.com; " +
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
    "font-src 'self' https://fonts.gstatic.com; " +
    "img-src 'self' data: blob: https://utfs.io https://uploadthing.com https://images.unsplash.com https://randomuser.me https://res.cloudinary.com https://lh3.googleusercontent.com; " +
    "connect-src 'self' https://uploadthing.com https://utfs.io; " +
    "frame-ancestors 'none';",
  "X-Frame-Options": "DENY",
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
  "X-DNS-Prefetch-Control": "on",
};

// HSTS is only applied in production to avoid issues with local dev
const isProduction = process.env.NODE_ENV === "production";

const staffPrefixes = ["/superadmin", "/admin", "/geosentry-portal"];
const memberPrefixes = ["/student", "/expert"];

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const response = NextResponse.next();

  // Apply security headers to all responses
  for (const [key, value] of Object.entries(securityHeaders)) {
    response.headers.set(key, value);
  }

  // Add HSTS only in production
  if (isProduction) {
    response.headers.set(
      "Strict-Transport-Security",
      "max-age=31536000; includeSubDomains"
    );
  }

  // Protect dashboard routes - split staff vs member redirects
  const isStaffRoute = staffPrefixes.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
  const isMemberRoute = memberPrefixes.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );

  if (isStaffRoute || isMemberRoute) {
    // Check for NextAuth session cookie (both Auth.js and legacy NextAuth variants)
    const sessionToken =
      request.cookies.get("authjs.session-token")?.value ??
      request.cookies.get("__Secure-authjs.session-token")?.value ??
      request.cookies.get("next-auth.session-token")?.value ??
      request.cookies.get("__Secure-next-auth.session-token")?.value;

    if (!sessionToken) {
      const targetPath = isStaffRoute ? "/staff/login" : "/login";
      const loginUrl = new URL(targetPath, request.url);
      const safeCallback = normalizeCallbackUrl(pathname + search);
      loginUrl.searchParams.set("callbackUrl", safeCallback);
      const redirectResponse = NextResponse.redirect(loginUrl);

      // Apply security headers to redirect responses too
      for (const [key, value] of Object.entries(securityHeaders)) {
        redirectResponse.headers.set(key, value);
      }
      if (isProduction) {
        redirectResponse.headers.set(
          "Strict-Transport-Security",
          "max-age=31536000; includeSubDomains"
        );
      }

      return redirectResponse;
    }
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|images|geosentry/sample-report|fonts|api/auth|manifest.json).*)",
  ],
};
