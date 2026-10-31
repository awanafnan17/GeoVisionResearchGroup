"use client";

import { Menu } from "lucide-react";
import Link from "next/link";
import { useSession } from "@/hooks/useSession";
import { Breadcrumbs } from "./Breadcrumbs";
import { NotificationBell } from "./NotificationBell";
import { UserDropdown } from "./UserDropdown";
import { cn } from "@/lib/utils";

interface TopHeaderProps {
  title: string;
  isStaffConsole?: boolean;
  onMobileMenuToggle: () => void;
}

export function TopHeader({ title, isStaffConsole, onMobileMenuToggle }: TopHeaderProps) {
  const { user } = useSession();
  const roleLabel = user?.role ? user.role.replace(/_/g, " ") : "AUTHORIZED";

  return (
    <header className="h-14 sticky top-0 z-30 flex items-center justify-between px-4 md:px-6 bg-[#09101B]/95 backdrop-blur-md border-b border-white/10 shrink-0">
      <div className="flex items-center gap-3 min-w-0">
        <button
          type="button"
          aria-label="Open mobile navigation menu"
          onClick={onMobileMenuToggle}
          className="md:hidden p-2 rounded-none border border-white/10 text-geo-slate-light hover:text-geo-white hover:bg-white/[0.04] transition-colors"
        >
          <Menu className="h-4 w-4" />
        </button>
        <div className="flex items-center gap-3 min-w-0">
          <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-geo-white hidden lg:inline">
            {title}
          </span>
          <span className="hidden lg:inline text-white/25 font-mono text-xs">&bull;</span>
          <Breadcrumbs />
        </div>
      </div>

      <div className="flex items-center gap-2.5 shrink-0">
        {/* Member quick links */}
        {!isStaffConsole && (
          <div className="hidden lg:flex items-center gap-3 mr-2">
            <Link
              href="/courses"
              className="text-xs font-sans text-slate-300 hover:text-white px-2 py-1 rounded hover:bg-white/5 transition-colors"
            >
              Courses
            </Link>
            <Link
              href="/"
              className="text-xs font-sans text-emerald-400 hover:text-emerald-300 px-2 py-1 rounded hover:bg-emerald-500/10 transition-colors"
            >
              Public Site &rarr;
            </Link>
          </div>
        )}

        {/* System status indicator */}
        <div className="hidden xl:flex items-center gap-2 px-2.5 py-1 border border-white/10 bg-[#0B1320] font-mono text-[10px] uppercase tracking-[0.16em] text-geo-slate-light">
          <span className="h-1.5 w-1.5 bg-[#4E7A56]" />
          <span>SYSTEM ONLINE • TLS 1.3</span>
        </div>

        {/* User role badge */}
        <span
          className={cn(
            "hidden sm:inline-flex items-center px-2.5 py-1 border font-mono text-[10px] font-medium uppercase tracking-[0.16em]",
            isStaffConsole
              ? "border-geo-gold/40 bg-geo-gold/10 text-geo-gold-light"
              : "border-emerald-500/40 bg-emerald-500/10 text-emerald-400"
          )}
        >
          {roleLabel}
        </span>

        <NotificationBell />
        <div className="h-5 w-px bg-white/10 mx-0.5" />
        <UserDropdown />
      </div>
    </header>
  );
}
