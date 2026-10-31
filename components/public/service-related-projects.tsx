import Link from "next/link";
import type { RelatedProject } from "@/lib/public-data";

interface ServiceRelatedProjectsProps {
  projects: RelatedProject[];
}

export function ServiceRelatedProjects({
  projects,
}: ServiceRelatedProjectsProps) {
  if (projects.length === 0) return null;

  return (
    <section
      className="section-padding bg-geo-stone-muted text-geo-ink border-b border-geo-stone-border"
      aria-label="Related projects"
    >
      <div className="container-custom">
        <div className="editorial-rule-top-dark mb-12 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div>
            <span className="block font-mono text-[11px] uppercase tracking-[0.2em] text-geo-gold-dark mb-2">
              BENCHMARK INVESTIGATIONS
            </span>
            <h2 className="text-headline text-geo-ink">Related Case Dossiers</h2>
          </div>
          <Link
            href="/portfolio"
            className="font-mono text-xs uppercase tracking-[0.16em] text-geo-ink hover:text-geo-gold-dark"
          >
            All Field Dossiers &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {projects.map((project, idx) => (
            <Link
              key={project.id}
              href={`/portfolio/${project.slug}`}
              className="group flex flex-col justify-between bg-[#FAF8F3] border border-geo-stone-border hover:border-geo-gold transition-colors p-6"
            >
              <div>
                <div className="flex items-center justify-between gap-2 pb-3 mb-4 border-b border-geo-stone-border font-mono text-[10px] uppercase tracking-[0.18em] text-geo-slate">
                  <span>DOSSIER • {String(idx + 1).padStart(2, "0")}</span>
                  {project.year && (
                    <span className="text-geo-gold-dark font-semibold tabular-nums">
                      {project.year}
                    </span>
                  )}
                </div>

                <h3 className="text-xl font-heading text-geo-ink group-hover:text-geo-gold-dark transition-colors mb-3 leading-snug">
                  {project.title}
                </h3>

                <p className="text-xs text-geo-charcoal/80 leading-relaxed line-clamp-3 mb-6">
                  {project.description}
                </p>
              </div>

              <div className="pt-3 border-t border-geo-stone-border flex items-center justify-between font-mono text-[11px]">
                <span className="text-geo-slate truncate">
                  {[project.city, project.country].filter(Boolean).join(", ") ||
                    "Regional Study"}
                </span>
                <span className="text-geo-ink group-hover:text-geo-gold-dark font-semibold shrink-0">
                  Read Dossier &rarr;
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
