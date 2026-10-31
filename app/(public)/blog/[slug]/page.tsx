import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getBlogPostBySlug } from "@/lib/public-data";
import { formatDate, sanitizeHtml, readingTime } from "@/lib/utils";

interface BlogPostDetailProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: BlogPostDetailProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) return { title: "Article Not Found" };
  return {
    title: `${post.metaTitle ?? post.title} | Geo Vision Research Group`,
    description: post.metaDesc ?? post.excerpt,
  };
}

export default async function BlogPostDetailPage({
  params,
}: BlogPostDetailProps) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const estimatedMinutes =
    post.readTime ?? `${readingTime(post.content)} min read`;

  return (
    <>
      {/* Article Header — Deep Mineral Navy */}
      <section
        className="relative pt-32 pb-20 lg:pt-40 lg:pb-24 bg-geo-navy geo-grid-bg border-b border-white/10"
        aria-label="Article header"
      >
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            {/* Top Metadata Hairline Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-10 border-b border-white/10 font-mono text-[11px] uppercase tracking-[0.22em] text-geo-slate-light">
              <Link
                href="/blog"
                className="text-geo-gold hover:text-geo-gold-light transition-colors"
              >
                &larr; Back to Research &amp; Blog
              </Link>
              {post.category && (
                <span className="px-3 py-1 bg-geo-navy-light border border-geo-gold/40 text-geo-gold">
                  ARTICLE &bull; {post.category}
                </span>
              )}
            </div>

            <h1 className="text-display text-geo-white mb-8 [text-wrap:balance]">
              {post.title}
            </h1>

            {/* 3-Column Monospace Metadata Ledger Beneath Headline */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 border-t border-white/15 pt-6 font-mono text-xs">
              <div>
                <span className="block text-[10px] uppercase tracking-[0.2em] text-geo-slate mb-1">
                  AUTHOR
                </span>
                <span className="text-geo-white font-semibold">
                  {post.authorName ?? "Geo Vision Research Team"}
                </span>
              </div>
              <div>
                <span className="block text-[10px] uppercase tracking-[0.2em] text-geo-slate mb-1">
                  PUBLISHED DATE
                </span>
                <span className="text-geo-white tabular-nums">
                  {formatDate(post.publishedAt ?? post.createdAt)}
                </span>
              </div>
              <div>
                <span className="block text-[10px] uppercase tracking-[0.2em] text-geo-slate mb-1">
                  READING TIME
                </span>
                <span className="text-geo-gold tabular-nums">
                  {estimatedMinutes}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Long-Form Reading Column — Warm Alabaster Stone */}
      <section
        className="section-padding bg-geo-stone text-geo-ink border-b border-geo-stone-border"
        aria-label="Article content"
      >
        <div className="container-custom">
          <div className="max-w-4xl mx-auto space-y-12">
            <article className="bg-[#FAF8F3] border border-geo-stone-border p-7 sm:p-12 lg:p-16">
              {/* Serif Editorial Pull-Quote / Abstract */}
              {post.excerpt && (
                <blockquote className="font-heading italic text-2xl sm:text-3xl text-geo-ink border-l-2 border-geo-gold pl-6 py-2 mb-10 leading-[1.25]">
                  &ldquo;{post.excerpt}&rdquo;
                </blockquote>
              )}

              {/* Long-Form Body Copy */}
              <div
                className="prose max-w-none text-base sm:text-[1.0625rem] text-geo-charcoal space-y-5 leading-[1.8] [&>p]:mb-5 [&>h2]:text-geo-ink [&>h2]:font-heading [&>h2]:text-3xl [&>h2]:mt-10 [&>h2]:mb-4 [&>h3]:text-geo-ink [&>h3]:font-heading [&>h3]:text-2xl [&>h3]:mt-8 [&>h3]:mb-3 [&>ul]:list-disc [&>ul]:pl-6 [&>ul>li]:text-geo-charcoal [&>ol]:list-decimal [&>ol]:pl-6 [&>ol>li]:text-geo-charcoal [&>blockquote]:font-heading [&>blockquote]:italic [&>blockquote]:text-2xl [&>blockquote]:text-geo-ink [&>blockquote]:border-l-2 [&>blockquote]:border-geo-gold [&>blockquote]:pl-5 [&>a]:text-geo-gold-dark [&>a:hover]:underline"
                dangerouslySetInnerHTML={{
                  __html: sanitizeHtml(post.content),
                }}
              />

              {/* Taxonomic Keywords */}
              {post.tags.length > 0 && (
                <div className="mt-12 pt-6 border-t border-geo-stone-border flex flex-wrap items-center gap-2 font-mono">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-geo-slate mr-2">
                    INDEX KEYWORDS:
                  </span>
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-geo-stone-muted border border-geo-stone-border text-xs text-geo-ink uppercase tracking-[0.12em]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </article>

            {/* Author Monograph Card */}
            <div className="bg-geo-navy text-geo-white border border-geo-gold/40 p-7 sm:p-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div>
                <span className="block font-mono text-[10px] uppercase tracking-[0.2em] text-geo-gold mb-1">
                  ARTICLE AUTHOR ATTRIBUTION
                </span>
                <h2 className="text-2xl font-heading text-geo-white">
                  {post.authorName ?? "Geo Vision Research Team"}
                </h2>
                {post.authorBio && (
                  <p className="text-xs text-geo-slate-light mt-2 leading-relaxed max-w-xl">
                    {post.authorBio}
                  </p>
                )}
              </div>
              <div className="flex flex-wrap gap-3 shrink-0">
                <Link href="/blog" className="btn-outline">
                  Journal Index
                </Link>
                <Link href="/contact" className="btn-primary">
                  Contact Advisory Desk
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
