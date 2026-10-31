import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { PortalLayout } from "@/components/portals/shared/PortalLayout";
import type { SidebarNavItem } from "@/components/portals/shared/Sidebar";

export const dynamic = "force-dynamic";

const EXPERT_NAV: SidebarNavItem[] = [
  { href: "/expert/dashboard", label: "Dashboard", icon: "LayoutDashboard" },
  { href: "/expert/profile", label: "My Profile", icon: "User" },
  { href: "/expert/publications", label: "Publications", icon: "BookOpen" },
  { href: "/expert/projects", label: "My Projects", icon: "FolderOpen" },
  { href: "/expert/leads", label: "Assigned Leads", icon: "MessageSquare" },
  { href: "/expert/cv", label: "CV Management", icon: "FileText" },
  { href: "/expert/settings", label: "Settings", icon: "Settings" },
];

export default async function ExpertLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) {
    redirect("/login?callbackUrl=/expert/dashboard");
  }

  const role = (session.user as { role?: string })?.role;
  if (role !== "EXPERT") {
    redirect("/unauthorized");
  }

  return (
    <PortalLayout navItems={EXPERT_NAV} role="EXPERT" portalName="Expert" allowedRoles={["EXPERT"]}>
      {children}
    </PortalLayout>
  );
}
