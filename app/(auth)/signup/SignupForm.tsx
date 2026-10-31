"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { User, Mail, Lock, Eye, EyeOff, AlertCircle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import Link from "next/link";

const signupSchema = z
  .object({
    name: z
      .string()
      .min(2, "Full name must be at least 2 characters")
      .max(100, "Full name must not exceed 100 characters")
      .trim(),
    email: z
      .string()
      .email("Please enter a valid email address")
      .max(200)
      .trim()
      .toLowerCase(),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(100, "Password must not exceed 100 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
    acceptTerms: z.literal(true, {
      message: "You must accept the Terms of Service and Privacy Policy",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type SignupFormData = z.infer<typeof signupSchema>;

export default function SignupForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  async function onSubmit(data: SignupFormData) {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
          confirmPassword: data.confirmPassword,
          acceptTerms: data.acceptTerms,
        }),
      });

      if (res.status === 409) {
        setError(
          "An account with this email address already exists. Please sign in instead."
        );
        return;
      }

      if (!res.ok) {
        const errorData = (await res.json().catch(() => ({}))) as {
          error?: string;
        };
        setError(
          errorData.error ?? "Registration failed. Please review your details."
        );
        return;
      }

      // Auto sign-in on registration via loginChannel: "user"
      const signInRes = await signIn("credentials", {
        email: data.email,
        password: data.password,
        loginChannel: "user",
        redirect: false,
      });

      if (signInRes?.ok) {
        router.push("/student/dashboard");
      } else {
        router.push("/login?registered=true");
      }
    } catch {
      setError("An unexpected network error occurred. Please try again.");
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
            <span className="font-semibold text-white tracking-wide">STUDENT REGISTRATION</span>
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
              <span>Public Account Creation</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-heading font-bold text-white tracking-tight mb-2">
              Create Student Account
            </h1>
            <p className="text-sm font-sans text-slate-300 leading-relaxed">
              Register to enroll in certified mineral exploration courses and track your research progress.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Input
                label="Full Name"
                type="text"
                placeholder="e.g. Sarah Khan"
                autoComplete="name"
                leftIcon={<User className="h-4 w-4" />}
                error={errors.name?.message}
                {...register("name")}
              />
            </div>

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
                placeholder="Min 8 characters (1 uppercase, 1 number)"
                autoComplete="new-password"
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

            <div>
              <Input
                label="Confirm Password"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Repeat your password"
                autoComplete="new-password"
                leftIcon={<Lock className="h-4 w-4" />}
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="text-slate-400 hover:text-white transition-colors"
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                }
                error={errors.confirmPassword?.message}
                {...register("confirmPassword")}
              />
            </div>

            {/* Terms and Privacy Checkbox */}
            <div className="pt-2">
              <label className="flex items-start gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  className="mt-0.5 h-4 w-4 rounded border-white/20 bg-white/5 text-emerald-500 focus:ring-emerald-500/30 focus:ring-offset-0"
                  {...register("acceptTerms")}
                />
                <span className="text-xs font-sans text-slate-300 leading-relaxed">
                  I agree to the{" "}
                  <Link
                    href="/terms"
                    target="_blank"
                    className="text-emerald-400 hover:underline"
                  >
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="/privacy"
                    target="_blank"
                    className="text-emerald-400 hover:underline"
                  >
                    Privacy Policy
                  </Link>
                  .
                </span>
              </label>
              {errors.acceptTerms && (
                <p className="mt-1 text-xs text-[#E07A6F]">
                  {errors.acceptTerms.message}
                </p>
              )}
            </div>

            {/* Error Banner */}
            {error && (
              <div
                role="alert"
                className="flex items-start gap-2.5 border border-[#A93528]/60 bg-[#A93528]/15 p-3 rounded-xl text-xs font-sans text-[#E07A6F]"
              >
                <AlertCircle className="h-4 w-4 text-[#E07A6F] mt-0.5 shrink-0" />
                <p>{error}</p>
              </div>
            )}

            {/* Submit */}
            <div className="pt-2">
              <Button
                type="submit"
                className="w-full rounded-xl font-sans font-semibold text-slate-950 bg-emerald-500 hover:bg-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.3)]"
                size="lg"
                isLoading={isLoading}
              >
                {isLoading ? "Creating Account..." : "Create Student Account"}
              </Button>
            </div>
          </form>

          {/* Sign In Prompt */}
          <div className="mt-6 pt-6 border-t border-white/10 text-center">
            <p className="text-sm font-sans text-slate-300">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-emerald-400 hover:text-emerald-300 font-semibold underline underline-offset-4 transition-colors"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
