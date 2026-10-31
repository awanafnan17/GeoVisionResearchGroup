"use client";

import { useState } from "react";

interface FaqItem {
  question: string;
  answer: string;
}

interface ServiceFaqProps {
  faqs: unknown;
}

export function ServiceFaq({ faqs }: ServiceFaqProps) {
  const faqList: FaqItem[] = Array.isArray(faqs)
    ? faqs.filter(
        (f): f is FaqItem =>
          typeof f === "object" &&
          f !== null &&
          "question" in f &&
          "answer" in f
      )
    : [];

  const [openIndex, setOpenIndex] = useState<number | null>(0);

  if (faqList.length === 0) return null;

  return (
    <section
      className="section-padding bg-geo-stone text-geo-ink border-b border-geo-stone-border"
      aria-label="Frequently asked questions"
    >
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-4">
            <span className="block font-mono text-[11px] uppercase tracking-[0.2em] text-geo-gold-dark mb-3">
              COMMISSIONING CLARIFICATIONS
            </span>
            <h2 className="text-title text-geo-ink mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-sm text-geo-charcoal/80 leading-relaxed">
              Standard technical protocols, data requirements, and turnaround schedules for commissioning this practice area.
            </p>
          </div>

          <div
            className="lg:col-span-8 border-t border-geo-stone-border"
            role="region"
            aria-label="FAQ accordion"
          >
            {faqList.map((faq, index) => {
              const isOpen = openIndex === index;
              return (
                <div
                  key={index}
                  className="border-b border-geo-stone-border bg-[#FAF8F3]"
                >
                  <button
                    type="button"
                    className="w-full flex items-start justify-between px-6 py-5 text-left gap-6 hover:bg-geo-stone-muted/50 transition-colors"
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    aria-expanded={isOpen}
                    aria-controls={`faq-panel-${index}`}
                    id={`faq-trigger-${index}`}
                  >
                    <div className="flex items-baseline gap-4">
                      <span className="font-mono text-xs font-semibold text-geo-gold-dark tabular-nums">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="text-base font-medium text-geo-ink leading-snug">
                        {faq.question}
                      </span>
                    </div>
                    <span
                      className="font-mono text-sm text-geo-gold-dark shrink-0 mt-0.5"
                      aria-hidden="true"
                    >
                      {isOpen ? "−" : "+"}
                    </span>
                  </button>

                  <div
                    id={`faq-panel-${index}`}
                    role="region"
                    aria-labelledby={`faq-trigger-${index}`}
                    className={`overflow-hidden transition-all duration-200 ease-out ${
                      isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                    }`}
                  >
                    <div className="px-6 pb-6 pt-1 pl-14">
                      <p className="text-sm text-geo-charcoal/85 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
