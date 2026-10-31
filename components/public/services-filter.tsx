"use client";

import { useState, useMemo } from "react";
import type { PublicService } from "@/lib/public-data";
import { ServiceCard } from "@/components/public/service-card";

interface ServicesFilterProps {
  services: PublicService[];
}

export function ServicesFilter({ services }: ServicesFilterProps) {
  const [search, setSearch] = useState("");
  const [activeSpec, setActiveSpec] = useState<string>("all");

  // Extract unique specializations for filter tabs
  const specializations = useMemo(() => {
    const specs = new Map<string, { id: string; name: string }>();
    for (const s of services) {
      if (s.specialization) {
        specs.set(s.specialization.id, {
          id: s.specialization.id,
          name: s.specialization.name,
        });
      }
    }
    return Array.from(specs.values()).sort((a, b) =>
      a.name.localeCompare(b.name)
    );
  }, [services]);

  // Filter services
  const filtered = useMemo(() => {
    let result = services;

    if (activeSpec !== "all") {
      result = result.filter((s) => s.specialization?.id === activeSpec);
    }

    if (search.trim()) {
      const q = search.toLowerCase().trim();
      result = result.filter(
        (s) =>
          s.title.toLowerCase().includes(q) ||
          s.description.toLowerCase().includes(q) ||
          s.tagline?.toLowerCase().includes(q) ||
          s.specialization?.name.toLowerCase().includes(q)
      );
    }

    return result;
  }, [services, activeSpec, search]);

  return (
    <div>
      {/* Editorial Filter Ledger Bar */}
      <div className="mb-12 pb-8 border-b border-geo-stone-border">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end">
          {/* Section Label */}
          <div className="lg:col-span-5">
            <span className="block font-mono text-[11px] uppercase tracking-[0.2em] text-geo-gold-dark mb-2">
              PRACTICE LEDGER • FILTER BY DOMAIN
            </span>
            <h2 className="text-3xl font-heading text-geo-ink">
              Commissionable Geoscience Disciplines
            </h2>
          </div>

          {/* Search Input */}
          <div className="lg:col-span-4">
            <label
              htmlFor="services-search"
              className="block font-mono text-[10px] uppercase tracking-[0.18em] text-geo-slate mb-1.5"
            >
              Keyword / Commodity Filter
            </label>
            <div className="relative">
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search practice, method, deliverable..."
                className="w-full px-4 py-2.5 rounded-none bg-[#FAF8F3] border border-geo-stone-border text-sm text-geo-ink placeholder:text-geo-slate focus:outline-none focus:border-geo-gold transition-colors"
                aria-label="Search services"
                id="services-search"
              />
            </div>
          </div>

          {/* Count Indicator */}
          <div className="lg:col-span-3 lg:text-right">
            <span className="inline-block font-mono text-xs uppercase tracking-[0.16em] text-geo-charcoal px-3 py-2.5 bg-geo-stone-muted border border-geo-stone-border tabular-nums">
              SHOWING {String(filtered.length).padStart(2, "0")} /{" "}
              {String(services.length).padStart(2, "0")} SERVICES
            </span>
          </div>
        </div>

        {/* Specialization Filter Tabs */}
        {specializations.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 mt-6 pt-6 border-t border-geo-stone-border/70">
            <button
              type="button"
              onClick={() => setActiveSpec("all")}
              className={`px-4 py-2 rounded-none font-mono text-[11px] uppercase tracking-[0.16em] border transition-colors duration-200 ${
                activeSpec === "all"
                  ? "bg-geo-ink text-geo-stone border-geo-ink font-semibold"
                  : "bg-[#FAF8F3] text-geo-charcoal border-geo-stone-border hover:border-geo-ink"
              }`}
              aria-label="Show all specializations"
              aria-pressed={activeSpec === "all"}
            >
              All Disciplines
            </button>
            {specializations.map((spec) => (
              <button
                key={spec.id}
                type="button"
                onClick={() =>
                  setActiveSpec(activeSpec === spec.id ? "all" : spec.id)
                }
                className={`px-4 py-2 rounded-none font-mono text-[11px] uppercase tracking-[0.16em] border transition-colors duration-200 ${
                  activeSpec === spec.id
                    ? "bg-geo-ink text-geo-stone border-geo-ink font-semibold"
                    : "bg-[#FAF8F3] text-geo-charcoal border-geo-stone-border hover:border-geo-ink"
                }`}
                aria-label={`Filter by ${spec.name}`}
                aria-pressed={activeSpec === spec.id}
              >
                {spec.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Practice Services Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((service, index) => (
            <ServiceCard key={service.id} service={service} index={index} />
          ))}
        </div>
      ) : (
        <div className="py-16 px-6 text-center bg-[#FAF8F3] border border-geo-stone-border">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-geo-slate mb-2">
            NO MATCHING SERVICES FOUND
          </p>
          <p className="text-geo-charcoal text-sm mb-6">
            {services.length === 0
              ? "Services directory is currently being indexed."
              : "No services match your search criteria. Reset filters to view the full practice index."}
          </p>
          {services.length > 0 && (
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setActiveSpec("all");
              }}
              className="px-5 py-2.5 font-mono text-xs uppercase tracking-[0.16em] bg-geo-ink text-geo-stone border border-geo-ink hover:bg-geo-charcoal transition-colors"
            >
              Reset Filter Index
            </button>
          )}
        </div>
      )}
    </div>
  );
}
