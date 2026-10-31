import type { Metadata } from "next";
import Link from "next/link";
import {
  getAllBlogPosts,
  getAllExperts,
  getExpertBySlug,
} from "@/lib/public-data";
import { formatDateShort } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Publications & Technical Briefs",
  description:
    "Selected scientific publications, methodology briefs, and research articles authored by Geo Vision Research Group specialists.",
};

interface ExpertPublicationItem {
  title?: string;
  journal?: string;
  year?: string | number;
  authors?: string;
  url?: string;
}

export default async function PublicationsPage() {
  const [expertsResult, blogPosts] = await Promise.all([
    getAllExperts({ perPage: 20 }),
    getAllBlogPosts(),
  ]);

  const detailedProfiles = await Promise.all(
    expertsResult.experts.map((e) => getExpertBySlug(e.slug))
  );

  const expertPublications: Array<{
    expertName: string;
    expertSlug: string;
    title: string;
    journal: string;
    year: string;
  }> = [];

  for (const profile of detailedProfiles) {
    if (!profile || !Array.isArray(profile.publications)) continue;
    for (const rawPub of profile.publications as ExpertPublicationItem[]) {
      if (rawPub && typeof rawPub === "object" && rawPub.title) {
        expertPublications.push({
          expertName: profile.fullName,
          expertSlug: profile.slug,
          title: String(rawPub.title),
          journal: String(rawPub.journal ?? "Technical Publication"),
          year: String(rawPub.year ?? "2024"),
        });
      }
    }
  }

  return (
    <>
      {/* 00 // Bibliographic Monograph Header */}
      <section
        className="relative pt-28 pb-16 lg:pt-36 lg:pb-20 bg-geo-navy text-geo-white border-b border-white/15 overflow-hidden"
        aria-label="Publications hero"
      >
        <div className="absolute inset-0 geo-grid-bg opacity-50 pointer-events-none" />

        <div className="relative container-custom">
          <div className="py-4 border-b border-white/10 mb-10 flex flex-wrap items-center justify-between gap-4 text-[11px] font-mono uppercase tracking-[0.22em]">
            <span className="text-geo-gold">
              BIBLIOGRAPHIC ARCHIVE &bull; PEER-REVIEWED &amp; METHODOLOGY BRIEFS
            </span>
            <span className="text-geo-slate-light">
              ISSN / ARCHIVAL SERIES &bull; 2019–2026
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
            <div className="lg:col-span-8">
              <div className="geo-badge mb-5">Research Output</div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-normal text-geo-white tracking-[-0.02em] leading-[1.04]">
                Publications &amp;{" "}
                <span className="italic text-geo-gold">Methodology Briefs</span>
              </h1>
            </div>
            <div className="lg:col-span-4">
              <p className="text-sm sm:text-base text-geo-white-dim leading-relaxed font-sans border-l border-geo-gold pl-5">
                Selected academic papers, technical field notes, and applied
                methodology briefs authored by our senior geoscientists and
                research leads.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 01 // Warm Alabaster Stone — Bibliographic Journal Index */}
      <section
        className="section-padding bg-geo-stone text-geo-ink border-b border-geo-stone-border"
        aria-label="Specialist publications index"
      >
        <div className="container-custom">
          <div className="editorial-rule-top-dark mb-12 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div>
              <div className="text-[11px] font-mono uppercase tracking-[0.22em] text-geo-gold-dark mb-3">
                PEER-REVIEWED &amp; REFERENCE STUDIES
              </div>
              <h2 className="text-3xl sm:text-4xl font-heading font-normal text-geo-ink tracking-[-0.02em]">
                Specialist Papers &amp;{" "}
                <span className="italic text-geo-blue">Reference Studies</span>
              </h2>
            </div>
            <span className="text-xs font-mono text-geo-slate uppercase tracking-[0.16em]">
              TOTAL INDEXED ENTRIES: {expertPublications.length}
            </span>
          </div>

          {expertPublications.length > 0 ? (
            <div className="border border-geo-stone-border divide-y divide-geo-stone-border bg-geo-stone">
              {expertPublications.map((pub, idx) => {
                const refCode = `PUB-${String(idx + 1).padStart(3, "0")}`;
                return (
                  <div
                    key={idx}
                    className="grid grid-cols-1 lg:grid-cols-12 p-6 sm:p-8 gap-6 items-center hover:bg-geo-stone-muted/70 transition-colors"
                  >
                    <div className="lg:col-span-3 font-mono text-xs space-y-1">
                      <div className="text-geo-gold-dark font-semibold uppercase tracking-[0.18em]">
                        {refCode} &bull; {pub.year}
                      </div>
                      <div className="text-geo-slate text-[11px] uppercase tracking-[0.1em]">
                        {pub.journal}
                      </div>
                    </div>

                    <div className="lg:col-span-7">
                      <h3 className="text-xl sm:text-2xl font-heading font-normal text-geo-ink mb-2 leading-snug">
                        {pub.title}
                      </h3>
                      <p className="text-xs font-mono text-geo-charcoal/80">
                        AUTHOR:{" "}
                        <Link
                          href={`/team/${pub.expertSlug}`}
                          className="text-geo-blue hover:text-geo-gold-dark underline underline-offset-4 font-semibold"
                        >
                          {pub.expertName}
                        </Link>
                      </p>
                    </div>

                    <div className="lg:col-span-2 lg:text-right">
                      <Link
                        href={`/team/${pub.expertSlug}`}
                        className="inline-flex items-center gap-1.5 text-[11px] font-mono font-semibold uppercase tracking-[0.16em] text-geo-ink hover:text-geo-gold-dark border border-geo-stone-border px-4 py-2 bg-geo-stone-muted/60 transition-colors"
                      >
                        <span>Author Profile</span>
                        <span>&rarr;</span>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-12 border border-geo-stone-border text-center text-geo-slate font-mono text-xs uppercase tracking-[0.16em]">
              Bibliographic entries are being updated.
            </div>
          )}
        </div>
      </section>

      {/* 02 // Deep Mineral Navy — Technical Articles & Briefs */}
      <section
        className="section-padding bg-geo-navy text-geo-white"
        aria-label="Technical articles and briefs"
      >
        <div className="container-custom">
          <div className="editorial-rule-top mb-12 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
            <div>
              <div className="text-[11px] font-mono uppercase tracking-[0.22em] text-geo-gold mb-3">
                APPLIED METHODOLOGY NOTES
              </div>
              <h2 className="text-3xl sm:text-4xl font-heading font-normal text-geo-white">
                Technical Articles &amp;{" "}
                <span className="italic text-geo-gold">Briefs</span>
              </h2>
            </div>
            <Link
              href="/blog"
              className="text-xs font-mono font-semibold uppercase tracking-[0.18em] text-geo-gold hover:text-geo-gold-light border-b border-geo-gold pb-1 self-start sm:self-auto"
            >
              View All Articles &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 border-t border-l border-white/15">
            {blogPosts.map((post, idx) => {
              const num = String(idx + 1).padStart(2, "0");
              return (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="group flex flex-col justify-between p-8 bg-geo-navy-light/50 hover:bg-geo-navy-light border-r border-b border-white/15 transition-colors"
                >
                  <div>
                    <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-[0.18em] text-geo-slate pb-4 mb-5 border-b border-white/10">
                      <span className="text-geo-gold font-semibold">
                        BRIEF &bull; {num} &bull;{" "}
                        {post.category ?? "Technical Brief"}
                      </span>
                      <span>
                        {formatDateShort(post.publishedAt ?? post.createdAt)}
                      </span>
                    </div>
                    <h3 className="text-2xl font-heading font-normal text-geo-white group-hover:text-geo-gold transition-colors mb-3 leading-snug">
                      {post.title}
                    </h3>
                    <p className="text-sm text-geo-slate-light leading-relaxed mb-6 font-sans">
                      {post.excerpt}
                    </p>
                  </div>
                  <div className="pt-4 border-t border-white/10 flex items-center justify-between text-[11px] font-mono uppercase tracking-[0.16em] text-geo-gold">
                    <span>Read Full Brief</span>
                    <span className="transform group-hover:translate-x-1 transition-transform">
                      &rarr;
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
