"use client";

import { useEffect, useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "@/hooks/useSession";
import { useSidebar } from "@/hooks/useSidebar";
import { Sidebar, type SidebarNavItem } from "./Sidebar";
import { TopHeader } from "./TopHeader";
import { Spinner } from "@/components/ui/Spinner";
import { cn } from "@/lib/utils";

interface PortalLayoutProps {
  children: React.ReactNode;
  navItems: SidebarNavItem[];
  role: string;
  portalName?: string;
  allowedRoles?: string[];
}

const labelMap: Record<string, string> = {
  dashboard: "Dashboard",
  users: "Users & Roles",
  experts: "Expert Profiles",
  services: "Services",
  courses: "Courses",
  payments: "Payments",
  leads: "Leads & Inquiries",
  portfolio: "Portfolio",
  blog: "Blog",
  geosentry: "GeoSentry",
  settings: "Settings",
  "audit-logs": "Audit Logs",
  profile: "My Profile",
  publications: "Publications",
  projects: "My Projects",
  cv: "CV Management",
  requests: "Screening Requests",
  "new-request": "New Request",
  delivered: "Delivered Reports",
  analytics: "Analytics",
};

export function resolveAllowedRoles(
  pathname: string,
  roleProp: string,
  portalName?: string,
  explicitRoles?: string[]
): string[] {
  if (explicitRoles && explicitRoles.length > 0) {
    return explicitRoles;
  }

  // Match pathnames with strict boundary delimiters first
  if (pathname === "/superadmin" || pathname.startsWith("/superadmin/")) {
    return ["SUPERADMIN"];
  }
  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    return ["ADMIN"];
  }
  if (
    pathname === "/geosentry-portal" ||
    pathname.startsWith("/geosentry-portal/")
  ) {
    return ["GEOSENTRY_MANAGER"];
  }
  if (pathname === "/expert" || pathname.startsWith("/expert/")) {
    return ["EXPERT"];
  }
  if (pathname === "/student" || pathname.startsWith("/student/")) {
    return ["STUDENT"];
  }

  // Fallback by role key when pathname does not match a known portal route
  const key = (portalName || roleProp || "").toUpperCase();
  if (key === "SUPERADMIN") {
    return ["SUPERADMIN"];
  }
  if (key === "ADMIN") {
    return ["ADMIN"];
  }
  if (key === "GEOSENTRY" || key === "GEOSENTRY_MANAGER") {
    return ["GEOSENTRY_MANAGER"];
  }
  if (key === "EXPERT") {
    return ["EXPERT"];
  }
  if (key === "STUDENT") {
    return ["STUDENT"];
  }

  return [roleProp];
}

export function PortalLayout({
  children,
  navItems,
  role,
  portalName,
  allowedRoles,
}: PortalLayoutProps) {
  const { user, isLoading, isAuthenticated, role: userRole } = useSession();
  const { isCollapsed, isMobileOpen, toggleCollapse, toggleMobile, closeMobile } =
    useSidebar();
  const pathname = usePathname();
  const router = useRouter();

  const isStaffConsole =
    pathname.startsWith("/superadmin") ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/geosentry-portal") ||
    ["SUPERADMIN", "ADMIN", "GEOSENTRY_MANAGER"].includes(role);

  const permittedRoles = useMemo(
    () => resolveAllowedRoles(pathname, role, portalName, allowedRoles),
    [pathname, role, portalName, allowedRoles]
  );

  const isAuthorized = Boolean(
    isAuthenticated && userRole && permittedRoles.includes(userRole)
  );

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) {
      const target = isStaffConsole ? "/staff/login" : "/login";
      router.replace(`${target}?callbackUrl=${encodeURIComponent(pathname)}`);
      return;
    }
    if (!userRole || !permittedRoles.includes(userRole)) {
      router.replace("/unauthorized");
    }
  }, [isLoading, isAuthenticated, userRole, permittedRoles, isStaffConsole, pathname, router]);

  if (isLoading || !isAuthenticated || !isAuthorized) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#0B1320]">
        <Spinner size="lg" color="gold" />
      </div>
    );
  }

  const segments = pathname.split("/").filter(Boolean);
  const lastSeg = segments[segments.length - 1] || "Dashboard";
  const pageTitle =
    labelMap[lastSeg] ||
    lastSeg.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <div className="flex h-screen overflow-hidden bg-[#0B1320] text-geo-white">
      <Sidebar
        navItems={navItems}
        role={role}
        userName={user?.name ?? "User"}
        userEmail={user?.email ?? ""}
        userImage={user?.image}
        isCollapsed={isCollapsed}
        isMobileOpen={isMobileOpen}
        isStaffConsole={isStaffConsole}
        onToggleCollapse={toggleCollapse}
        onCloseMobile={closeMobile}
      />
      <div
        className={cn(
          "flex-1 flex flex-col overflow-hidden transition-all duration-300",
          isCollapsed ? "md:ml-[68px]" : "md:ml-[260px]"
        )}
      >
        <TopHeader
          title={pageTitle}
          isStaffConsole={isStaffConsole}
          onMobileMenuToggle={toggleMobile}
        />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 geo-grid-bg">
          <div className="max-w-[1440px] mx-auto">
            {children}
            <footer className="mt-12 pt-4 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-geo-slate">
              <span>
                {isStaffConsole
                  ? "GEO VISION RESEARCH GROUP • STAFF OPERATIONS CONSOLE"
                  : "GEO VISION RESEARCH GROUP • MEMBER WORKSPACE"}
              </span>
              <span>
                {isStaffConsole
                  ? `TLS 1.3 ENCRYPTED • ROLE: ${(userRole || role).replace(/_/g, " ")}`
                  : `SECURE SESSION • ${(userRole || role).replace(/_/g, " ")}`}
              </span>
            </footer>
          </div>
        </main>
      </div>
    </div>
  );
}
