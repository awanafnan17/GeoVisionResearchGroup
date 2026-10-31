import Link from "next/link";
import {
  ArrowLeft,
  Briefcase,
  GraduationCap,
  ShieldCheck,
  Mail,
} from "lucide-react";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[#060B14] text-slate-100 flex items-center justify-center relative px-6 py-20 geo-grid-bg overflow-hidden">
      {/* Subtle Atmospheric Radial Glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-emerald-500/10 via-cyan-500/5 to-transparent blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      {/* Frosted Glass Container */}
      <div className="relative max-w-2xl w-full bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-8 sm:p-12 shadow-[0_24px_50px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.08)]">
        {/* Top Status Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
            <span className="font-mono text-xs font-semibold uppercase tracking-wider text-emerald-400">
              404
            </span>
            <span className="text-white/20 text-xs">•</span>
            <span className="text-xs font-sans text-slate-400">Resource Unavailable</span>
          </div>
          <span className="text-xs font-sans font-medium text-slate-400">
            Geo Vision Research Group
          </span>
        </div>

        {/* Status Display & Headline */}
        <div className="mb-6">
          <h1 className="font-heading text-3xl sm:text-5xl font-bold tracking-tight text-white mb-3">
            Page Not Found
          </h1>
          <p className="text-sm sm:text-base text-slate-300 font-sans leading-relaxed max-w-xl">
            The page you are looking for doesn&apos;t exist or has been moved. Use the links below to return to the public website.
          </p>
        </div>

        {/* Primary Action Button */}
        <div className="pt-2 pb-6 border-b border-white/10">
          <Link href="/" className="btn-primary">
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Homepage</span>
          </Link>
        </div>

        {/* Clean Public Navigation Grid */}
        <div className="mt-6">
          <p className="text-xs font-sans font-medium uppercase tracking-wider text-slate-400 mb-3">
            Explore Public Website
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <Link
              href="/services"
              className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-emerald-500/40 text-xs font-sans font-medium text-slate-200 hover:text-white transition-all duration-200"
            >
              <Briefcase className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span className="truncate">Services</span>
            </Link>
            <Link
              href="/courses"
              className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-emerald-500/40 text-xs font-sans font-medium text-slate-200 hover:text-white transition-all duration-200"
            >
              <GraduationCap className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span className="truncate">Courses</span>
            </Link>
            <Link
              href="/geosentry"
              className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-emerald-500/40 text-xs font-sans font-medium text-slate-200 hover:text-white transition-all duration-200"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="truncate">GeoSentry</span>
            </Link>
            <Link
              href="/contact"
              className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-emerald-500/40 text-xs font-sans font-medium text-slate-200 hover:text-white transition-all duration-200"
            >
              <Mail className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span className="truncate">Contact</span>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
