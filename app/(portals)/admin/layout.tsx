import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { PortalLayout } from "@/components/portals/shared/PortalLayout";
import type { SidebarNavItem } from "@/components/portals/shared/Sidebar";

export const dynamic = "force-dynamic";

const ADMIN_NAV: SidebarNavItem[] = [
  { href: "/admin/dashboard", label: "Dashboard", icon: "LayoutDashboard" },
  { href: "/admin/experts", label: "Expert Profiles", icon: "UserCheck" },
  { href: "/admin/services", label: "Services", icon: "Briefcase" },
  { href: "/admin/courses", label: "Courses", icon: "GraduationCap" },
  { href: "/admin/leads", label: "Leads & Inquiries", icon: "MessageSquare" },
  { href: "/admin/portfolio", label: "Portfolio", icon: "FolderOpen" },
  { href: "/admin/blog", label: "Blog", icon: "FileText" },
  { href: "/admin/settings", label: "Settings", icon: "Settings" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) {
    redirect("/staff/login?callbackUrl=/admin/dashboard");
  }

  const role = (session.user as { role?: string })?.role;
  if (role !== "ADMIN") {
    redirect("/unauthorized");
  }

  return (
    <PortalLayout navItems={ADMIN_NAV} role="ADMIN" portalName="Admin" allowedRoles={["ADMIN"]}>
      {children}
    </PortalLayout>
  );
}
