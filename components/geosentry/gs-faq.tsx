"use client";

import { useState } from "react";

const FAQS = [
  {
    code: "01",
    q: "What is a GeoSentry 100-Point Screening Dossier?",
    a: "GeoSentry is an institutional desktop geological due-diligence protocol that evaluates mineral exploration concessions before field capital is deployed. Every target is scored across six weighted technical parameters (totaling 100 points) consolidated into Geological Assessment (40 pts), Jurisdiction & ESG (40 pts), and Operator Quality (20 pts), culminating in an explicit GO (70–100), CONDITIONAL GO (45–69), or NO-GO (0–44) decision gate.",
  },
  {
    code: "02",
    q: "What data room materials are required to initiate a screening?",
    a: "At minimum, our intake desk requires the concession name, host country, bounding coordinates (or license registry ID), commodity focus, and proposed deposit model. Where available, clients submit legacy geological maps, trench/drill geochemical CSVs, assay certificates, and geophysical grids. Even on grassroots licences without legacy work, we execute independent ASTER/Sentinel-2 SWIR/VNIR spectral processing and regional structural synthesis.",
  },
  {
    code: "03",
    q: "How are the six technical categories weighted inside the 100-point rubric?",
    a: "The 100 points are allocated across six non-overlapping parameters: Regional Geological Setting (20 pts), Deposit Model Validity (20 pts), Structural & Lithological Controls (15 pts), Geochemical & Geophysical Evidence (15 pts), Historical Work & Data Quality (15 pts), and Fatal Flaw & Access Risk (15 pts). Any single unmitigable fatal flaw (such as overlapping title or statutory environmental exclusion) automatically triggers a formal warning flag.",
  },
  {
    code: "04",
    q: "Which mineral deposit models are supported?",
    a: "GeoSentry maintains calibrated diagnostic rubrics for 24 mineral systems, including Porphyry Cu-Au-Mo, Mafic/Bimodal VMS, High- and Low-Sulphidation Epithermal Au-Ag, Orogenic Shear-Zone Gold, IOCG, Skarn, Carlin-Type, LCT Lithium-CES-Ta Pegmatites, Nickel Laterite, BIF Iron, SEDEX, and MVT Pb-Zn systems.",
  },
  {
    code: "05",
    q: "What is the turnaround SLA for Standard vs. Priority mandates?",
    a: "Standard single-target screenings ($2,500 USD base fee) are delivered within 5 to 7 business days from scope confirmation. Priority deal-room screenings ($4,200 USD base fee) are assigned immediately to a dedicated senior economic geologist for 48 to 72 hour (2–3 business day) turnaround.",
  },
  {
    code: "06",
    q: "How is client confidentiality and deal-room security maintained?",
    a: "All concession coordinates, vendor documents, and screening verdicts are strictly confidential. Access to live tracking and completed PDF dossiers requires two-factor verification matching the assigned GS-YYYY-XXXX reference number and registered commissioning email address. Standard mutual NDAs are executed upon request.",
  },
  {
    code: "07",
    q: "Does a GeoSentry dossier replace a statutory NI 43-101 or JORC Technical Report?",
    a: "No. GeoSentry is an early-stage, pre-commitment desktop screening and capital-allocation filter designed to prevent expenditure on geologically flawed targets prior to field mobilization. Statutory Competent Person / Qualified Person reports require physical site inspection and are commissioned separately through Geo Vision Research Group.",
  },
  {
    code: "08",
    q: "Can we screen a portfolio of multiple concessions simultaneously?",
    a: "Yes. Under Tier 03 (Multi-Target Portfolio Matrix), we evaluate three or more concessions in parallel and deliver a comparative 100-point ranking matrix so exploration directors and investment committees can allocate Phase-1 field budgets strictly to the highest-merit targets.",
  },
];

export function GsFaq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section
      className="section-padding bg-geo-stone text-geo-ink border-b border-geo-stone-border"
      aria-label="Frequently asked questions"
    >
      <div className="container-custom">
        {/* Top Metadata Rule */}
        <div className="flex items-baseline gap-4 text-[11px] font-mono uppercase tracking-[0.24em] text-geo-slate mb-10">
          <span className="text-geo-ink font-semibold">
            TECHNICAL &amp; COMMERCIAL PROTOCOLS FAQ
          </span>
          <span className="h-px flex-1 bg-geo-stone-border" />
          <span className="tabular-nums">08 STANDARD INQUIRIES</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12">
          {/* Left Column (4 cols) */}
          <div className="lg:col-span-4">
            <h2 className="text-headline text-geo-ink mb-4">
              Methodological &amp;{" "}
              <span className="italic font-normal text-geo-gold-dark">
                Mandate
              </span>{" "}
              Clarifications.
            </h2>
            <p className="text-sm text-geo-slate leading-relaxed">
              Specifications governing data room intake, 100-point rubric
              calibration, confidentiality protocols, and statutory reporting
              boundaries.
            </p>
          </div>

          {/* Right Column (8 cols): Swiss Accordion Ledger */}
          <div className="lg:col-span-8 border-t border-geo-stone-border">
            {FAQS.map((faq, i) => {
              const isOpen = open === i;
              return (
                <div
                  key={faq.code}
                  className="border-b border-geo-stone-border bg-white/50"
                >
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="w-full flex items-baseline justify-between gap-4 px-5 sm:px-6 py-5 text-left hover:bg-geo-stone-muted/50 transition-colors"
                    aria-expanded={isOpen}
                    id={`faq-q-${i}`}
                    aria-controls={`faq-a-${i}`}
                  >
                    <div className="flex items-baseline gap-4 pr-4">
                      <span className="text-xs font-mono font-semibold text-geo-gold-dark tabular-nums shrink-0">
                        {faq.code}
                      </span>
                      <span className="text-base font-heading text-geo-ink">
                        {faq.q}
                      </span>
                    </div>
                    <span className="text-xs font-mono font-bold text-geo-ink shrink-0">
                      {isOpen ? "[—]" : "[+]"}
                    </span>
                  </button>
                  <div
                    id={`faq-a-${i}`}
                    role="region"
                    aria-labelledby={`faq-q-${i}`}
                    className={`transition-all duration-200 ${
                      isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                    } overflow-hidden`}
                  >
                    <p className="px-5 sm:px-6 pb-6 pl-14 text-xs sm:text-sm text-geo-charcoal leading-relaxed">
                      {faq.a}
                    </p>
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
