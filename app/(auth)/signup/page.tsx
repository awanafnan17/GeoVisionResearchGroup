import type { Metadata } from "next";
import { Suspense } from "react";
import SignupForm from "./SignupForm";
import LoginScene from "../login/LoginScene";

export const metadata: Metadata = {
  title: "Create Account — Student Portal",
  description:
    "Register for a student account to enroll in courses, receive certificates, and access research materials.",
};

export default function SignupPage() {
  return (
    <div className="min-h-screen flex bg-[#060B14] text-geo-white font-sans">
      {/* Left - Cartographic & Academic Dossier Panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden border-r border-white/10">
        <LoginScene />
      </div>

      {/* Right - Registration Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center relative py-12 px-4 sm:px-6">
        <div className="absolute inset-0 geo-grid-bg opacity-30 pointer-events-none" />
        <div className="relative z-10 w-full max-w-[480px]">
          <Suspense
            fallback={
              <div className="text-center text-slate-400 font-mono text-xs uppercase tracking-[0.2em]">
                Initializing Registration Desk...
              </div>
            }
          >
            <SignupForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
