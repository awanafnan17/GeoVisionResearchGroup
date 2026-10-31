import { sanitizeHtml } from "@/lib/utils";

interface ServiceDetailsProps {
  description: string;
  fullContent: string | null;
  methodology: string | null;
  deliverables: unknown;
  tools: unknown;
}

export function ServiceDetails({
  description,
  fullContent,
  methodology,
  deliverables,
  tools,
}: ServiceDetailsProps) {
  const deliverablesList = Array.isArray(deliverables) ? deliverables : [];
  const toolsList = Array.isArray(tools) ? tools : [];

  return (
    <section
      className="section-padding bg-geo-stone text-geo-ink border-b border-geo-stone-border"
      aria-label="Service overview"
    >
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column: Specification Index & Analytical Stack */}
          <aside className="lg:col-span-4 space-y-8">
            <div className="bg-[#FAF8F3] border border-geo-stone-border p-6">
              <span className="block font-mono text-[10px] uppercase tracking-[0.2em] text-geo-gold-dark mb-4">
                DOCUMENT SPECIFICATION
              </span>
              <ol className="space-y-3 font-mono text-xs text-geo-charcoal">
                <li className="flex items-center justify-between pb-2.5 border-b border-geo-stone-border">
                  <span>01. Scope of Practice</span>
                  <span className="text-geo-slate">SEC-01</span>
                </li>
                {methodology && (
                  <li className="flex items-center justify-between pb-2.5 border-b border-geo-stone-border">
                    <span>02. Analytical Methodology</span>
                    <span className="text-geo-slate">SEC-02</span>
                  </li>
                )}
                {deliverablesList.length > 0 && (
                  <li className="flex items-center justify-between pb-2.5 border-b border-geo-stone-border">
                    <span>03. Deliverables Manifest</span>
                    <span className="text-geo-slate">
                      {String(deliverablesList.length).padStart(2, "0")} ITEMS
                    </span>
                  </li>
                )}
                {toolsList.length > 0 && (
                  <li className="flex items-center justify-between">
                    <span>04. Software &amp; Instrumentation</span>
                    <span className="text-geo-slate">
                      {String(toolsList.length).padStart(2, "0")} TOOLS
                    </span>
                  </li>
                )}
              </ol>
            </div>

            {/* Tools & Technologies Ledger */}
            {toolsList.length > 0 && (
              <div
                className="bg-[#FAF8F3] border border-geo-stone-border p-6"
                aria-label="Tools and technologies"
              >
                <span className="block font-mono text-[10px] uppercase tracking-[0.2em] text-geo-gold-dark mb-2">
                  INSTRUMENTATION &amp; SOFTWARE
                </span>
                <h2 className="text-xl font-heading text-geo-ink mb-4">
                  Tools &amp; Technologies
                </h2>
                <div className="flex flex-wrap gap-2">
                  {toolsList.map((tool, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center px-3 py-1.5 bg-geo-stone-muted border border-geo-stone-border font-mono text-xs text-geo-ink"
                    >
                      {String(tool)}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </aside>

          {/* Right Column: Narrative Overview, Methodology & Deliverables */}
          <div className="lg:col-span-8 space-y-14">
            {/* 01. Scope of Practice */}
            <div className="editorial-rule-top-dark">
              <span className="block font-mono text-[11px] uppercase tracking-[0.2em] text-geo-gold-dark mb-2">
                TECHNICAL MANDATE
              </span>
              <h2 className="text-headline text-geo-ink mb-6">
                Service Description &amp; Technical Scope
              </h2>
              <div
                className="prose max-w-none text-geo-charcoal leading-relaxed [&>p]:mb-5 [&>h2]:text-geo-ink [&>h2]:font-heading [&>h2]:text-2xl [&>h2]:mb-4 [&>h2]:mt-10 [&>h3]:text-geo-ink [&>h3]:font-heading [&>h3]:text-xl [&>h3]:mb-3 [&>ul]:space-y-2 [&>ul>li]:text-geo-charcoal [&>ol]:space-y-2 [&>ol>li]:text-geo-charcoal [&>a]:text-geo-gold-dark [&>a:hover]:underline"
                dangerouslySetInnerHTML={{
                  __html: sanitizeHtml(fullContent || description),
                }}
              />
            </div>

            {/* 02. Methodology */}
            {methodology && (
              <div className="editorial-rule-top-dark">
                <span className="block font-mono text-[11px] uppercase tracking-[0.2em] text-geo-gold-dark mb-2">
                  WORKFLOW PROTOCOL
                </span>
                <h2 className="text-title text-geo-ink mb-5">
                  Analytical Methodology
                </h2>
                <div
                  className="bg-[#FAF8F3] border border-geo-stone-border p-6 sm:p-8 text-geo-charcoal leading-relaxed [&>p]:mb-4 last:[&>p]:mb-0"
                  dangerouslySetInnerHTML={{ __html: sanitizeHtml(methodology) }}
                />
              </div>
            )}

            {/* 03. Deliverables */}
            {deliverablesList.length > 0 && (
              <div className="editorial-rule-top-dark">
                <span className="block font-mono text-[11px] uppercase tracking-[0.2em] text-geo-gold-dark mb-2">
                  CLIENT HANDOVER
                </span>
                <h2 className="text-title text-geo-ink mb-6">
                  Standard Technical Deliverables
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 border-t border-l border-geo-stone-border">
                  {deliverablesList.map((item, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-4 p-5 bg-[#FAF8F3] border-r border-b border-geo-stone-border"
                    >
                      <span className="font-mono text-xs font-semibold text-geo-gold-dark shrink-0 mt-0.5 tabular-nums">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="text-sm text-geo-ink leading-snug">
                        {String(item)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
