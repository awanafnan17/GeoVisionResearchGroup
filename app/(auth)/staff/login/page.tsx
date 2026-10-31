import type { Metadata } from "next";
import { Suspense } from "react";
import StaffLoginForm from "./StaffLoginForm";

export const metadata: Metadata = {
  title: "Staff Operations Console — Sign In",
  description:
    "Restricted administrative console for Geo Vision operations and screening personnel.",
  robots: { index: false, follow: false },
};

export default function StaffLoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#060B14] text-geo-white px-4 py-12 relative overflow-hidden">
      {/* Background Cartographic Stratum Grid */}
      <div className="absolute inset-0 geo-grid-bg opacity-25 pointer-events-none" />

      {/* Decorative Technical Ambient Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-gradient-to-b from-slate-800/20 via-transparent to-transparent blur-3xl pointer-events-none" />

      <div className="relative z-10 w-full max-w-[480px]">
        <Suspense
          fallback={
            <div className="text-center text-slate-400 font-mono text-xs uppercase tracking-[0.2em]">
              Initializing Staff Console...
            </div>
          }
        >
          <StaffLoginForm />
        </Suspense>
      </div>
    </div>
  );
}
