import type { Metadata } from "next";
import { Suspense } from "react";
import LoginForm from "./LoginForm";
import LoginScene from "./LoginScene";

export const metadata: Metadata = {
  title: "Sign In — Member Portal",
  description: "Sign in to your Geo Vision student learning portal or expert workspace.",
};

export default function LoginPage() {
  return (
    <div className="min-h-screen flex bg-[#060B14] text-geo-white font-sans">
      {/* Left - Cartographic & Academic Dossier Panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden border-r border-white/10">
        <LoginScene />
      </div>

      {/* Right - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center relative py-12 px-4 sm:px-6">
        <div className="absolute inset-0 geo-grid-bg opacity-30 pointer-events-none" />
        <div className="relative z-10 w-full max-w-[480px]">
          <Suspense
            fallback={
              <div className="text-center text-slate-400 font-mono text-xs uppercase tracking-[0.2em]">
                Initializing Member Portal...
              </div>
            }
          >
            <LoginForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
