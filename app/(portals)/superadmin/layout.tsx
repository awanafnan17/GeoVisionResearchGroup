import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { PortalLayout } from "@/components/portals/shared/PortalLayout";
import type { SidebarNavItem } from "@/components/portals/shared/Sidebar";

export const dynamic = "force-dynamic";

const SUPERADMIN_NAV: SidebarNavItem[] = [
  { href: "/superadmin/dashboard", label: "Dashboard", icon: "LayoutDashboard" },
  { href: "/superadmin/users", label: "Users & Roles", icon: "Users" },
  { href: "/superadmin/experts", label: "Expert Profiles", icon: "UserCheck" },
  { href: "/superadmin/services", label: "Services", icon: "Briefcase" },
  { href: "/superadmin/courses", label: "Courses", icon: "GraduationCap" },
  { href: "/superadmin/payments", label: "Payments", icon: "CreditCard" },
  { href: "/superadmin/leads", label: "Leads & Inquiries", icon: "MessageSquare" },
  { href: "/superadmin/portfolio", label: "Portfolio", icon: "FolderOpen" },
  { href: "/superadmin/blog", label: "Blog", icon: "FileText" },
  { href: "/superadmin/geosentry", label: "GeoSentry (View)", icon: "Search" },
  { href: "/superadmin/settings", label: "Settings", icon: "Settings" },
  { href: "/superadmin/audit-logs", label: "Audit Logs", icon: "Shield" },
];

export default async function SuperAdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) {
    redirect("/staff/login?callbackUrl=/superadmin/dashboard");
  }

  const role = (session.user as { role?: string })?.role;
  if (role !== "SUPERADMIN") {
    redirect("/unauthorized");
  }

  return (
    <PortalLayout navItems={SUPERADMIN_NAV} role="SUPERADMIN" portalName="SuperAdmin" allowedRoles={["SUPERADMIN"]}>
      {children}
    </PortalLayout>
  );
}
