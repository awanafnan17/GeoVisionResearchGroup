"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { z } from "zod";
import { GEOSENTRY_DEPOSIT_TYPES, COUNTRIES } from "@/lib/constants";

// -------------------------------------------------------
// Zod schemas for each step
// -------------------------------------------------------

const step1Schema = z.object({
  clientName: z.string().min(2, "Name is required").max(100),
  clientEmail: z.string().email("Valid email is required"),
  clientOrganization: z.string().max(150).optional().default(""),
  clientCountry: z.string().max(80).optional().default(""),
});

const step2Schema = z.object({
  targetName: z.string().min(2, "Target name is required").max(150),
  targetCountry: z.string().min(2, "Target country is required").max(80),
  depositType: z.string().min(1, "Deposit type is required"),
  commodityFocus: z.string().min(1, "Commodity focus is required").max(200),
});

const step3Schema = z.object({
  budget: z.string().optional().default(""),
  timeline: z.string().optional().default(""),
  priority: z.string().optional().default("STANDARD"),
  projectDescription: z
    .string()
    .min(20, "Please provide at least 20 characters")
    .max(3000),
});

type Step1Data = z.infer<typeof step1Schema>;
type Step2Data = z.infer<typeof step2Schema>;
type Step3Data = z.infer<typeof step3Schema>;

interface FormErrors {
  [key: string]: string | undefined;
}

const BUDGET_OPTIONS = [
  "",
  "$2,500 (Standard Single-Target Screening)",
  "$4,200 (Priority 48-72h Deal-Room Screening)",
  "Under $5,000",
  "$5,000 to $10,000",
  "$10,000 to $25,000",
  "$25,000 to $50,000",
  "$50,000+",
  "Request Custom Quote",
];

const TIMELINE_OPTIONS = [
  "",
  "Rush (2 to 3 business days)",
  "Standard (5 to 7 business days)",
  "Flexible (2 to 4 weeks)",
  "Planning stage",
];

interface InputFieldProps {
  label: string;
  code: string;
  name: string;
  type?: string;
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
}

function InputField({
  label,
  code,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  required,
  error,
}: InputFieldProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label
          htmlFor={`gs-${name}`}
          className="block text-xs font-mono uppercase tracking-[0.14em] text-geo-white"
        >
          {label}
          {required && <span className="text-gs-gold ml-1">*</span>}
        </label>
        <span className="text-[10px] font-mono text-gs-slate uppercase tracking-[0.14em]">
          {code}
        </span>
      </div>
      <input
        type={type}
        id={`gs-${name}`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-3 rounded-none bg-geo-navy border border-white/15 text-sm text-geo-white placeholder:text-gs-slate/50 focus:outline-none focus:border-gs-gold transition-colors"
        aria-describedby={error ? `gs-${name}-err` : undefined}
        aria-invalid={error ? "true" : undefined}
      />
      {error && (
        <p
          id={`gs-${name}-err`}
          className="text-xs font-mono text-[#E07A6F] mt-1.5"
        >
          [ERROR]: {error}
        </p>
      )}
    </div>
  );
}

interface SelectFieldProps {
  label: string;
  code: string;
  name: string;
  value: string;
  onChange: (val: string) => void;
  options: { value: string; label: string }[];
  required?: boolean;
  error?: string;
}

