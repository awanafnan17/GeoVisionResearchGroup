import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { PortalLayout } from "@/components/portals/shared/PortalLayout";
import type { SidebarNavItem } from "@/components/portals/shared/Sidebar";

export const dynamic = "force-dynamic";

const STUDENT_NAV: SidebarNavItem[] = [
  { href: "/student/dashboard", label: "Dashboard", icon: "LayoutDashboard" },
  { href: "/student/courses", label: "My Courses", icon: "GraduationCap" },
  { href: "/student/payments", label: "Payments & Invoices", icon: "CreditCard" },
  { href: "/student/settings", label: "Account Settings", icon: "Settings" },
];

export default async function StudentLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) {
    redirect("/login?callbackUrl=/student/dashboard");
  }

  const role = (session.user as { role?: string })?.role;
  if (role !== "STUDENT") {
    redirect("/unauthorized");
  }

  return (
    <PortalLayout navItems={STUDENT_NAV} role="STUDENT" portalName="Student" allowedRoles={["STUDENT"]}>
      {children}
    </PortalLayout>
  );
}
