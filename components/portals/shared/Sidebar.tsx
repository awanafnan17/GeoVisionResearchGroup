"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";
import { Avatar } from "@/components/ui/Avatar";
import {
  ChevronLeft,
  ChevronRight,
  LogOut,
  X,
  LayoutDashboard,
  Users,
  UserCheck,
  Briefcase,
  GraduationCap,
  MessageSquare,
  FolderOpen,
  FileText,
  Settings,
  Shield,
  Search,
  User,
  BookOpen,
  CreditCard,
  Plus,
  CheckCircle,
  BarChart2,
  Clock,
  Globe,
} from "lucide-react";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  LayoutDashboard,
  Users,
  UserCheck,
  Briefcase,
  GraduationCap,
  MessageSquare,
  FolderOpen,
  FileText,
  Settings,
  Shield,
  Search,
  User,
  BookOpen,
  CreditCard,
  Plus,
  CheckCircle,
  BarChart2,
  Clock,
};

export interface SidebarNavItem {
  href: string;
  label: string;
  icon: string;
  section?: string;
}

interface SidebarProps {
  navItems: SidebarNavItem[];
  role: string;
  userName: string;
  userEmail: string;
  userImage?: string | null;
  isCollapsed: boolean;
  isMobileOpen: boolean;
  isStaffConsole?: boolean;
  onToggleCollapse: () => void;
  onCloseMobile: () => void;
}

const ROLE_DESCRIPTORS: Record<string, { code: string; title: string }> = {
  SUPERADMIN: { code: "SUPERADMIN", title: "Executive Command Console" },
  ADMIN: { code: "ADMIN", title: "Practice Operations Console" },
  GEOSENTRY_MANAGER: { code: "GEOSENTRY", title: "Screening Management Desk" },
  EXPERT: { code: "EXPERT", title: "Specialist Workspace" },
  STUDENT: { code: "STUDENT", title: "Learning Workspace" },
};

function inferSection(item: SidebarNavItem, isStaff: boolean, role: string): string {
  if (item.section) return item.section;
  const h = item.href.toLowerCase();

  if (isStaff) {
    if (h.endsWith("/dashboard")) return "Overview";
    if (
      h.includes("/users") ||
      h.includes("/experts") ||
      h.includes("/services") ||
      h.includes("/courses") ||
      h.includes("/leads")
    ) {
      return "Practice Operations";
    }
    if (
      h.includes("/portfolio") ||
      h.includes("/blog") ||
      h.includes("/geosentry") ||
      h.includes("/delivered") ||
      h.includes("/analytics") ||
      h.includes("/requests") ||
      h.includes("/new-request")
    ) {
      return "Research & Screening";
    }
    if (
      h.includes("/settings") ||
      h.includes("/audit-logs") ||
      h.includes("/payments")
    ) {
      return "Governance & System";
    }
    return "Practice Operations";
  }

  if (role === "STUDENT") {
    if (h.endsWith("/dashboard") || h.includes("/courses")) return "Courses & Learning";
    return "Billing & Account";
  }

  if (role === "EXPERT") {
    if (h.endsWith("/dashboard")) return "Specialist Overview";
    if (
      h.includes("/publications") ||
      h.includes("/projects") ||
      h.includes("/cv") ||
      h.includes("/portfolio")
    ) {
      return "Research & Portfolio";
    }
    if (h.includes("/leads")) return "Client Engagement";
    return "Account";
  }

  return "Workspace";
}

