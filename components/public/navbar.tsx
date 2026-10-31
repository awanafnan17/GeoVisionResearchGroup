"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/geosentry", label: "GeoSentry", highlight: true },
  { href: "/team", label: "Experts" },
  { href: "/courses", label: "Courses" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/blog", label: "Research & Blog" },
  { href: "/contact", label: "Contact" },
] as const;

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  const toggleMobile = useCallback(() => {
    setMobileOpen((prev) => !prev);
  }, []);

  const closeMobile = useCallback(() => {
    setMobileOpen(false);
  }, []);

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 bg-[#060B14]/80 backdrop-blur-md border-b border-white/10"
      role="banner"
    >
      {/* Main Frosted-Glass Navigation Bar */}
      <nav
        className="container-custom flex items-center justify-between h-16 lg:h-[72px]"
        aria-label="Main navigation"
      >
        {/* Brand Mark (Modern geometric strata icon, clean typography, zero slashes) */}
        <Link
          href="/"
          className="flex items-center gap-3 group shrink-0"
          aria-label="Geo Vision Research Group - Home"
          onClick={closeMobile}
        >
          <div className="relative flex items-center justify-center w-9 h-9 rounded-lg bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border border-emerald-500/30 group-hover:border-emerald-400/60 transition-all duration-300 shadow-[0_0_16px_rgba(16,185,129,0.15)]">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="w-5 h-5 text-emerald-400 group-hover:scale-105 transition-transform duration-300"
              aria-hidden="true"
            >
              <path
                d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-heading font-bold text-white tracking-tight leading-none group-hover:text-emerald-300 transition-colors">
              Geo Vision
            </span>
            <span className="text-[10px] font-sans font-medium text-slate-400 tracking-wider uppercase leading-tight mt-1">
              Research Group
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <div
          className="hidden lg:flex items-center gap-1 xl:gap-2 h-full"
          role="menubar"
        >
          {NAV_LINKS.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <Link
                key={link.href}
                href={link.href}
                role="menuitem"
                className={cn(
                  "relative inline-flex items-center gap-2 px-3 py-2 text-xs font-sans font-medium rounded-lg transition-all duration-200",
                  isActive
                    ? "text-emerald-400 bg-white/[0.08] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]"
                    : "text-slate-300 hover:text-white hover:bg-white/[0.04]",
                  "highlight" in link && link.highlight && !isActive && "text-slate-200"
                )}
              >
                {"highlight" in link && link.highlight && (
                  <span
                    className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.8)] inline-block shrink-0"
                    aria-hidden="true"
                  />
                )}
                <span>{link.label}</span>
                {isActive && (
                  <span
                    className="absolute -bottom-[15px] left-3 right-3 h-0.5 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full"
                    aria-hidden="true"
                  />
                )}
              </Link>
            );
          })}
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="hidden lg:inline-flex items-center gap-2 px-4 py-2 text-xs font-sans font-semibold rounded-lg bg-white/10 hover:bg-white/15 text-white border border-white/15 hover:border-emerald-500/40 backdrop-blur-md shadow-[0_4px_16px_rgba(0,0,0,0.3)] transition-all duration-200 active:scale-[0.98]"
          >
            <span>Sign In</span>
          </Link>

          <Link
            href="/signup"
            className="hidden lg:inline-flex items-center gap-2 px-4 py-2 text-xs font-sans font-semibold rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all duration-200 active:scale-[0.98]"
          >
            <span>Create Account</span>
          </Link>

          {/* Mobile Hamburger Button (CRITICAL: matches button[aria-label*="menu" i] and header button.lg:hidden) */}
          <button
            type="button"
            className="lg:hidden flex items-center justify-center w-10 h-10 rounded-lg border border-white/10 bg-white/5 text-slate-200 hover:text-white hover:border-emerald-500/30 hover:bg-white/10 transition-colors"
            onClick={toggleMobile}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-5 h-5"
              aria-hidden="true"
            >
              {mobileOpen ? (
                <path d="M18 6L6 18M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </nav>

      {/* Modern Frosted-Glass Mobile Drawer */}
      <div
        id="mobile-menu"
        className={cn(
          "lg:hidden border-t border-white/10 bg-[#060B14]/95 backdrop-blur-xl overflow-hidden transition-all duration-300",
          mobileOpen
            ? "max-h-[640px] pb-6 border-b border-white/10 opacity-100 shadow-[0_20px_40px_rgba(0,0,0,0.8)]"
            : "max-h-0 opacity-0 pointer-events-none"
        )}
        role="menu"
        aria-hidden={!mobileOpen}
      >
        <div className="container-custom pt-3 space-y-1">
          {NAV_LINKS.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <Link
                key={link.href}
                href={link.href}
                role="menuitem"
                onClick={closeMobile}
                className={cn(
                  "flex items-center justify-between py-2.5 px-3 rounded-lg text-sm font-sans font-medium transition-colors",
                  isActive
                    ? "text-emerald-400 bg-white/[0.08]"
                    : "text-slate-300 hover:text-white hover:bg-white/[0.04]"
                )}
              >
                <span className="flex items-center gap-2.5">
                  {"highlight" in link && link.highlight && (
                    <span
                      className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.8)]"
                      aria-hidden="true"
                    />
                  )}
                  <span>{link.label}</span>
                </span>
                <span className="text-slate-500 text-xs">&rarr;</span>
              </Link>
            );
          })}

          <div className="pt-3 border-t border-white/10 grid grid-cols-2 gap-2 text-xs font-sans font-medium">
            <Link
              href="/about"
              onClick={closeMobile}
              className="py-2.5 px-3 rounded-lg border border-white/10 bg-white/5 text-slate-300 hover:text-white hover:bg-white/10 text-center transition-colors"
            >
              About Us
            </Link>
            <Link
              href="/publications"
              onClick={closeMobile}
              className="py-2.5 px-3 rounded-lg border border-white/10 bg-white/5 text-slate-300 hover:text-white hover:bg-white/10 text-center transition-colors"
            >
              Publications
            </Link>
          </div>

          <div className="pt-3 grid grid-cols-2 gap-2">
            <Link
              href="/login"
              onClick={closeMobile}
              className="flex items-center justify-center py-2.5 px-3 rounded-lg text-xs font-sans font-semibold text-slate-200 bg-white/10 hover:bg-white/15 border border-white/10 transition-colors"
            >
              <span>Sign In</span>
            </Link>
            <Link
              href="/signup"
              onClick={closeMobile}
              className="flex items-center justify-center py-2.5 px-3 rounded-lg text-xs font-sans font-semibold text-slate-950 bg-emerald-500 hover:bg-emerald-400 transition-colors"
            >
              <span>Create Account</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
