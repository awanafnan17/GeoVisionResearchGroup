import Link from "next/link";

const FOOTER_SECTIONS = [
  {
    title: "Organization",
    links: [
      { label: "About the Group", href: "/about" },
      { label: "Expert Directory", href: "/team" },
      { label: "Case Studies", href: "/portfolio" },
      { label: "Research & Journal", href: "/blog" },
      { label: "Associate Roster", href: "/careers" },
      { label: "Commissioning Desk", href: "/contact" },
    ],
  },
  {
    title: "Capabilities",
    links: [
      { label: "Mineral Exploration", href: "/services/mineral-exploration" },
      { label: "Site Investigation", href: "/services/site-investigation" },
      { label: "Geophysical Surveys", href: "/services/geophysical-surveys" },
      { label: "GIS & Remote Sensing", href: "/services/gis-remote-sensing" },
      { label: "All Capabilities", href: "/services" },
    ],
  },
  {
    title: "Academy",
    links: [
      { label: "Professional Courses", href: "/courses" },
      { label: "Publications Index", href: "/publications" },
      { label: "Technical Library", href: "/resources" },
      { label: "Field Portfolio", href: "/portfolio" },
    ],
  },
  {
    title: "GeoSentry",
    links: [
      { label: "System Overview", href: "/geosentry" },
      { label: "100-Point Matrix", href: "/geosentry/framework" },
      { label: "Evaluation Methodology", href: "/geosentry/how-it-works" },
      { label: "Sample Report", href: "/geosentry/sample-report" },
      { label: "Commission Screening", href: "/geosentry/request" },
      { label: "Reference Lookup", href: "/geosentry/track" },
    ],
  },
] as const;

export function Footer() {
  return (
    <footer
      className="relative border-t border-white/10 bg-[#060B14] text-slate-300"
      role="contentinfo"
    >
      {/* Main Midnight Grid */}
      <div className="container-custom py-14 lg:py-18">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12">
          {/* Brand & Advisory Column (4 cols) */}
          <div className="lg:col-span-4 flex flex-col justify-between">
            <div>
              <Link
                href="/"
                className="inline-flex items-center gap-3 group"
                aria-label="Geo Vision Research Group - Home"
              >
                <div className="relative flex items-center justify-center w-9 h-9 rounded-lg bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border border-emerald-500/30 group-hover:border-emerald-400/60 transition-all duration-300 shadow-[0_0_16px_rgba(16,185,129,0.15)]">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    className="w-5 h-5 text-emerald-400 group-hover:scale-105 transition-transform duration-300"
                    aria-hidden="true"
                  >
                    <path
                      d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
                      stroke="currentColor"
                      strokeWidth="1.75"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-emerald-400" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xl font-heading font-bold text-white tracking-tight leading-none group-hover:text-emerald-300 transition-colors">
                    Geo Vision
                  </span>
                  <span className="text-[10px] font-sans font-medium text-slate-400 tracking-wider uppercase leading-tight mt-1">
                    Research Group
                  </span>
                </div>
              </Link>

              <p className="mt-5 text-sm text-slate-400 leading-relaxed max-w-sm">
                International geological research group, earth science
                consultancy, and mineral exploration advisory practice. Home of
                the GeoSentry 100-Point Pre-Field Target Screening System.
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-white/10 space-y-2">
              <div className="text-[11px] font-sans font-semibold uppercase tracking-wider text-slate-400">
                Direct Advisory Desk
              </div>
              <a
                href="mailto:info@geovisionresearchgroup.com"
                className="block text-xs font-sans text-emerald-400 hover:text-emerald-300 transition-colors break-all"
              >
                info@geovisionresearchgroup.com
              </a>
              <p className="text-xs font-sans text-slate-400">
                Regional Hubs: Islamabad, Pakistan &bull; Muscat, Sultanate of Oman
              </p>
            </div>
          </div>

          {/* 4 Navigation Columns (8 cols total) */}
          <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-8">
            {FOOTER_SECTIONS.map((section) => (
              <div key={section.title} className="flex flex-col">
                <h3 className="text-sm font-sans font-semibold text-white tracking-tight mb-4 pb-2 border-b border-white/10">
                  {section.title}
                </h3>
                <ul className="space-y-2.5" role="list">
                  {section.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-xs font-sans text-slate-400 hover:text-emerald-400 transition-colors duration-150 inline-block"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Legal Ledger */}
      <div className="border-t border-white/10 bg-[#03070E]">
        <div className="container-custom py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs font-sans text-slate-500">
            &copy; {new Date().getFullYear()} Geo Vision Research Group. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center gap-6">
            <Link
              href="/privacy"
              className="text-xs font-sans text-slate-400 hover:text-white transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="text-xs font-sans text-slate-400 hover:text-white transition-colors"
            >
              Terms of Service
            </Link>
            <Link
              href="/login"
              className="text-xs font-sans font-medium text-emerald-400 hover:text-emerald-300 transition-colors flex items-center gap-1.5"
            >
              <span>Portal Sign In</span>
              <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
