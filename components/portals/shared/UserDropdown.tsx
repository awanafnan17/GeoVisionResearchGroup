"use client";

import { useState, useRef, useEffect } from "react";
import { signOut } from "next-auth/react";
import { useSession } from "@/hooks/useSession";
import { Avatar } from "@/components/ui/Avatar";
import { ChevronDown, User, Settings, LogOut } from "lucide-react";
import Link from "next/link";

const roleProfileLinks: Record<string, string> = {
  SUPERADMIN: "/superadmin/settings",
  ADMIN: "/admin/settings",
  EXPERT: "/expert/profile",
  GEOSENTRY_MANAGER: "/geosentry-portal/settings",
  STUDENT: "/student/settings",
};

export function UserDropdown() {
  const { user } = useSession();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!user) return null;

  const profileLink = roleProfileLinks[user.role] ?? "/";

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-2.5 py-1.5 rounded-none border border-transparent hover:border-white/15 hover:bg-white/[0.04] transition-colors"
      >
        <Avatar src={user.image} name={user.name} size="sm" />
        <span className="hidden md:block text-xs font-medium text-geo-white max-w-[130px] truncate">
          {user.name}
        </span>
        <ChevronDown className="h-3.5 w-3.5 text-geo-slate" />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1.5 w-60 bg-[#09101B] border border-white/15 rounded-none py-1 z-50">
          <div className="px-3.5 py-2.5 border-b border-white/10 bg-[#0B1320]">
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-geo-gold mb-0.5">
              {user.role?.replace(/_/g, " ")}
            </p>
            <p className="text-xs font-medium text-geo-white truncate">{user.name}</p>
            <p className="font-mono text-[11px] text-geo-slate truncate">{user.email}</p>
          </div>

          <Link
            href={profileLink}
            onClick={() => setOpen(false)}
            className="flex items-center gap-2.5 px-3.5 py-2 font-mono text-[11px] uppercase tracking-[0.14em] text-geo-slate-light hover:text-geo-gold hover:bg-white/[0.04] transition-colors"
          >
            <User className="h-3.5 w-3.5" />
            My Profile
          </Link>

          <Link
            href={profileLink}
            onClick={() => setOpen(false)}
            className="flex items-center gap-2.5 px-3.5 py-2 font-mono text-[11px] uppercase tracking-[0.14em] text-geo-slate-light hover:text-geo-gold hover:bg-white/[0.04] transition-colors"
          >
            <Settings className="h-3.5 w-3.5" />
            Settings
          </Link>

          <div className="border-t border-white/10 my-1" />

          <button
            type="button"
            onClick={() => {
              const isStaff = ["SUPERADMIN", "ADMIN", "GEOSENTRY_MANAGER"].includes(user.role ?? "");
              signOut({ callbackUrl: isStaff ? "/staff/login" : "/login" });
            }}
            className="flex items-center gap-2.5 w-full px-3.5 py-2 font-mono text-[11px] uppercase tracking-[0.14em] text-geo-slate-light hover:text-[#E07A6F] hover:bg-[#A93528]/10 transition-colors"
          >
            <LogOut className="h-3.5 w-3.5" />
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
}
