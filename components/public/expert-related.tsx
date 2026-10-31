import type { PublicExpertCard } from "@/lib/public-data";
import { ExpertCard } from "@/components/public/expert-card";

interface ExpertRelatedProps {
  experts: PublicExpertCard[];
}

export function ExpertRelated({ experts }: ExpertRelatedProps) {
  if (experts.length === 0) return null;

  return (
    <section
      className="section-padding bg-geo-stone-muted text-geo-ink border-t border-geo-stone-border"
      aria-label="Related experts"
    >
      <div className="container-custom">
        <div className="editorial-rule-top-dark mb-10">
          <span className="block font-mono text-[11px] uppercase tracking-[0.2em] text-geo-gold-dark mb-2">
            COLLEAGUES IN THIS DISCIPLINE
          </span>
          <h2 className="text-headline text-geo-ink">
            Experts in Similar Fields
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {experts.map((expert, idx) => (
            <ExpertCard key={expert.id} expert={expert} index={idx} />
          ))}
        </div>
      </div>
    </section>
  );
}
