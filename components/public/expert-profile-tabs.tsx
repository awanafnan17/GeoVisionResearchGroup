"use client";

import { useState } from "react";
import { sanitizeHtml } from "@/lib/utils";

interface TabItem {
  id: string;
  code: string;
  label: string;
  content: React.ReactNode;
}

interface ExpertProfileTabsProps {
  shortBio: string;
  fullBio: string | null;
  experience: unknown;
  education: unknown;
  publications: unknown;
  certifications: unknown;
  languages: unknown;
  awards: unknown;
}

function JsonList({ data, emptyText }: { data: unknown; emptyText: string }) {
  const items = Array.isArray(data) ? data : [];
  if (items.length === 0) {
    return (
      <div className="p-6 bg-[#FAF8F3] border border-geo-stone-border font-mono text-xs text-geo-slate">
        {emptyText}
      </div>
    );
  }

  return (
    <div className="border-t border-geo-stone-border">
      {items.map((item, i) => {
        const indexNum = String(i + 1).padStart(2, "0");

        if (typeof item === "string") {
          return (
            <div
              key={i}
              className="flex items-start gap-4 p-5 bg-[#FAF8F3] border-b border-x border-geo-stone-border"
            >
              <span className="font-mono text-xs font-semibold text-geo-gold-dark tabular-nums shrink-0 mt-0.5">
                {indexNum}
              </span>
              <p className="text-sm text-geo-ink leading-relaxed">{item}</p>
            </div>
          );
        }

        if (typeof item === "object" && item !== null) {
          const obj = item as Record<string, unknown>;
          const title = obj.title != null ? String(obj.title) : null;
          const institution = obj.institution != null ? String(obj.institution) : null;
          const organization = obj.organization != null ? String(obj.organization) : null;
          const company = obj.company != null ? String(obj.company) : null;
          const role = obj.role != null ? String(obj.role) : null;
          const degree = obj.degree != null ? String(obj.degree) : null;
          const year = obj.year != null ? String(obj.year) : null;
          const period = obj.period != null ? String(obj.period) : null;
          const date = obj.date != null ? String(obj.date) : null;
          const description = obj.description != null ? String(obj.description) : null;
          const journal = obj.journal != null ? String(obj.journal) : null;
          const authors = obj.authors != null ? String(obj.authors) : null;
          const issuer = obj.issuer != null ? String(obj.issuer) : null;

          return (
            <div
              key={i}
              className="p-6 bg-[#FAF8F3] border-b border-x border-geo-stone-border"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-2 mb-2">
                <div className="flex items-baseline gap-3">
                  <span className="font-mono text-xs font-semibold text-geo-gold-dark tabular-nums">
                    {indexNum}
                  </span>
                  <h4 className="text-lg font-heading text-geo-ink">
                    {title ?? role ?? degree ?? "Record Entry"}
                  </h4>
                </div>
                {(year || period || date) && (
                  <span className="font-mono text-xs text-geo-gold-dark uppercase tracking-[0.14em] tabular-nums">
                    {year ?? period ?? date}
                  </span>
                )}
              </div>

              {(institution || organization || company) && (
                <p className="font-mono text-xs uppercase tracking-[0.14em] text-geo-charcoal mb-1.5">
                  {institution ?? organization ?? company}
                </p>
              )}
              {role && title && (
                <p className="text-sm font-medium text-geo-ink mb-1">{role}</p>
              )}
              {degree && title && (
                <p className="text-sm font-medium text-geo-ink mb-1">{degree}</p>
              )}
              {description && (
                <p className="text-sm text-geo-charcoal/85 leading-relaxed mt-2">
                  {description}
                </p>
              )}
              {journal && (
                <p className="text-xs font-mono text-geo-slate italic mt-2">
                  Published in: {journal}
                </p>
              )}
              {authors && (
                <p className="text-xs text-geo-slate mt-1">
                  Authors: {authors}
                </p>
              )}
              {issuer && (
                <p className="text-xs font-mono text-geo-slate mt-1">
                  Issuing Authority: {issuer}
                </p>
              )}
            </div>
          );
        }

        return null;
      })}
    </div>
  );
}

