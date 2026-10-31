"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

const labelMap: Record<string, string> = {
  superadmin: "Super Admin",
  admin: "Admin",
  expert: "Expert",
  "geosentry-portal": "GeoSentry",
  student: "Student",
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

export function Breadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length === 0) return null;

  const portalRoot = `/${segments[0]}/dashboard`;

  return (
    <nav
      className="hidden sm:flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.14em]"
      aria-label="Breadcrumb"
    >
      <Link
        href={portalRoot}
        className="text-geo-slate hover:text-geo-gold transition-colors"
      >
        ROOT
      </Link>
      {segments.map((seg, i) => {
        const label =
          labelMap[seg] ||
          seg.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
        const href = i === 0 ? portalRoot : "/" + segments.slice(0, i + 1).join("/");
        const isLast = i === segments.length - 1;

        return (
          <span key={href + i} className="flex items-center gap-1.5">
            <span className="text-geo-gold/50">/</span>
            {isLast ? (
              <span className="text-geo-white font-medium">{label}</span>
            ) : (
              <Link
                href={href}
                className="text-geo-slate hover:text-geo-white transition-colors"
              >
                {label}
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}
