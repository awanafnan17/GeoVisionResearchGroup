"use client";

import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Mail, Lock, Eye, EyeOff, AlertCircle, ShieldAlert, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { getSafeStaffRedirect } from "@/lib/auth-redirect";
import Link from "next/link";

const staffLoginSchema = z.object({
  email: z.string().email("Please enter a valid institutional email"),
  password: z.string().min(1, "Password is required"),
});

type StaffLoginFormData = z.infer<typeof staffLoginSchema>;

export default function StaffLoginForm() {
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLocked, setIsLocked] = useState(false);
  const [lockTimeRemaining, setLockTimeRemaining] = useState(0);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<StaffLoginFormData>({
    resolver: zodResolver(staffLoginSchema),
  });

  useEffect(() => {
    if (!isLocked || lockTimeRemaining <= 0) return;
    const interval = setInterval(() => {
      setLockTimeRemaining((prev) => {
        if (prev <= 1) {
          setIsLocked(false);
          setError(null);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isLocked, lockTimeRemaining]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  async function onSubmit(data: StaffLoginFormData) {
    setIsLoading(true);
    setError(null);

    try {
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        loginChannel: "staff",
        redirect: false,
      });

      if (result?.error) {
        if (result.error.includes("locked")) {
          setIsLocked(true);
          setLockTimeRemaining(15 * 60);
          setError("Administrative access temporarily locked due to repeated failures.");
        } else if (result.error.includes("inactive")) {
          setError("This administrative account has been deactivated. Contact SuperAdmin.");
        } else {
          setError(
            "Invalid credentials or unauthorized login channel. Staff console is restricted to authorized operations personnel."
          );
        }
        return;
      }

      if (result?.ok) {
        const sessionRes = await fetch("/api/auth/session");
        const sessionData = await sessionRes.json();
        const role = sessionData?.user?.role as string | undefined;

        const callbackUrl = searchParams.get("callbackUrl");
        const safeDestination = getSafeStaffRedirect(role ?? "", callbackUrl);

        window.location.assign(safeDestination);
      }
    } catch {
      setError("An unexpected error occurred while communicating with the auth service.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="border border-white/15 bg-[#0B1320] shadow-[0_24px_64px_rgba(0,0,0,0.7)]">
      {/* Top Administrative Status Bar */}
      <div className="px-6 py-3 border-b border-white/10 bg-[#070D16] flex items-center justify-between text-[10px] font-mono uppercase tracking-[0.2em] text-slate-400">
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-slate-200">STAFF OPERATIONS CONSOLE • RESTRICTED ACCESS</span>
        </div>
        <Link href="/" className="hover:text-white transition-colors">
          &larr; Public Website
        </Link>
      </div>

      <div className="p-6 sm:p-8">
        {/* Header */}
        <div className="mb-6 pb-5 border-b border-white/10">
          <div className="flex items-center gap-2 mb-2">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            <p className="text-[11px] font-mono uppercase tracking-[0.2em] text-slate-300">
              Geo Vision Governance
            </p>
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading font-medium text-white tracking-[-0.02em]">
            Administrative Console Sign In
          </h1>
          <p className="text-xs font-mono text-slate-400 mt-1.5 leading-relaxed">
            Restricted access for SuperAdmin, Admin, and GeoSentry Operations personnel.
          </p>
        </div>

        {/* Notice: No self-registration */}
        <div className="mb-6 p-3 bg-slate-900/80 border border-slate-700/60 rounded-none text-xs font-mono text-slate-300 leading-relaxed">
          Staff credentials are provisioned exclusively by authorized administrators. No public self-registration.
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Input
              label="Institutional Email"
              type="email"
              placeholder="operator@geovisionresearchgroup.com"
              autoComplete="email"
              leftIcon={<Mail className="h-4 w-4" />}
              error={errors.email?.message}
              {...register("email")}
            />
          </div>

          <div>
            <Input
              label="Password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter administrative password"
              autoComplete="current-password"
              leftIcon={<Lock className="h-4 w-4" />}
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-slate-400 hover:text-white transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              }
              error={errors.password?.message}
              {...register("password")}
            />
          </div>

          {/* Error Banner */}
          {error && !isLocked && (
            <div
              role="alert"
              className="flex items-start gap-2.5 border border-[#A93528]/60 bg-[#A93528]/15 p-3 text-xs font-mono text-[#E07A6F]"
            >
              <AlertCircle className="h-4 w-4 text-[#E07A6F] mt-0.5 shrink-0" />
              <p>{error}</p>
            </div>
          )}

          {/* Locked State */}
          {isLocked && (
            <div
              role="alert"
              className="flex items-start gap-2.5 border border-amber-500/50 bg-amber-500/15 p-3 text-xs font-mono text-amber-200"
            >
              <ShieldAlert className="h-4 w-4 text-amber-400 mt-0.5 shrink-0" />
              <div>
                <p className="font-semibold uppercase tracking-[0.12em]">
                  Security Lockout Active
                </p>
                <p className="mt-1 text-slate-300">
                  Too many failed attempts. Try again in {formatTime(lockTimeRemaining)}
                </p>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="pt-2">
            <Button
              type="submit"
              className="w-full rounded-none font-mono uppercase tracking-[0.16em] bg-slate-800 hover:bg-slate-700 text-white border border-slate-600"
              size="lg"
              isLoading={isLoading}
              disabled={isLocked}
            >
              {isLoading ? "Authenticating Console..." : "Authenticate Staff Console"}
            </Button>
          </div>
        </form>

        {/* Footer */}
        <div className="mt-8 pt-4 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-slate-400">
          <span>Member or Student?</span>
          <Link
            href="/login"
            className="text-slate-300 hover:text-white underline transition-colors"
          >
            Member Portal Sign In &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}