export function Sidebar({
  navItems,
  role,
  userName,
  userEmail,
  userImage,
  isCollapsed,
  isMobileOpen,
  isStaffConsole,
  onToggleCollapse,
  onCloseMobile,
}: SidebarProps) {
  const pathname = usePathname();
  const isStaff = isStaffConsole ?? ["SUPERADMIN", "ADMIN", "GEOSENTRY_MANAGER"].includes(role);
  const roleMeta = ROLE_DESCRIPTORS[role] || {
    code: role,
    title: role.replace(/_/g, " "),
  };

  // Group items by role-appropriate structured navigation groups
  const rawGroupedSections: { section: string; items: SidebarNavItem[] }[] = [];
  for (const item of navItems) {
    const sec = inferSection(item, isStaff, role);
    const existing = rawGroupedSections.find((g) => g.section === sec);
    if (existing) {
      existing.items.push(item);
    } else {
      rawGroupedSections.push({ section: sec, items: [item] });
    }
  }

  const staffOrder = ["Overview", "Practice Operations", "Research & Screening", "Governance & System"];
  const studentOrder = ["Courses & Learning", "Billing & Account"];
  const expertOrder = ["Specialist Overview", "Research & Portfolio", "Client Engagement", "Account"];
  const orderMap = isStaff ? staffOrder : role === "STUDENT" ? studentOrder : expertOrder;

  rawGroupedSections.sort((a, b) => {
    const idxA = orderMap.indexOf(a.section);
    const idxB = orderMap.indexOf(b.section);
    if (idxA !== -1 && idxB !== -1) return idxA - idxB;
    if (idxA !== -1) return -1;
    if (idxB !== -1) return 1;
    return a.section.localeCompare(b.section);
  });

  const groupedSections = rawGroupedSections;

  return (
    <>
      {/* Mobile backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/75 backdrop-blur-[1px] md:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-screen flex flex-col bg-[#09101B] border-r border-white/10 transition-all duration-300",
          isCollapsed ? "w-[68px]" : "w-[260px]",
          isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        {/* Monogram Header */}
        <div className="h-14 flex items-center justify-between px-4 border-b border-white/10 bg-[#0B1320]/60 shrink-0">
          {!isCollapsed ? (
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className={cn("h-2 w-2 shrink-0", isStaff ? "bg-geo-gold" : "bg-emerald-400")} />
                <span className="font-mono text-[11px] font-semibold text-geo-white uppercase tracking-[0.18em] truncate">
                  {isStaff ? "GEO VISION • CONSOLE" : "GEO VISION • WORKSPACE"}
                </span>
              </div>
              <p className={cn("font-mono text-[9px] uppercase tracking-[0.2em] mt-0.5 pl-4 truncate", isStaff ? "text-geo-gold/80" : "text-emerald-400/80")}>
                {roleMeta.title}
              </p>
            </div>
          ) : (
            <span className={cn("font-mono text-xs font-semibold tracking-widest mx-auto border px-1.5 py-0.5", isStaff ? "text-geo-gold border-geo-gold/40 bg-geo-gold/10" : "text-emerald-400 border-emerald-500/40 bg-emerald-500/10")}>
              GV
            </span>
          )}
          <button
            type="button"
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            onClick={onToggleCollapse}
            className="hidden md:flex h-7 w-7 items-center justify-center rounded-none border border-transparent hover:border-white/15 text-geo-slate-light hover:text-geo-white hover:bg-white/[0.04] transition-colors shrink-0"
          >
            {isCollapsed ? <ChevronRight className="h-3.5 w-3.5" /> : <ChevronLeft className="h-3.5 w-3.5" />}
          </button>
          <button
            type="button"
            aria-label="Close mobile navigation menu"
            onClick={onCloseMobile}
            className="md:hidden h-8 w-8 flex items-center justify-center rounded-none border border-white/10 text-geo-slate-light hover:text-geo-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Navigation Rail */}
        <nav className="flex-1 overflow-y-auto py-3 px-2.5 space-y-4">
          {groupedSections.map((group) => (
            <div key={group.section} className="space-y-0.5">
              {!isCollapsed && (
                <div className="px-2.5 pt-1 pb-1.5 flex items-center gap-2">
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-geo-slate">
                    {group.section}
                  </span>
                  <span className="h-px flex-1 bg-white/[0.06]" />
                </div>
              )}
              {group.items.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.href !== "/" && pathname.startsWith(item.href + "/"));
                const IconComponent = iconMap[item.icon] || LayoutDashboard;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onCloseMobile}
                    title={isCollapsed ? item.label : undefined}
                    className={cn(
                      "flex items-center gap-3 rounded-none px-3 py-2 text-[13px] font-sans transition-colors duration-150 group relative border-l-2",
                      isActive
                        ? "border-geo-gold bg-white/[0.04] text-geo-white font-medium"
                        : "border-transparent text-geo-slate-light hover:text-geo-white hover:bg-white/[0.025]",
                      isCollapsed && "justify-center px-0"
                    )}
                  >
                    <IconComponent
                      className={cn(
                        "h-4 w-4 shrink-0 transition-colors",
                        isActive ? "text-geo-gold" : "text-geo-slate group-hover:text-geo-slate-light"
                      )}
                    />
                    {!isCollapsed && <span className="truncate">{item.label}</span>}
                  </Link>
                );
              })}
            </div>
          ))}

          {!isStaff && (
            <div className="pt-3 mt-2 border-t border-white/10 space-y-1">
              {!isCollapsed && (
                <div className="px-2.5 pt-1 pb-1 flex items-center gap-2">
                  <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-slate-400">
                    Quick Links
                  </span>
                  <span className="h-px flex-1 bg-white/[0.06]" />
                </div>
              )}
              <Link
                href="/courses"
                title={isCollapsed ? "Browse Courses" : undefined}
                className={cn(
                  "flex items-center gap-3 rounded-none px-3 py-2 text-[13px] font-sans text-slate-300 hover:text-white hover:bg-white/[0.025] transition-colors border-l-2 border-transparent",
                  isCollapsed && "justify-center px-0"
                )}
              >
                <BookOpen className="h-4 w-4 text-emerald-400 shrink-0" />
                {!isCollapsed && <span>Browse Courses</span>}
              </Link>
              <Link
                href="/"
                title={isCollapsed ? "Public Website" : undefined}
                className={cn(
                  "flex items-center gap-3 rounded-none px-3 py-2 text-[13px] font-sans text-slate-300 hover:text-white hover:bg-white/[0.025] transition-colors border-l-2 border-transparent",
                  isCollapsed && "justify-center px-0"
                )}
              >
                <Globe className="h-4 w-4 text-cyan-400 shrink-0" />
                {!isCollapsed && <span>Public Website</span>}
              </Link>
            </div>
          )}
        </nav>

        {/* Bottom Operator Dossier */}
        <div className="border-t border-white/10 bg-[#0B1320]/80 p-3 space-y-2.5 shrink-0">
          <div className={cn("flex items-center justify-between", isCollapsed ? "justify-center" : "px-1")}>
            <span className="font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-geo-gold">
              {isCollapsed ? role.charAt(0) : role.replace(/_/g, " ")}
            </span>
            {!isCollapsed && (
              <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-geo-slate">
                {roleMeta.code}
              </span>
            )}
          </div>

          {!isCollapsed && (
            <div className="flex items-center gap-2.5 px-1 py-1.5 border-y border-white/[0.06]">
              <Avatar src={userImage} name={userName} size="sm" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-geo-white truncate">{userName}</p>
                <p className="font-mono text-[10px] text-geo-slate truncate">{userEmail}</p>
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={() => signOut({ callbackUrl: isStaff ? "/staff/login" : "/login" })}
            className={cn(
              "flex items-center gap-2.5 w-full rounded-none px-2.5 py-2 font-mono text-[11px] uppercase tracking-[0.14em] text-geo-slate-light hover:text-[#E07A6F] hover:bg-[#A93528]/10 border border-transparent hover:border-[#A93528]/30 transition-colors",
              isCollapsed && "justify-center px-0"
            )}
          >
            <LogOut className="h-3.5 w-3.5 shrink-0" />
            {!isCollapsed && <span>Sign Out</span>}
          </button>
        </div>
      </aside>
    </>
  );
}