function SelectField({
  label,
  code,
  name,
  value,
  onChange,
  options,
  required,
  error,
}: SelectFieldProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label
          htmlFor={`gs-${name}`}
          className="block text-xs font-mono uppercase tracking-[0.14em] text-geo-white"
        >
          {label}
          {required && <span className="text-gs-gold ml-1">*</span>}
        </label>
        <span className="text-[10px] font-mono text-gs-slate uppercase tracking-[0.14em]">
          {code}
        </span>
      </div>
      <select
        id={`gs-${name}`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 rounded-none bg-geo-navy border border-white/15 text-sm text-geo-white focus:outline-none focus:border-gs-gold transition-colors cursor-pointer"
        aria-invalid={error ? "true" : undefined}
      >
        <option value="" className="bg-geo-navy text-geo-white">
          Select specification...
        </option>
        {options.map((o) => (
          <option
            key={o.value}
            value={o.value}
            className="bg-geo-navy text-geo-white"
          >
            {o.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="text-xs font-mono text-[#E07A6F] mt-1.5">
          [ERROR]: {error}
        </p>
      )}
    </div>
  );
}

export function GsRequestForm() {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<{
    success: boolean;
    referenceNumber?: string;
    error?: string;
  } | null>(null);

  const [step1, setStep1] = useState<Step1Data>({
    clientName: "",
    clientEmail: "",
    clientOrganization: "",
    clientCountry: "",
  });
  const [step2, setStep2] = useState<Step2Data>({
    targetName: "",
    targetCountry: "",
    depositType: "",
    commodityFocus: "",
  });
  const [step3, setStep3] = useState<Step3Data>({
    budget: "",
    timeline: "",
    priority: "STANDARD",
    projectDescription: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});

  const validateStep = useCallback(
    (currentStep: number): boolean => {
      const result =
        currentStep === 1
          ? step1Schema.safeParse(step1)
          : currentStep === 2
            ? step2Schema.safeParse(step2)
            : step3Schema.safeParse(step3);

      if (!result.success) {
        const fieldErrors: FormErrors = {};
        for (const issue of result.error.issues) {
          const field = issue.path[0];
          if (field) fieldErrors[String(field)] = issue.message;
        }
        setErrors(fieldErrors);
        return false;
      }
      setErrors({});
      return true;
    },
    [step1, step2, step3]
  );

  const nextStep = useCallback(() => {
    if (validateStep(step)) {
      setStep((s) => Math.min(s + 1, 3));
    }
  }, [step, validateStep]);

  const prevStep = useCallback(() => {
    setErrors({});
    setStep((s) => Math.max(s - 1, 1));
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!validateStep(3)) return;

    setIsSubmitting(true);
    setSubmitResult(null);

    try {
      const res = await fetch("/api/geosentry/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...step1,
          ...step2,
          ...step3,
        }),
      });

      const data = (await res.json()) as {
        success: boolean;
        data?: { referenceNumber?: string };
        error?: string;
      };

      if (res.ok && data.success) {
        setSubmitResult({
          success: true,
          referenceNumber: data.data?.referenceNumber,
        });
        setStep(4);
      } else {
        setSubmitResult({
          success: false,
          error: data.error ?? "Submission failed. Please try again.",
        });
      }
    } catch {
      setSubmitResult({
        success: false,
        error: "Network error. Please check your connection and try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [step1, step2, step3, validateStep]);

  const stepLabels = [
    { num: 1, code: "SEC-01", label: "Contact Info" },
    { num: 2, code: "SEC-02", label: "Target Info" },
    { num: 3, code: "SEC-03", label: "Project Context" },
  ];

  if (step === 4 && submitResult?.success) {
    return (
      <div className="p-8 border border-[#2D6A4F]/60 bg-gs-navy-dark text-center">
        <div className="inline-block px-3 py-1 mb-4 text-[11px] font-mono font-semibold uppercase tracking-[0.18em] bg-[#2D6A4F]/20 text-[#68B68E] border border-[#2D6A4F]/50">
          STATUS: MANDATE REGISTERED
        </div>
        <h3 className="text-2xl font-heading text-geo-white mb-3">
          Request Submitted Successfully
        </h3>
        {submitResult.referenceNumber && (
          <div className="inline-flex items-center gap-3 px-5 py-3 bg-geo-navy border border-gs-gold/40 mb-5 font-mono tabular-nums">
            <span className="text-xs uppercase tracking-[0.16em] text-gs-slate">
              ASSIGNED REFERENCE:
            </span>
            <span className="text-base font-bold text-gs-gold">
              {submitResult.referenceNumber}
            </span>
          </div>
        )}
        <p className="text-xs sm:text-sm text-gs-slate max-w-md mx-auto mb-6 leading-relaxed">
          Our lead economic geologist will review your target parameters and
          issue a formal scope confirmation within 24 hours. Retain your
          assigned reference number to monitor screening progress.
        </p>
        {submitResult.referenceNumber && (
          <Link
            href={`/geosentry/track?ref=${encodeURIComponent(submitResult.referenceNumber)}`}
            className="gs-btn-primary text-xs"
          >
            Track Request Status
          </Link>
        )}
      </div>
    );
  }

  return (
    <div>
      {/* Swiss Step Ledger Header */}
      <div className="grid grid-cols-3 border border-white/15 bg-gs-navy-dark mb-8">
        {stepLabels.map((item) => {
          const isActive = step === item.num;
          const isCompleted = step > item.num;
          return (
            <div
              key={item.code}
              className={`p-3.5 border-r last:border-r-0 border-white/15 transition-colors ${
                isActive
                  ? "bg-gs-gold/15 border-b-2 border-b-gs-gold"
                  : isCompleted
                    ? "bg-[#2D6A4F]/10"
                    : "bg-transparent"
              }`}
            >
              <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-[0.16em] mb-1">
                <span
                  className={
                    isActive
                      ? "text-gs-gold font-bold"
                      : isCompleted
                        ? "text-[#68B68E] font-semibold"
                        : "text-gs-slate"
                  }
                >
                  {item.code}
                </span>
                <span className="font-mono text-[10px] text-gs-slate">
                  {isCompleted ? "[DONE]" : isActive ? "[ACTIVE]" : "[PENDING]"}
                </span>
              </div>
              <span
                className={`text-xs font-sans font-semibold block truncate ${
                  isActive ? "text-geo-white" : "text-gs-slate"
                }`}
              >
                {item.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Error banner */}
      {submitResult?.error && (
        <div className="mb-6 p-4 rounded-none bg-[#A93528]/15 border border-[#A93528]/50 text-xs font-mono text-[#E07A6F]">
          [SUBMISSION ERROR]: {submitResult.error}
        </div>
      )}

      {/* Step 1: Contact Info */}
      {step === 1 && (
        <div className="space-y-5">
          <div className="pb-3 border-b border-white/10 flex items-center justify-between text-[11px] font-mono uppercase tracking-[0.16em] text-gs-gold">
            <span>COMMISSIONING OFFICER DETAILS</span>
            <span>REQUIRED FIELDS (*)</span>
          </div>
          <InputField
            label="Full Name"
            code="FIELD 1.1"
            name="clientName"
            value={step1.clientName}
            onChange={(v) => setStep1({ ...step1, clientName: v })}
            placeholder="Dr. Henrik Lindqvist"
            required
            error={errors.clientName}
          />
          <InputField
            label="Email Address"
            code="FIELD 1.2"
            name="clientEmail"
            type="email"
            value={step1.clientEmail}
            onChange={(v) => setStep1({ ...step1, clientEmail: v })}
            placeholder="h.lindqvist@nordicminerals.se"
            required
            error={errors.clientEmail}
          />
          <InputField
            label="Company / Organization"
            code="FIELD 1.3"
            name="clientOrganization"
            value={step1.clientOrganization ?? ""}
            onChange={(v) => setStep1({ ...step1, clientOrganization: v })}
            placeholder="Nordic Mineral Exploration AB"
            error={errors.clientOrganization}
          />
          <SelectField
            label="Country"
            code="FIELD 1.4"
            name="clientCountry"
            value={step1.clientCountry ?? ""}
            onChange={(v) => setStep1({ ...step1, clientCountry: v })}
            options={COUNTRIES.map(
              (c: { code: string; name: string; region: string }) => ({
                value: c.name,
                label: c.name,
              })
            )}
            error={errors.clientCountry}
          />
        </div>
      )}

      {/* Step 2: Target Info */}
      {step === 2 && (
        <div className="space-y-5">
          <div className="pb-3 border-b border-white/10 flex items-center justify-between text-[11px] font-mono uppercase tracking-[0.16em] text-gs-gold">
            <span>GEOLOGICAL CONCESSION SPECIFICATION</span>
            <span>REQUIRED FIELDS (*)</span>
          </div>
          <InputField
            label="Target Name"
            code="FIELD 2.1"
            name="targetName"
            value={step2.targetName}
            onChange={(v) => setStep2({ ...step2, targetName: v })}
            placeholder="Block 14B — Semail Ophiolite Concession"
            required
            error={errors.targetName}
          />
          <SelectField
            label="Target Country"
            code="FIELD 2.2"
            name="targetCountry"
            value={step2.targetCountry}
            onChange={(v) => setStep2({ ...step2, targetCountry: v })}
            options={COUNTRIES.map(
              (c: { code: string; name: string; region: string }) => ({
                value: c.name,
                label: c.name,
              })
            )}
            required
            error={errors.targetCountry}
          />
          <SelectField
            label="Deposit Type"
            code="FIELD 2.3"
            name="depositType"
            value={step2.depositType}
            onChange={(v) => setStep2({ ...step2, depositType: v })}
            options={GEOSENTRY_DEPOSIT_TYPES.map((d) => ({
              value: d.value,
              label: d.label,
            }))}
            required
            error={errors.depositType}
          />
          <InputField
            label="Commodity Focus"
            code="FIELD 2.4"
            name="commodityFocus"
            value={step2.commodityFocus}
            onChange={(v) => setStep2({ ...step2, commodityFocus: v })}
            placeholder="Copper, Gold, Zinc (Cu-Au-Zn)"
            required
            error={errors.commodityFocus}
          />
        </div>
      )}

      {/* Step 3: Project Context */}
      {step === 3 && (
        <div className="space-y-5">
          <div className="pb-3 border-b border-white/10 flex items-center justify-between text-[11px] font-mono uppercase tracking-[0.16em] text-gs-gold">
            <span>MANDATE SLA &amp; TECHNICAL BRIEF</span>
            <span>REQUIRED FIELDS (*)</span>
          </div>
          <SelectField
            label="Indicative Budget / Quote Preference"
            code="FIELD 3.1"
            name="budget"
            value={step3.budget ?? ""}
            onChange={(v) => setStep3({ ...step3, budget: v })}
            options={BUDGET_OPTIONS.filter(Boolean).map((b) => ({
              value: b,
              label: b,
            }))}
            error={errors.budget}
          />
          <SelectField
            label="Timeline Preference"
            code="FIELD 3.2"
            name="timeline"
            value={step3.timeline ?? ""}
            onChange={(v) => setStep3({ ...step3, timeline: v })}
            options={TIMELINE_OPTIONS.filter(Boolean).map((t) => ({
              value: t,
              label: t,
            }))}
            error={errors.timeline}
          />
          <SelectField
            label="Priority"
            code="FIELD 3.3"
            name="priority"
            value={step3.priority ?? "STANDARD"}
            onChange={(v) => setStep3({ ...step3, priority: v })}
            options={[
              {
                value: "STANDARD",
                label: "Standard ($2,500 base • 5 to 7 business days)",
              },
              {
                value: "RUSH",
                label: "Priority Rush ($4,200 base • 2 to 3 business days)",
              },
            ]}
            error={errors.priority}
          />
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label
                htmlFor="gs-projectDescription"
                className="block text-xs font-mono uppercase tracking-[0.14em] text-geo-white"
              >
                Project Description &amp; Technical Objectives
                <span className="text-gs-gold ml-1">*</span>
              </label>
              <span className="text-[10px] font-mono text-gs-slate uppercase tracking-[0.14em]">
                FIELD 3.4
              </span>
            </div>
            <textarea
              id="gs-projectDescription"
              rows={5}
              value={step3.projectDescription}
              onChange={(e) =>
                setStep3({ ...step3, projectDescription: e.target.value })
              }
              placeholder="Summarize host lithology, available historical exploration data, bounding coordinates, and specific due-diligence questions..."
              className="w-full px-4 py-3 rounded-none bg-geo-navy border border-white/15 text-sm text-geo-white placeholder:text-gs-slate/50 focus:outline-none focus:border-gs-gold transition-colors resize-y"
              aria-invalid={errors.projectDescription ? "true" : undefined}
            />
            {errors.projectDescription && (
              <p className="text-xs font-mono text-[#E07A6F] mt-1.5">
                [ERROR]: {errors.projectDescription}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/10">
        {step > 1 ? (
          <button
            type="button"
            onClick={prevStep}
            className="gs-btn-secondary text-xs py-3 px-6"
          >
            Back
          </button>
        ) : (
          <span className="text-[11px] font-mono text-gs-slate uppercase tracking-[0.14em]">
            STEP {step} OF 3
          </span>
        )}

        {step < 3 ? (
          <button
            type="button"
            onClick={nextStep}
            className="gs-btn-primary text-xs py-3 px-7"
          >
            Continue
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="gs-btn-primary text-xs py-3 px-7 disabled:opacity-50 disabled:pointer-events-none"
          >
            {isSubmitting ? "Submitting Mandate..." : "Submit Request"}
          </button>
        )}
      </div>
    </div>
  );
}
