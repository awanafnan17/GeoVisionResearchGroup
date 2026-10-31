"use client";

import { useState, useRef, useEffect } from "react";
import { Bell } from "lucide-react";

export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const count = 0;

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-label="Notifications"
        onClick={() => setOpen(!open)}
        className="relative h-8 w-8 flex items-center justify-center rounded-none border border-white/10 bg-[#0B1320] text-geo-slate-light hover:text-geo-white hover:border-geo-gold/40 transition-colors"
      >
        <Bell className="h-4 w-4" />
        {count > 0 && (
          <span className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center rounded-none bg-[#A93528] font-mono text-[10px] font-bold text-geo-white">
            {count}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1.5 w-72 bg-[#09101B] border border-white/15 rounded-none z-50">
          <div className="px-4 py-2.5 border-b border-white/10 bg-[#0B1320] flex items-center justify-between">
            <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-geo-white">
              SYSTEM ALERTS • LOG
            </span>
            <span className="font-mono text-[10px] text-geo-gold tabular-nums">0 UNREAD</span>
          </div>
          <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
            <div className="h-9 w-9 border border-white/10 bg-[#101A2B] flex items-center justify-center mb-2.5">
              <Bell className="h-4 w-4 text-geo-slate" />
            </div>
            <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-geo-slate-light">
              No Active Alerts
            </p>
            <p className="text-xs text-geo-slate mt-1">
              All institutional queues operating within nominal thresholds.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
