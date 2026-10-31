"use client";

import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Mail, Lock, Eye, EyeOff, AlertCircle, ShieldAlert, Sparkles, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { getSafeUserRedirect } from "@/lib/auth-redirect";
import Link from "next/link";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLocked, setIsLocked] = useState(false);
  const [lockTimeRemaining, setLockTimeRemaining] = useState(0);

  const isJustRegistered = searchParams.get("registered") === "true";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
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

  async function onSubmit(data: LoginFormData) {
    setIsLoading(true);
    setError(null);

    try {
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        loginChannel: "user",
        redirect: false,
      });

      if (result?.error) {
        if (result.error.includes("locked")) {
          setIsLocked(true);
          setLockTimeRemaining(15 * 60);
          setError("Account temporarily locked due to too many failed attempts.");
        } else if (result.error.includes("inactive")) {
          setError("This account has been deactivated. Contact your administrator.");
        } else {
          setError("Invalid email or password. Staff members must authenticate via the Staff Console.");
        }
        return;
      }

      if (result?.ok) {
        const sessionRes = await fetch("/api/auth/session");
        const sessionData = await sessionRes.json();
        const role = sessionData?.user?.role as string | undefined;

        const callbackUrl = searchParams.get("callbackUrl");
        const safeDestination = getSafeUserRedirect(role ?? "", callbackUrl);

        window.location.assign(safeDestination);
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="w-full">
      <div className="glass-panel-modern bg-[#0B1320]/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.6)] overflow-hidden">
        {/* Top Header Bar */}
        <div className="px-6 py-3.5 border-b border-white/10 bg-[#060B14]/60 flex items-center justify-between text-xs font-sans text-slate-300">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="font-semibold text-white tracking-wide">MEMBER PORTAL</span>
          </div>
          <Link href="/" className="text-slate-400 hover:text-white transition-colors">
            &larr; Public Site
          </Link>
        </div>

        <div className="p-6 sm:p-8">
          {/* Header */}
          <div className="mb-6 pb-6 border-b border-white/10">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium mb-3">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Student &amp; Specialist Access</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-heading font-bold text-white tracking-tight mb-2">
              Sign In to Member Portal
            </h1>
            <p className="text-sm font-sans text-slate-300 leading-relaxed">
              Access your enrolled courses, invoices, and specialist workspace.
            </p>
          </div>

          {/* Registration Success Banner */}
          {isJustRegistered && (
            <div className="mb-5 flex items-center gap-2.5 border border-emerald-500/40 bg-emerald-500/10 p-3.5 rounded-xl text-xs font-sans text-emerald-300">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
              <p>Account created successfully! Please sign in with your credentials.</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Input
                label="Email Address"
                type="email"
                placeholder="you@example.com"
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
                placeholder="Enter your password"
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

            {/* Error Message */}
            {error && !isLocked && (
              <div
                role="alert"
                className="flex items-start gap-2.5 border border-[#A93528]/60 bg-[#A93528]/15 p-3 rounded-xl text-xs font-sans text-[#E07A6F]"
              >
                <AlertCircle className="h-4 w-4 text-[#E07A6F] mt-0.5 shrink-0" />
                <p>{error}</p>
              </div>
            )}

            {/* Locked State */}
            {isLocked && (
              <div
                role="alert"
                className="flex items-start gap-2.5 border border-amber-500/50 bg-amber-500/15 p-3 rounded-xl text-xs font-sans text-amber-200"
              >
                <ShieldAlert className="h-4 w-4 text-amber-400 mt-0.5 shrink-0" />
                <div>
                  <p className="font-semibold">Account Temporarily Locked</p>
                  <p className="mt-1 text-slate-300">
                    Too many failed attempts. Try again in {formatTime(lockTimeRemaining)}
                  </p>
                </div>
              </div>
            )}

            {/* Forgot Password Link */}
            <div className="flex justify-end">
              <Link
                href="/forgot-password"
                className="text-xs font-sans text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit */}
            <div className="pt-2">
              <Button
                type="submit"
                className="w-full rounded-xl font-sans font-semibold text-slate-950 bg-emerald-500 hover:bg-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.3)]"
                size="lg"
                isLoading={isLoading}
                disabled={isLocked}
              >
                {isLoading ? "Signing in..." : "Sign In to Member Portal"}
              </Button>
            </div>
          </form>

          {/* Create Account Prompt */}
          <div className="mt-6 pt-6 border-t border-white/10 text-center">
            <p className="text-sm font-sans text-slate-300">
              Don&apos;t have an account yet?{" "}
              <Link
                href="/signup"
                className="text-emerald-400 hover:text-emerald-300 font-semibold underline underline-offset-4 transition-colors"
              >
                Create Account
              </Link>
            </p>
          </div>

          {/* Discreet Staff Console Link */}
          <div className="mt-4 pt-3 text-center">
            <p className="text-xs font-sans text-slate-400">
              Authorized staff member?{" "}
              <Link
                href="/staff/login"
                className="text-slate-300 hover:text-white underline underline-offset-2 transition-colors"
              >
                Sign in to Staff Console &rarr;
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
