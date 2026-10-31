"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Mail, Lock, ArrowLeft, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import Link from "next/link";

const requestSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

const resetSchema = z
  .object({
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(8, "Please confirm your new password"),
  })
  .refine((val) => val.newPassword === val.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type RequestFormData = z.infer<typeof requestSchema>;
type ResetFormData = z.infer<typeof resetSchema>;

function ForgotPasswordContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const emailParam = searchParams.get("email") ?? "";

  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [resetError, setResetError] = useState<string | null>(null);

  const requestForm = useForm<RequestFormData>({
    resolver: zodResolver(requestSchema),
  });

  const resetForm = useForm<ResetFormData>({
    resolver: zodResolver(resetSchema),
  });

  async function onRequestSubmit(data: RequestFormData) {
    setIsLoading(true);
    try {
      await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: data.email }),
      });
    } catch {
      // Fail gracefully without disclosing account existence
    }
    setSent(true);
    setIsLoading(false);
  }

  async function onResetSubmit(data: ResetFormData) {
    setIsLoading(true);
    setResetError(null);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: emailParam,
          token,
          newPassword: data.newPassword,
        }),
      });
      const json = (await res.json()) as { error?: string };
      if (!res.ok) {
        setResetError(
          json.error ?? "Unable to reset password. Please request a new link."
        );
        setIsLoading(false);
        return;
      }
      setResetSuccess(true);
    } catch {
      setResetError("A network error occurred. Please try again.");
    }
    setIsLoading(false);
  }

  if (token && emailParam) {
    return (
      <div className="border border-white/15 bg-geo-navy-light/95">
        <div className="px-6 py-3.5 border-b border-white/10 bg-[#080E18] flex items-center justify-between text-[10px] font-mono uppercase tracking-[0.2em] text-geo-gold">
          <span>SECURITY • CREDENTIAL RECOVERY</span>
          <span>TOKEN VERIFIED</span>
        </div>
        <div className="p-6 sm:p-8">
          {resetSuccess ? (
            <div className="text-center py-4">
              <div className="inline-flex items-center justify-center w-12 h-12 border border-[#4E7A56] bg-[#4E7A56]/15 mb-4">
                <CheckCircle className="h-6 w-6 text-[#74A87E]" />
              </div>
              <h2 className="text-2xl font-heading font-normal text-geo-white mb-2">
                Password Updated
              </h2>
              <p className="text-sm text-geo-slate-light mb-6">
                Your password has been reset. You can now sign in with your new
                credentials.
              </p>
              <Link href="/login">
                <Button variant="default" size="sm">
                  Continue to Sign In
                </Button>
              </Link>
            </div>
          ) : (
            <>
              <div className="mb-6 pb-5 border-b border-white/10">
                <p className="text-[11px] font-mono uppercase tracking-[0.2em] text-geo-gold mb-2">
                  Geo Vision Research Group
                </p>
                <h1 className="text-3xl font-heading font-normal text-geo-white mb-2">
                  Set New Password
                </h1>
                <p className="text-xs font-mono text-geo-slate-light">
                  Choose a new password for{" "}
                  <span className="text-geo-white">{emailParam}</span>.
                </p>
              </div>

              {resetError && (
                <div className="mb-5 p-3 border border-[#A93528]/60 bg-[#A93528]/15 flex items-start gap-2.5 text-xs font-mono text-[#E07A6F]">
                  <AlertCircle className="h-4 w-4 text-[#E07A6F] shrink-0 mt-0.5" />
                  <span>{resetError}</span>
                </div>
              )}

              <form
                onSubmit={resetForm.handleSubmit(onResetSubmit)}
                className="space-y-5"
              >
                <Input
                  label="New Password"
                  type="password"
                  placeholder="Minimum 8 characters"
                  autoComplete="new-password"
                  leftIcon={<Lock className="h-4 w-4" />}
                  error={resetForm.formState.errors.newPassword?.message}
                  {...resetForm.register("newPassword")}
                />
                <Input
                  label="Confirm New Password"
                  type="password"
                  placeholder="Re-enter new password"
                  autoComplete="new-password"
                  leftIcon={<Lock className="h-4 w-4" />}
                  error={resetForm.formState.errors.confirmPassword?.message}
                  {...resetForm.register("confirmPassword")}
                />

                <Button
                  type="submit"
                  className="w-full rounded-none font-mono uppercase tracking-[0.16em]"
                  isLoading={isLoading}
                >
                  Save New Password
                </Button>
              </form>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="border border-white/15 bg-geo-navy-light/95">
      <div className="px-6 py-3.5 border-b border-white/10 bg-[#080E18] flex items-center justify-between text-[10px] font-mono uppercase tracking-[0.2em] text-geo-gold">
        <span>SECURITY • PASSWORD RESET DISPATCH</span>
        <span>PORTAL AUTH</span>
      </div>
      <div className="p-6 sm:p-8">
        {sent ? (
          <div className="text-center py-4">
            <div className="inline-flex items-center justify-center w-12 h-12 border border-[#4E7A56] bg-[#4E7A56]/15 mb-4">
              <CheckCircle className="h-6 w-6 text-[#74A87E]" />
            </div>
            <h2 className="text-2xl font-heading font-normal text-geo-white mb-2">
              Check Your Email
            </h2>
            <p className="text-sm text-geo-slate-light mb-6">
              If that email address is in our system, you will receive a
              password reset link shortly.
            </p>
            <Link href="/login">
              <Button
                variant="outline"
                size="sm"
                leftIcon={<ArrowLeft className="h-4 w-4" />}
              >
                Back to Sign In
              </Button>
            </Link>
          </div>
        ) : (
          <>
            <div className="mb-6 pb-5 border-b border-white/10">
              <p className="text-[11px] font-mono uppercase tracking-[0.2em] text-geo-gold mb-2">
                Geo Vision Research Group
              </p>
              <h1 className="text-3xl font-heading font-normal text-geo-white mb-2">
                Reset Password
              </h1>
              <p className="text-xs font-mono text-geo-slate-light">
                Enter your registered email and we will dispatch a reset link.
              </p>
            </div>

            <form
              onSubmit={requestForm.handleSubmit(onRequestSubmit)}
              className="space-y-5"
            >
              <Input
                label="Email Address"
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                leftIcon={<Mail className="h-4 w-4" />}
                error={requestForm.formState.errors.email?.message}
                {...requestForm.register("email")}
              />

              <Button
                type="submit"
                className="w-full rounded-none font-mono uppercase tracking-[0.16em]"
                isLoading={isLoading}
              >
                Send Reset Link
              </Button>
            </form>

            <div className="mt-6 pt-5 border-t border-white/10 text-center">
              <Link
                href="/login"
                className="text-xs font-mono uppercase tracking-[0.16em] text-geo-gold hover:text-geo-gold-light transition-colors inline-flex items-center gap-1.5"
              >
                <ArrowLeft className="h-3 w-3" />
                Back to Sign In
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-geo-navy relative px-6">
      <div className="absolute inset-0 geo-grid-bg opacity-40 pointer-events-none" />
      <div className="relative z-10 w-full max-w-[460px]">
        <Suspense
          fallback={
            <div className="border border-white/15 bg-geo-navy-light p-8 text-center text-xs font-mono uppercase tracking-[0.18em] text-geo-slate">
              Loading password reset...
            </div>
          }
        >
          <ForgotPasswordContent />
        </Suspense>
      </div>
    </div>
  );
}
