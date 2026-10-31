import type { Metadata } from "next";
import { Manrope, JetBrains_Mono } from "next/font/google";
import { SessionProvider } from "@/components/providers/SessionProvider";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { Toaster } from "sonner";
import { organizationSchema } from "@/lib/seo";
import { safeJsonLd } from "@/lib/utils";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"),
  title: {
    default: "Geo Vision Research Group - International Geoscience Consultancy & Training",
    template: "%s | Geo Vision Research Group",
  },
  description:
    "International geology consultancy providing expert geoscience services, professional training courses, mineral exploration, environmental assessment, and GeoSentry desktop geological screening for mining investors.",
  keywords: [
    "geology consultancy", "geoscience", "mineral exploration", "mining geology",
    "hydrogeology", "geophysics", "environmental geology", "engineering geology",
    "geological mapping", "GIS", "remote sensing", "seismic hazard",
    "geotechnical investigation", "resource estimation", "petroleum geology",
    "structural geology", "geochemistry", "sedimentology", "stratigraphy",
    "groundwater modeling", "environmental impact assessment", "geohazards",
    "geology training", "geology courses", "GeoSentry", "geological screening",
    "mining risk assessment", "desktop study", "due diligence", "mineral deposit",
    "porphyry", "VMS", "epithermal", "orogenic gold", "ophiolite",
    "exploration target", "junior mining", "mining investor",
    "geology expert", "geologist", "earth science", "geological survey",
    "rock mechanics", "well logging", "reservoir characterization",
  ],
  authors: [{ name: "Geo Vision Research Group" }],
  creator: "Geo Vision Research Group",
  publisher: "Geo Vision Research Group",
  openGraph: {
    title: "Geo Vision Research Group - International Geoscience Consultancy",
    description: "Expert geological services, training, and GeoSentry screening across all earth science disciplines.",
    url: process.env.NEXT_PUBLIC_APP_URL,
    siteName: "Geo Vision Research Group",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "Geo Vision Research Group" }],
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Geo Vision Research Group",
    description: "International Geoscience Consultancy & Training",
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
  icons: { icon: "/favicon.ico" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`dark ${manrope.variable} ${jetbrainsMono.variable}`}>
      <body
        className="font-sans antialiased bg-[#060B14] text-slate-100 selection:bg-emerald-500/25 selection:text-white"
      >
        <SessionProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem={false}
            disableTransitionOnChange
          >
            <SmoothScroll>
              {children}
              <Toaster
                position="top-right"
                toastOptions={{
                  style: {
                    background: "#0B1324",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    color: "#F6F3EC",
                    borderRadius: "8px",
                    fontFamily: "var(--font-inter), sans-serif",
                    boxShadow: "0 20px 40px -15px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.08)",
                  },
                }}
              />
            </SmoothScroll>
          </ThemeProvider>
        </SessionProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: safeJsonLd(organizationSchema) }}
        />
      </body>
    </html>
  );
}
