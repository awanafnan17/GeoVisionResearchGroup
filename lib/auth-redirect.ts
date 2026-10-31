import type { Role } from "@prisma/client";

/**
 * Validates whether a candidate redirect URL is safe and relative.
 * Rejects protocol-relative URLs (e.g. //attacker.com), backslashes, control characters,
 * or URLs leading back to authentication/authorization barrier pages.
 */
export function isSafeRelativePath(url?: string | null): boolean {
  if (!url || typeof url !== "string") return false;
  const trimmed = url.trim();

  // Must begin with a single slash, not double slash or backslash
  if (
    !trimmed.startsWith("/") ||
    trimmed.startsWith("//") ||
    trimmed.includes("\\") ||
    trimmed.includes("..")
  ) {
    return false;
  }

  // Reject embedded/internal duplicate slashes (trailing duplicate slashes are collapsed during normalization)
  const questionIdx = trimmed.indexOf("?");
  const hashIdx = trimmed.indexOf("#");
  const splitIdx = Math.min(
    questionIdx !== -1 ? questionIdx : Infinity,
    hashIdx !== -1 ? hashIdx : Infinity
  );
  const pathname = splitIdx !== Infinity ? trimmed.slice(0, splitIdx) : trimmed;
  const strippedPath = pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;
  if (strippedPath.slice(1).includes("//")) {
    return false;
  }

  // Reject URLs containing protocols, null bytes, or control characters
  if (/[\u0000-\u001F\u007F-\u009F]/.test(trimmed)) {
    return false;
  }
  if (trimmed.includes("://") || trimmed.toLowerCase().startsWith("javascript:")) {
    return false;
  }

  // Check decoded URL to prevent encoded traversal or protocol bypasses (%2e%2e, %2f%2f, %5c)
  try {
    const decoded = decodeURI(trimmed);
    if (
      decoded.includes("..") ||
      decoded.startsWith("//") ||
      decoded.includes("\\")
    ) {
      return false;
    }
    const dQIdx = decoded.indexOf("?");
    const dHIdx = decoded.indexOf("#");
    const dSIdx = Math.min(
      dQIdx !== -1 ? dQIdx : Infinity,
      dHIdx !== -1 ? dHIdx : Infinity
    );
    const dPathname = dSIdx !== Infinity ? decoded.slice(0, dSIdx) : decoded;
    const dStripped = dPathname.length > 1 ? dPathname.replace(/\/+$/, "") : dPathname;
    if (dStripped.slice(1).includes("//")) {
      return false;
    }
  } catch {
    return false;
  }

  // Do not redirect back to auth barrier or recovery endpoints
  if (
    trimmed.startsWith("/staff/login") ||
    trimmed.startsWith("/login") ||
    trimmed.startsWith("/signup") ||
    trimmed.startsWith("/forgot-password") ||
    trimmed.startsWith("/reset-password") ||
    trimmed.startsWith("/unauthorized")
  ) {
    return false;
  }

  return true;
}

/**
 * Normalizes bare portal root paths (e.g. /admin, /superadmin, /geosentry-portal, /expert, /student)
 * with or without trailing slash and query strings to their respective dashboard URLs.
 * Rejects open-redirect payloads and auth barrier paths, falling back to defaultDashboard.
 */
export function normalizeCallbackUrl(
  callbackUrl?: string | null,
  defaultDashboard: string = ""
): string {
  if (!callbackUrl || typeof callbackUrl !== "string") {
    return defaultDashboard;
  }

  const trimmed = callbackUrl.trim();
  if (!trimmed || !isSafeRelativePath(trimmed)) {
    return defaultDashboard;
  }

  // Extract pathname and search/hash suffix
  const questionIdx = trimmed.indexOf("?");
  const hashIdx = trimmed.indexOf("#");
  const splitIdx = Math.min(
    questionIdx !== -1 ? questionIdx : Infinity,
    hashIdx !== -1 ? hashIdx : Infinity
  );
  const pathname = splitIdx !== Infinity ? trimmed.slice(0, splitIdx) : trimmed;
  const suffix = splitIdx !== Infinity ? trimmed.slice(splitIdx) : "";

  // Strip trailing slashes from pathname (preserving single root "/")
  const strippedPath = pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;

  const portalMap: Record<string, string> = {
    "/superadmin": "/superadmin/dashboard",
    "/admin": "/admin/dashboard",
    "/geosentry-portal": "/geosentry-portal/dashboard",
    "/expert": "/expert/dashboard",
    "/student": "/student/dashboard",
  };

  if (portalMap[strippedPath]) {
    return `${portalMap[strippedPath]}${suffix}`;
  }

  if (strippedPath !== pathname) {
    return `${strippedPath}${suffix}`;
  }

  return trimmed;
}

