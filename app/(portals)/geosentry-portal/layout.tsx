import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { PortalLayout } from "@/components/portals/shared/PortalLayout";
import type { SidebarNavItem } from "@/components/portals/shared/Sidebar";

export const dynamic = "force-dynamic";

const GEOSENTRY_NAV: SidebarNavItem[] = [
  { href: "/geosentry-portal/dashboard", label: "Dashboard", icon: "LayoutDashboard" },
  { href: "/geosentry-portal/requests", label: "Screening Requests", icon: "Search" },
  { href: "/geosentry-portal/new-request", label: "New Request", icon: "Plus" },
  { href: "/geosentry-portal/delivered", label: "Delivered Reports", icon: "CheckCircle" },
  { href: "/geosentry-portal/analytics", label: "Analytics", icon: "BarChart2" },
  { href: "/geosentry-portal/settings", label: "GeoSentry Settings", icon: "Settings" },
];

export default async function GeoSentryLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) {
    redirect("/staff/login?callbackUrl=/geosentry-portal/dashboard");
  }

  const role = (session.user as { role?: string })?.role;
  if (role !== "GEOSENTRY_MANAGER") {
    redirect("/unauthorized");
  }

  return (
    <PortalLayout navItems={GEOSENTRY_NAV} role="GEOSENTRY_MANAGER" portalName="GeoSentry" allowedRoles={["GEOSENTRY_MANAGER"]}>
      {children}
    </PortalLayout>
  );
}
