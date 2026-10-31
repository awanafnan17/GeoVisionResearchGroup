import type { Metadata } from "next";
import Link from "next/link";
import { ShieldAlert, ArrowLeft, Lock, UserCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Access Restricted",
  description: "You do not have permission to view this portal or resource.",
  robots: { index: false, follow: false },
};

export default function UnauthorizedPage() {
  return (
    <main className="min-h-screen bg-[#060B14] text-slate-100 flex items-center justify-center relative px-6 py-20 geo-grid-bg overflow-hidden">
      {/* Subtle Atmospheric Radial Glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-gradient-radial from-amber-500/10 via-rose-500/5 to-transparent blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      {/* Frosted Glass Container */}
      <div className="relative max-w-xl w-full bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-8 sm:p-12 shadow-[0_24px_50px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.08)]">
        {/* Top Status Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.8)]" />
            <span className="font-mono text-xs font-semibold uppercase tracking-wider text-amber-400">
              403
            </span>
            <span className="text-white/20 text-xs">•</span>
            <span className="text-xs font-sans text-slate-400">Access Restricted</span>
          </div>
          <span className="text-xs font-sans font-medium text-slate-400">
            Geo Vision Research Group
          </span>
        </div>

        {/* Icon & Headline */}
        <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(245,158,11,0.15)]">
          <ShieldAlert className="w-6 h-6 text-amber-400" />
        </div>

        <h1 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight text-white mb-3">
          Access Restricted
        </h1>
        <p className="text-sm sm:text-base text-slate-300 font-sans leading-relaxed mb-8">
          You do not have permission to view this portal or resource. If you believe this is an error or require elevated privileges, please contact your administrator.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-6 border-t border-white/10">
          <Link href="/" className="btn-primary">
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Homepage</span>
          </Link>
          <Link href="/login" className="btn-secondary">
            <Lock className="w-4 h-4" />
            <span>Member Login</span>
          </Link>
          <Link href="/staff/login" className="btn-outline">
            <UserCheck className="w-4 h-4" />
            <span>Staff Login</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
