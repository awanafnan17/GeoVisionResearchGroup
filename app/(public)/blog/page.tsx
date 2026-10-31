import type { Metadata } from "next";
import Link from "next/link";
import { getAllBlogPosts, getAllBlogCategories } from "@/lib/public-data";
import { formatDateShort } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Research Journal & Technical Blog | Geo Vision Research Group",
  description:
    "Technical articles, methodology briefs, and earth science research insights covering mineral exploration, remote sensing, sequence stratigraphy, and hydrogeology.",
};

interface BlogPageProps {
  searchParams: Promise<{
    search?: string;
    category?: string;
  }>;
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const params = await searchParams;
  const currentSearch = params.search ?? "";
  const currentCategory = params.category ?? "";

  const [posts, categories] = await Promise.all([
    getAllBlogPosts({
      search: currentSearch,
      category: currentCategory,
    }),
    getAllBlogCategories(),
  ]);

  const leadPost = posts[0] ?? null;
  const streamPosts = posts.slice(1);

  return (
    <>
      {/* Journal Header — Deep Mineral Navy (paperframe-inspired) */}
      <section
        className="relative pt-32 pb-20 lg:pt-40 lg:pb-24 bg-geo-navy geo-grid-bg border-b border-white/10"
        aria-label="Research and blog hero"
      >
        <div className="container-custom">
          {/* Top Metadata Hairline Bar */}
          <div className="flex items-baseline gap-4 text-[11px] font-mono uppercase tracking-[0.24em] text-geo-gold mb-10">
            <span>SCIENTIFIC JOURNAL &amp; ARTICLES</span>
            <span className="h-px flex-1 bg-white/15" />
            <span className="text-geo-slate-light tabular-nums">
              VOL. 2026 &bull; {String(posts.length).padStart(2, "0")} ARTICLES
            </span>
          </div>

          <div className="max-w-4xl">
            <div className="geo-badge mb-6">Knowledge Hub &amp; Publications</div>
            <h1 className="text-display text-geo-white mb-6 [text-wrap:balance]">
              Research Journal &amp; Technical{" "}
              <span className="italic text-geo-gold">Blog</span>
            </h1>
            <p className="text-lg sm:text-xl text-geo-slate-light max-w-2xl leading-relaxed">
              Methodology briefs, multi-spectral remote sensing guides, and applied geoscience commentaries authored by our principal specialists.
            </p>
          </div>

          {/* 3-Column Monospace Metadata Ledger Beneath Headline */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 border-t border-white/15 pt-6 mt-12 font-mono text-xs">
            <div>
              <span className="block text-[10px] uppercase tracking-[0.2em] text-geo-slate mb-1">
                EDITORIAL BOARD
              </span>
              <span className="text-geo-white">
                Geo Vision Principal Geoscientists
              </span>
            </div>
            <div>
              <span className="block text-[10px] uppercase tracking-[0.2em] text-geo-slate mb-1">
                PRIMARY DOMAINS
              </span>
              <span className="text-geo-white">
                Alteration Mapping, VMS/Porphyry &amp; Hydrogeology
              </span>
            </div>
            <div>
              <span className="block text-[10px] uppercase tracking-[0.2em] text-geo-slate mb-1">
                PUBLICATION FREQUENCY
              </span>
              <span className="text-geo-gold">
                Peer-Reviewed Technical Notes
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Swiss Scientific Journal Body — Warm Alabaster Stone */}
      <section
        className="section-padding bg-geo-stone text-geo-ink border-b border-geo-stone-border"
        aria-label="Research articles"
      >
        <div className="container-custom">
          {/* Topic Index & Search Controls */}
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 pb-8 mb-12 border-b border-geo-stone-border">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-geo-slate mr-2">
                TAXONOMY:
              </span>
              <Link
                href={
                  currentSearch
                    ? `/blog?search=${encodeURIComponent(currentSearch)}`
                    : "/blog"
                }
                className={`px-3.5 py-2 rounded-none font-mono text-[11px] uppercase tracking-[0.16em] border transition-colors ${
                  !currentCategory
                    ? "bg-geo-ink text-geo-stone border-geo-ink font-semibold"
                    : "bg-[#FAF8F3] text-geo-charcoal border-geo-stone-border hover:border-geo-ink"
                }`}
              >
                All Topics
              </Link>
              {categories.map((cat) => {
                const isActive = currentCategory === cat;
                const href = `/blog?category=${encodeURIComponent(cat)}${
                  currentSearch ? `&search=${encodeURIComponent(currentSearch)}` : ""
                }`;
                return (
                  <Link
                    key={cat}
                    href={href}
                    className={`px-3.5 py-2 rounded-none font-mono text-[11px] uppercase tracking-[0.16em] border transition-colors ${
                      isActive
                        ? "bg-geo-ink text-geo-stone border-geo-ink font-semibold"
                        : "bg-[#FAF8F3] text-geo-charcoal border-geo-stone-border hover:border-geo-ink"
                    }`}
                  >
                    {cat}
                  </Link>
                );
              })}
            </div>

            <form action="/blog" method="GET" className="flex items-center">
              {currentCategory && (
                <input type="hidden" name="category" value={currentCategory} />
              )}
              <input
                type="search"
                name="search"
                defaultValue={currentSearch}
                placeholder="Search journal archive..."
                aria-label="Search blog articles"
                className="w-full sm:w-64 px-4 py-2.5 rounded-none bg-[#FAF8F3] border border-geo-stone-border text-sm text-geo-ink placeholder:text-geo-slate focus:outline-none focus:border-geo-gold"
              />
              <button
                type="submit"
                className="px-5 py-2.5 bg-geo-ink text-geo-stone font-mono text-xs uppercase tracking-[0.16em] hover:bg-geo-charcoal transition-colors shrink-0"
              >
                Search
              </button>
            </form>
          </div>

          {posts.length > 0 && leadPost ? (
            <div className="space-y-16">
              {/* Featured Lead Essay — Separated by Top Hairline Rule */}
              <article className="editorial-rule-top-dark bg-[#FAF8F3] border border-geo-stone-border p-7 sm:p-10 lg:p-12">
                <div className="flex items-baseline gap-4 text-[11px] font-mono uppercase tracking-[0.22em] text-geo-gold-dark mb-6">
                  <span>LEAD ARTICLE</span>
                  <span className="h-px flex-1 bg-geo-stone-border" />
                  <span>{leadPost.category ?? "Research"}</span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
                  <div className="lg:col-span-8">
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading text-geo-ink hover:text-geo-gold-dark transition-colors mb-5 leading-[1.08]">
                      <Link href={`/blog/${leadPost.slug}`}>
                        {leadPost.title}
                      </Link>
                    </h2>

                    <p className="text-base sm:text-lg text-geo-charcoal/85 leading-relaxed mb-8">
                      {leadPost.excerpt}
                    </p>

                    <Link
                      href={`/blog/${leadPost.slug}`}
                      className="inline-flex items-center gap-2.5 px-6 py-3 bg-geo-ink text-geo-stone font-mono text-xs uppercase tracking-[0.16em] font-semibold hover:bg-geo-gold hover:text-geo-navy transition-colors"
                    >
                      <span>Read Lead Article</span>
                      <span aria-hidden="true">&rarr;</span>
                    </Link>
                  </div>

                  {/* Lead Essay Metadata Ledger */}
                  <div className="lg:col-span-4 border-t lg:border-t-0 lg:border-l border-geo-stone-border pt-6 lg:pt-0 lg:pl-8 space-y-4 font-mono text-xs">
                    <div className="pb-3 border-b border-geo-stone-border">
                      <span className="block text-[10px] uppercase tracking-[0.18em] text-geo-slate mb-1">
                        AUTHOR ATTRIBUTION
                      </span>
                      <span className="text-geo-ink font-semibold">
                        {leadPost.authorName ?? "Geo Vision Research Team"}
                      </span>
                    </div>
                    <div className="pb-3 border-b border-geo-stone-border">
                      <span className="block text-[10px] uppercase tracking-[0.18em] text-geo-slate mb-1">
                        PUBLICATION DATE
                      </span>
                      <span className="text-geo-ink tabular-nums">
                        {formatDateShort(leadPost.publishedAt ?? leadPost.createdAt)}
                      </span>
                    </div>
                    <div className="pb-3 border-b border-geo-stone-border">
                      <span className="block text-[10px] uppercase tracking-[0.18em] text-geo-slate mb-1">
                        READING DURATION
                      </span>
                      <span className="text-geo-gold-dark font-semibold tabular-nums">
                        {leadPost.readTime ?? "6 min read"}
                      </span>
                    </div>
                    {leadPost.tags.length > 0 && (
                      <div>
                        <span className="block text-[10px] uppercase tracking-[0.18em] text-geo-slate mb-2">
                          INDEX KEYWORDS
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {leadPost.tags.slice(0, 4).map((tag) => (
                            <span
                              key={tag}
                              className="px-2 py-0.5 bg-geo-stone-muted border border-geo-stone-border text-[10px] text-geo-charcoal uppercase tracking-[0.12em]"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </article>

              {/* Indexed Editorial Article Stream */}
              {streamPosts.length > 0 && (
                <div>
                  <div className="flex items-baseline gap-4 text-[11px] font-mono uppercase tracking-[0.24em] text-geo-charcoal mb-8">
                    <span>INDEXED JOURNAL ARCHIVE</span>
                    <span className="h-px flex-1 bg-geo-stone-border" />
                    <span className="tabular-nums">
                      ENTRIES 02 — {String(posts.length).padStart(2, "0")}
                    </span>
                  </div>

                  <div className="border-t border-geo-stone-border">
                    {streamPosts.map((post, idx) => {
                      const articleNum = String(idx + 2).padStart(2, "0");
                      return (
                        <article
                          key={post.id}
                          className="group grid grid-cols-1 lg:grid-cols-12 gap-6 py-8 px-6 bg-[#FAF8F3] border-b border-x border-geo-stone-border hover:bg-geo-stone-muted/40 transition-colors items-start"
                        >
                          {/* Column 1: Index & Date */}
                          <div className="lg:col-span-3 font-mono text-xs space-y-1">
                            <div className="flex items-center gap-3">
                              <span className="text-geo-gold-dark font-semibold tabular-nums">
                                ARTICLE &bull; {articleNum}
                              </span>
                              <span className="px-2 py-0.5 bg-geo-stone-muted border border-geo-stone-border text-[10px] uppercase tracking-[0.14em] text-geo-ink">
                                {post.category ?? "Research"}
                              </span>
                            </div>
                            <p className="text-geo-slate text-[11px] tabular-nums pt-1">
                              {formatDateShort(post.publishedAt ?? post.createdAt)} ·{" "}
                              {post.readTime ?? "6 min read"}
                            </p>
                          </div>

                          {/* Column 2: Headline & Excerpt */}
                          <div className="lg:col-span-6">
                            <h2 className="text-2xl font-heading text-geo-ink group-hover:text-geo-gold-dark transition-colors mb-2 leading-snug">
                              <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                            </h2>
                            <p className="text-sm text-geo-charcoal/80 leading-relaxed">
                              {post.excerpt}
                            </p>
                          </div>

                          {/* Column 3: Author & Link */}
                          <div className="lg:col-span-3 lg:text-right flex lg:flex-col justify-between items-center lg:items-end gap-3 h-full">
                            <span className="font-mono text-xs text-geo-charcoal">
                              {post.authorName ?? "Geo Vision Research Team"}
                            </span>
                            <Link
                              href={`/blog/${post.slug}`}
                              className="font-mono text-xs font-semibold uppercase tracking-[0.16em] text-geo-ink group-hover:text-geo-gold-dark transition-colors"
                            >
                              Read Article &rarr;
                            </Link>
                          </div>
                        </article>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-16 px-6 bg-[#FAF8F3] border border-geo-stone-border">
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-geo-slate mb-2">
                NO JOURNAL ARTICLES FOUND
              </p>
              <p className="text-geo-charcoal text-sm mb-6">
                No articles matched your search criteria.
              </p>
              <Link
                href="/blog"
                className="inline-block px-5 py-2.5 bg-geo-ink text-geo-stone font-mono text-xs uppercase tracking-[0.16em]"
              >
                Reset Search
              </Link>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