export function ExpertProfileTabs({
  shortBio,
  fullBio,
  experience,
  education,
  publications,
  certifications,
  languages,
  awards,
}: ExpertProfileTabsProps) {
  const tabs: TabItem[] = [
    {
      id: "about",
      code: "01",
      label: "Biography & Standing",
      content: (
        <div className="space-y-8">
          <div className="bg-[#FAF8F3] border border-geo-stone-border p-6 sm:p-8">
            <span className="block font-mono text-[10px] uppercase tracking-[0.2em] text-geo-gold-dark mb-3">
              CURRICULUM VITAE • EXECUTIVE BIOGRAPHY
            </span>
            {fullBio ? (
              <div
                className="prose max-w-none text-geo-charcoal leading-relaxed [&>p]:mb-4 [&>a]:text-geo-gold-dark [&>a:hover]:underline [&>h2]:text-geo-ink [&>h2]:font-heading [&>h3]:text-geo-ink [&>ul>li]:text-geo-charcoal [&>ol>li]:text-geo-charcoal"
                dangerouslySetInnerHTML={{ __html: sanitizeHtml(fullBio) }}
              />
            ) : (
              <p className="text-base text-geo-charcoal leading-relaxed">
                {shortBio}
              </p>
            )}
          </div>

          {/* Languages & Awards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Array.isArray(languages) && languages.length > 0 && (
              <div className="bg-[#FAF8F3] border border-geo-stone-border p-6">
                <span className="block font-mono text-[10px] uppercase tracking-[0.2em] text-geo-gold-dark mb-2">
                  FIELD COMMUNICATION
                </span>
                <h3 className="text-xl font-heading text-geo-ink mb-4">
                  Languages
                </h3>
                <div className="flex flex-wrap gap-2">
                  {languages.map((lang, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center px-3 py-1.5 bg-geo-stone-muted border border-geo-stone-border font-mono text-xs text-geo-ink"
                    >
                      {String(lang)}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {Array.isArray(awards) && awards.length > 0 && (
              <div className="bg-[#FAF8F3] border border-geo-stone-border p-6">
                <span className="block font-mono text-[10px] uppercase tracking-[0.2em] text-geo-gold-dark mb-2">
                  HONORS &amp; DISTINCTIONS
                </span>
                <h3 className="text-xl font-heading text-geo-ink mb-4">
                  Awards &amp; Recognition
                </h3>
                <JsonList data={awards} emptyText="" />
              </div>
            )}
          </div>
        </div>
      ),
    },
    {
      id: "experience",
      code: "02",
      label: "Experience",
      content: (
        <JsonList
          data={experience}
          emptyText="Professional field and advisory appointments will be indexed here."
        />
      ),
    },
    {
      id: "education",
      code: "03",
      label: "Education",
      content: (
        <JsonList
          data={education}
          emptyText="Academic degrees and institutional credentials will be indexed here."
        />
      ),
    },
    {
      id: "publications",
      code: "04",
      label: "Publications",
      content: (
        <JsonList
          data={publications}
          emptyText="Peer-reviewed papers and technical monographs will be listed here."
        />
      ),
    },
    {
      id: "certifications",
      code: "05",
      label: "Certifications",
      content: (
        <JsonList
          data={certifications}
          emptyText="Professional registrations and statutory certifications will be listed here."
        />
      ),
    },
  ];

  const [activeTab, setActiveTab] = useState("about");
  const activeContent = tabs.find((t) => t.id === activeTab)?.content;

  return (
    <section
      className="section-padding bg-geo-stone text-geo-ink border-b border-geo-stone-border"
      aria-label="Expert details"
    >
      <div className="container-custom">
        <div className="max-w-5xl mx-auto">
          {/* Editorial Tab Ledger */}
          <div
            className="grid grid-cols-2 sm:grid-cols-5 border-t border-l border-geo-stone-border mb-10"
            role="tablist"
            aria-label="Expert profile sections"
          >
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  id={`tab-${tab.id}`}
                  aria-selected={isActive}
                  aria-controls={`panel-${tab.id}`}
                  tabIndex={isActive ? 0 : -1}
                  onClick={() => setActiveTab(tab.id)}
                  onKeyDown={(e) => {
                    const idx = tabs.findIndex((t) => t.id === activeTab);
                    if (e.key === "ArrowRight") {
                      e.preventDefault();
                      const next = tabs[(idx + 1) % tabs.length];
                      if (next) setActiveTab(next.id);
                    }
                    if (e.key === "ArrowLeft") {
                      e.preventDefault();
                      const prev = tabs[(idx - 1 + tabs.length) % tabs.length];
                      if (prev) setActiveTab(prev.id);
                    }
                  }}
                  className={`p-4 text-left border-r border-b border-geo-stone-border transition-colors ${
                    isActive
                      ? "bg-geo-ink text-geo-stone"
                      : "bg-[#FAF8F3] text-geo-charcoal hover:bg-geo-stone-muted"
                  }`}
                >
                  <span
                    className={`block font-mono text-[10px] uppercase tracking-[0.18em] mb-1 ${
                      isActive ? "text-geo-gold" : "text-geo-slate"
                    }`}
                  >
                    SEC • {tab.code}
                  </span>
                  <span className="text-xs font-mono uppercase tracking-[0.12em] font-semibold">
                    {tab.label}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Active Tab Panel */}
          <div
            role="tabpanel"
            id={`panel-${activeTab}`}
            aria-labelledby={`tab-${activeTab}`}
            tabIndex={0}
          >
            {activeContent}
          </div>
        </div>
      </div>
    </section>
  );
}