/**
 * Resolves safe redirect for staff channels (SUPERADMIN, ADMIN, GEOSENTRY_MANAGER).
 * Ensures users are strictly kept within their authorized administrative route hierarchies.
 */
export function getSafeStaffRedirect(
  role: Role | string,
  callbackUrl?: string | null
): string {
  const defaults: Record<string, string> = {
    SUPERADMIN: "/superadmin/dashboard",
    ADMIN: "/admin/dashboard",
    GEOSENTRY_MANAGER: "/geosentry-portal/dashboard",
  };

  const fallback = defaults[role] ?? "/staff/login";

  if (!isSafeRelativePath(callbackUrl)) {
    return fallback;
  }

  const normalized = normalizeCallbackUrl(callbackUrl, fallback);
  if (!isSafeRelativePath(normalized)) {
    return fallback;
  }

  const cleanUrl = normalized.trim();

  // Role-specific prefix whitelist
  if (
    role === "SUPERADMIN" &&
    (cleanUrl === "/superadmin" || cleanUrl.startsWith("/superadmin/"))
  ) {
    return cleanUrl;
  }

  if (
    role === "ADMIN" &&
    (cleanUrl === "/admin" || cleanUrl.startsWith("/admin/"))
  ) {
    return cleanUrl;
  }

  if (
    role === "GEOSENTRY_MANAGER" &&
    (cleanUrl === "/geosentry-portal" || cleanUrl.startsWith("/geosentry-portal/"))
  ) {
    return cleanUrl;
  }

  return fallback;
}

/**
 * Resolves safe redirect for public member channels (STUDENT, EXPERT).
 * Ensures users are strictly kept within their authorized workspace and learning routes.
 */
export function getSafeUserRedirect(
  role: Role | string,
  callbackUrl?: string | null
): string {
  const defaults: Record<string, string> = {
    STUDENT: "/student/dashboard",
    EXPERT: "/expert/dashboard",
  };

  const fallback = defaults[role] ?? "/login";

  if (!isSafeRelativePath(callbackUrl)) {
    return fallback;
  }

  const normalized = normalizeCallbackUrl(callbackUrl, fallback);
  if (!isSafeRelativePath(normalized)) {
    return fallback;
  }

  const cleanUrl = normalized.trim();

  // Role-specific prefix whitelist
  if (
    role === "STUDENT" &&
    (cleanUrl === "/student" ||
      cleanUrl.startsWith("/student/") ||
      cleanUrl === "/courses" ||
      cleanUrl.startsWith("/courses/") ||
      cleanUrl.startsWith("/courses?") ||
      cleanUrl === "/portfolio" ||
      cleanUrl.startsWith("/portfolio/") ||
      cleanUrl.startsWith("/portfolio?") ||
      cleanUrl === "/blog" ||
      cleanUrl.startsWith("/blog/") ||
      cleanUrl.startsWith("/blog?"))
  ) {
    return cleanUrl;
  }

  if (
    role === "EXPERT" &&
    (cleanUrl === "/expert" ||
      cleanUrl.startsWith("/expert/") ||
      cleanUrl === "/courses" ||
      cleanUrl.startsWith("/courses/") ||
      cleanUrl.startsWith("/courses?") ||
      cleanUrl === "/portfolio" ||
      cleanUrl.startsWith("/portfolio/") ||
      cleanUrl.startsWith("/portfolio?") ||
      cleanUrl === "/blog" ||
      cleanUrl.startsWith("/blog/") ||
      cleanUrl.startsWith("/blog?"))
  ) {
    return cleanUrl;
  }

  return fallback;
}
