"use client";

import { useState } from "react";
import { COUNTRIES, LEAD_TYPES } from "@/lib/constants";

export interface InquiryFormProps {
  type?:
    | "GENERAL_INQUIRY"
    | "PROJECT_INQUIRY"
    | "EXPERT_CONTACT"
    | "COURSE_INQUIRY";
  serviceId?: string;
  expertProfileId?: string;
  defaultSubject?: string;
  title?: string;
  subtitle?: string;
  source?: string;
}

const TIMELINE_OPTIONS = [
  "Immediate (Within 2 Weeks)",
  "Short-Term (1 to 3 Months)",
  "Medium-Term (3 to 6 Months)",
  "Planning Stage",
];

const BUDGET_OPTIONS = [
  "Under $5,000",
  "$5,000 to $15,000",
  "$15,000 to $50,000",
  "$50,000+",
  "Request Custom Scope Quote",
];

export function InquiryForm({
  type = "GENERAL_INQUIRY",
  serviceId,
  expertProfileId,
  defaultSubject = "",
  title = "Send an Inquiry",
  subtitle = "Share your project scope, research question, or consultation requirements. Our team responds within 24 business hours.",
  source,
}: InquiryFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [organization, setOrganization] = useState("");
  const [country, setCountry] = useState("");
  const [selectedType, setSelectedType] = useState(type);
  const [subject, setSubject] = useState(defaultSubject);
  const [message, setMessage] = useState("");
  const [projectTimeline, setProjectTimeline] = useState("");
  const [projectBudget, setProjectBudget] = useState("");
  const [honeypot, setHoneypot] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (!name.trim() || name.trim().length < 2) {
      setError("Please enter your full name.");
      return;
    }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!message.trim() || message.trim().length < 15) {
      setError(
        "Please provide a message of at least 15 characters describing your inquiry."
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim() || undefined,
          organization: organization.trim() || undefined,
          country: country || undefined,
          type: selectedType,
          subject: subject.trim() || defaultSubject || "Website Inquiry",
          message: message.trim(),
          serviceId: serviceId || undefined,
          expertProfileId: expertProfileId || undefined,
          projectTimeline: projectTimeline || undefined,
          projectBudget: projectBudget || undefined,
          source: source || undefined,
          honeypot,
        }),
      });

      const data = (await res.json()) as {
        success?: boolean;
        error?: string;
        message?: string;
      };

      if (!res.ok || data.success === false) {
        setError(
          data.error ??
            "Unable to submit your inquiry at this time. Please try again."
        );
        return;
      }

      setSubmitted(true);
    } catch {
      setError(
        "Network error while submitting your inquiry. Please check your connection and try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="border border-geo-gold/50 bg-geo-navy-light p-8 sm:p-10 text-center">
        <div className="w-12 h-12 border border-[#4E7A56] bg-[#4E7A56]/15 flex items-center justify-center mx-auto mb-5">
          <svg
            viewBox="0 0 20 20"
            fill="currentColor"
            className="w-6 h-6 text-[#74A87E]"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div className="text-[10px] font-mono uppercase tracking-[0.22em] text-geo-gold mb-2">
          TRANSMISSION CONFIRMED • DOSSIER LOGGED
        </div>
        <h3 className="text-2xl font-heading font-normal text-geo-white mb-2">
          Inquiry Received
        </h3>
        <p className="text-sm text-geo-slate-light max-w-md mx-auto mb-6 leading-relaxed">
          Thank you, <span className="text-geo-white font-medium">{name}</span>.
          Your message has been logged with our advisory desk and a specialist
          will respond to <span className="text-geo-gold">{email}</span> within
          24 business hours.
        </p>
        <button
          type="button"
          onClick={() => {
            setSubmitted(false);
            setMessage("");
          }}
          className="btn-secondary text-xs"
        >
          Submit Another Inquiry
        </button>
      </div>
    );
  }

  const inputClasses =
    "w-full px-4 py-3 rounded-none bg-geo-navy border border-white/15 text-sm text-geo-white placeholder:text-geo-slate/60 focus:outline-none focus:border-geo-gold transition-colors font-sans";

  return (
    <div className="border border-white/15 bg-geo-navy-light/90">
      {/* Top Dossier Bar */}
      <div className="px-6 sm:px-8 py-3.5 border-b border-white/10 bg-[#080E18] flex items-center justify-between text-[10px] font-mono uppercase tracking-[0.2em] text-geo-slate-light">
        <span className="text-geo-gold">
          INTAKE PROTOCOL • TECHNICAL &amp; COMMERCIAL DESK
        </span>
        <span>SLA: 24 BUSINESS HOURS</span>
      </div>

      <div className="p-6 sm:p-8 lg:p-10">
        <div className="mb-8 pb-6 border-b border-white/10">
          <h3 className="text-2xl sm:text-3xl font-heading font-normal text-geo-white mb-2">
            {title}
          </h3>
          <p className="text-sm text-geo-slate-light leading-relaxed">
            {subtitle}
          </p>
        </div>

        {error && (
          <div
            role="alert"
            className="mb-6 border border-[#A93528]/60 bg-[#A93528]/15 p-4 text-xs font-mono text-[#E07A6F]"
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          {/* Honeypot anti-spam field */}
          <div className="hidden" aria-hidden="true">
            <label htmlFor="website-url-hp">Website</label>
            <input
              id="website-url-hp"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label
                htmlFor="inquiry-name"
                className="block text-[11px] font-mono uppercase tracking-[0.16em] text-geo-white-dim mb-2"
              >
                Full Name <span className="text-geo-gold">*</span>
              </label>
              <input
                id="inquiry-name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Dr. Ahmed Khan"
                className={inputClasses}
              />
            </div>

            <div>
              <label
                htmlFor="inquiry-email"
                className="block text-[11px] font-mono uppercase tracking-[0.16em] text-geo-white-dim mb-2"
              >
                Email Address <span className="text-geo-gold">*</span>
              </label>
              <input
                id="inquiry-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@organization.com"
                className={inputClasses}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div>
              <label
                htmlFor="inquiry-phone"
                className="block text-[11px] font-mono uppercase tracking-[0.16em] text-geo-white-dim mb-2"
              >
                Phone / WhatsApp
              </label>
              <input
                id="inquiry-phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+92 300 0000000"
                className={inputClasses}
              />
            </div>

            <div>
              <label
                htmlFor="inquiry-org"
                className="block text-[11px] font-mono uppercase tracking-[0.16em] text-geo-white-dim mb-2"
              >
                Organization
              </label>
              <input
                id="inquiry-org"
                type="text"
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
                placeholder="Company or University"
                className={inputClasses}
              />
            </div>

            <div>
              <label
                htmlFor="inquiry-country"
                className="block text-[11px] font-mono uppercase tracking-[0.16em] text-geo-white-dim mb-2"
              >
                Country
              </label>
              <select
                id="inquiry-country"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className={inputClasses}
              >
                <option value="">Select country...</option>
                {COUNTRIES.map((c) => (
                  <option key={c.code} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div>
              <label
                htmlFor="inquiry-type"
                className="block text-[11px] font-mono uppercase tracking-[0.16em] text-geo-white-dim mb-2"
              >
                Inquiry Type
              </label>
              <select
                id="inquiry-type"
                value={selectedType}
                onChange={(e) =>
                  setSelectedType(
                    e.target.value as
                      | "GENERAL_INQUIRY"
                      | "PROJECT_INQUIRY"
                      | "EXPERT_CONTACT"
                      | "COURSE_INQUIRY"
                  )
                }
                className={inputClasses}
              >
                {LEAD_TYPES.map((lt) => (
                  <option key={lt.value} value={lt.value}>
                    {lt.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="inquiry-timeline"
                className="block text-[11px] font-mono uppercase tracking-[0.16em] text-geo-white-dim mb-2"
              >
                Target Timeline
              </label>
              <select
                id="inquiry-timeline"
                value={projectTimeline}
                onChange={(e) => setProjectTimeline(e.target.value)}
                className={inputClasses}
              >
                <option value="">Select timeline...</option>
                {TIMELINE_OPTIONS.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="inquiry-budget"
                className="block text-[11px] font-mono uppercase tracking-[0.16em] text-geo-white-dim mb-2"
              >
                Indicative Budget
              </label>
              <select
                id="inquiry-budget"
                value={projectBudget}
                onChange={(e) => setProjectBudget(e.target.value)}
                className={inputClasses}
              >
                <option value="">Select range...</option>
                {BUDGET_OPTIONS.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label
              htmlFor="inquiry-subject"
              className="block text-[11px] font-mono uppercase tracking-[0.16em] text-geo-white-dim mb-2"
            >
              Subject Line
            </label>
            <input
              id="inquiry-subject"
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Brief subject of your inquiry"
              className={inputClasses}
            />
          </div>

          <div>
            <label
              htmlFor="inquiry-message"
              className="block text-[11px] font-mono uppercase tracking-[0.16em] text-geo-white-dim mb-2"
            >
              Project Details / Technical Brief{" "}
              <span className="text-geo-gold">*</span>
            </label>
            <textarea
              id="inquiry-message"
              rows={5}
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Describe your geological region, technical objectives, available datasets, or training requirements..."
              className={`${inputClasses} resize-y`}
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-white/10">
            <p className="text-[11px] font-mono text-geo-slate uppercase tracking-[0.12em]">
              All project disclosures are treated with strict professional
              confidentiality.
            </p>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary disabled:opacity-50 shrink-0"
            >
              {isSubmitting ? "Submitting Inquiry..." : "Submit Inquiry"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
