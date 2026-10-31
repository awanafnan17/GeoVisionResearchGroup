"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { scrollBridge } from "@/components/three/scrollBridge";
import { WebGLFallback } from "@/components/three/WebGLFallback";
import type { HomepageStats } from "@/lib/public-data";

// Dynamically import GeologicalScene to prevent SSR canvas initialization issues
const GeologicalScene = dynamic(
  () => import("@/components/three/GeologicalScene"),
  {
    ssr: false,
    loading: () => <WebGLFallback />,
  }
);

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export interface HeroSectionProps {
  stats?: HomepageStats;
}

export function HeroSection({ stats }: HeroSectionProps = {}) {
  const sectionRef = useRef<HTMLElement>(null);
  const [webGLSupported] = useState<boolean>(() => {
    if (typeof window === "undefined") return true;
    try {
      const canvas = document.createElement("canvas");
      return Boolean(canvas.getContext("webgl2") || canvas.getContext("webgl"));
    } catch {
      return false;
    }
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Reduced motion guard: hold static hero camera pose if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      scrollBridge.progress = 0;
      scrollBridge.azimuth = 0.2;
      scrollBridge.elevation = 0.15;
      scrollBridge.radius = 5.6;
      scrollBridge.targetY = 0;
      scrollBridge.specimenX = 1.8;
      scrollBridge.specimenY = 0;
      scrollBridge.specimenScale = 1.0;
      scrollBridge.activeHorizon = 1;
      return;
    }

    // GSAP ScrollTrigger timeline scrubbing scrollBridge across 5 distinct geological depth stages
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: "#main-content",
          start: "top top",
          end: "bottom bottom",
          scrub: 1.2,
          onUpdate: (self) => {
            scrollBridge.progress = self.progress;
          },
        },
      });

      // Stage 1 (0 -> 0.25): Hero Overview to Quantitative Footprint (0m to -250m)
      tl.to(scrollBridge, {
        azimuth: 0.85,
        elevation: 0.26,
        radius: 5.2,
        targetY: -0.4,
        specimenX: 1.6,
        specimenY: 0.15,
        specimenScale: 1.0,
        activeHorizon: 2,
        ease: "power1.inOut",
        duration: 0.25,
      })
      // Stage 2 (0.25 -> 0.50): Advisory Practice to Subsurface Horizons (-250m to -750m)
      .to(scrollBridge, {
        azimuth: 1.85,
        elevation: -0.12,
        radius: 5.0,
        targetY: -0.85,
        specimenX: 1.4,
        specimenY: 0.3,
        specimenScale: 1.05,
        activeHorizon: 3,
        ease: "power1.inOut",
        duration: 0.25,
      })
      // Stage 3 (0.50 -> 0.75): GeoSentry 100-Point Target Screening Core (-750m to -1500m)
      .to(scrollBridge, {
        azimuth: 3.14,
        elevation: 0.14,
        radius: 4.4,
        targetY: -1.75,
        specimenX: 1.25,
        specimenY: 0.55,
        specimenScale: 1.2,
        activeHorizon: 4,
        ease: "power1.inOut",
        duration: 0.25,
      })
      // Stage 4 (0.75 -> 1.00): Academy, Projects & Commissioning Desk (Panoramic Global Overview)
      .to(scrollBridge, {
        azimuth: 4.45,
        elevation: 0.08,
        radius: 5.8,
        targetY: -0.15,
        specimenX: 0.2,
        specimenY: -0.1,
        specimenScale: 0.88,
        activeHorizon: 1,
        ease: "power1.inOut",
        duration: 0.25,
      });
    }, sectionRef);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[92vh] flex flex-col justify-between pt-28 lg:pt-36 pb-16 overflow-hidden border-b border-white/10"
      aria-label="Hero: Stratigraphic Precision & Subsurface Intelligence"
    >
      {/* ══════════════════════════════════════════════════════════
          PERSISTENT 3D BACKGROUND WEBGL CANVAS
          Fixed in background so 3D specimen and camera gracefully accompany user scroll
          ══════════════════════════════════════════════════════════ */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {webGLSupported ? <GeologicalScene /> : <WebGLFallback />}
      </div>

      {/* Atmospheric Vignette and Glow Overlays */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-[#060B14]/40 via-transparent to-[#060B14] pointer-events-none z-[1]" />
      <div className="absolute -top-32 left-1/4 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none z-[1]" />
      <div className="absolute top-1/3 -right-20 w-[450px] h-[450px] bg-cyan-500/10 rounded-full blur-[130px] pointer-events-none z-[1]" />

      {/* Main Hero Content Container */}
      <div className="relative z-10 container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Monumental Modern Sans Typography & Actions */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            {/* Clean Modern Eyebrow Badge (Sans, no slashes, no monospace) */}
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs font-sans font-medium mb-6 backdrop-blur-md self-start shadow-[0_0_24px_rgba(16,185,129,0.15)]">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Earth Science &bull; Subsurface Intelligence &bull; Advisory Practice</span>
            </div>

            {/* Monumental Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-[4.15rem] font-sans font-extrabold tracking-[-0.03em] leading-[1.05] text-white mb-6">
              Stratigraphic Precision &amp;{" "}
              <span className="gradient-text-emerald">Subsurface Intelligence</span>{" "}
              for Global Resource Capital.
            </h1>

            {/* Concise Value Proposition */}
            <p className="text-base sm:text-lg text-slate-300 font-sans leading-relaxed max-w-2xl mb-8">
              An international geological research group and exploration
              advisory practice delivering multidisciplinary earth science
              consulting, multi-spectral alteration mapping, and{" "}
              <span className="text-white font-medium">
                GeoSentry 100-Point Pre-Field Target Screening
              </span>{" "}
              before capital deployment.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 mb-10">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-[#060B14] font-sans font-semibold text-sm transition-all duration-200 shadow-[0_0_24px_rgba(16,185,129,0.25)] hover:shadow-[0_0_32px_rgba(16,185,129,0.4)] hover:-translate-y-0.5"
              >
                <span>Commission Advisory</span>
                <span aria-hidden="true">&rarr;</span>
              </Link>
              <Link
                href="/services"
                className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-lg glass-panel-interactive text-white font-sans font-medium text-sm transition-all duration-200 hover:-translate-y-0.5"
              >
                <span>Explore Capabilities</span>
              </Link>
              <Link
                href="/geosentry/track"
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-lg border border-white/10 hover:border-cyan-500/40 bg-white/[0.03] hover:bg-cyan-500/5 text-slate-300 hover:text-cyan-300 font-sans text-sm transition-all duration-200"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                <span>Track GeoSentry</span>
              </Link>
            </div>

            {/* Value Indicators: Grounded in authentic database records & plain client language */}
            <div className="mt-4 pt-6 border-t border-white/10 flex flex-wrap items-center gap-6 text-xs text-slate-400 font-sans">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span className="text-slate-200 font-medium">
                  {stats?.services ? `${stats.services} Advisory Practice Lines` : "Comprehensive Advisory Capabilities"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                <span className="text-slate-200 font-medium">
                  100-Point GeoSentry Screening Standard
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                <span className="text-slate-200 font-medium">
                  {stats?.specializations ? `${stats.specializations} Earth Science Disciplines` : "Rigorous Desktop Due Diligence"}
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: 3D Spatial Geological HUD & Interactive Focal Window */}
          <div className="lg:col-span-5 relative hidden lg:flex flex-col items-end justify-center pointer-events-none">
            <div className="glass-panel-modern p-5 rounded-2xl max-w-xs border border-white/10 text-xs space-y-3 pointer-events-auto backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
              <div className="flex items-center justify-between pb-2.5 border-b border-white/10">
                <span className="font-sans font-semibold text-white">Subsurface Horizon Model</span>
                <span className="flex items-center gap-1.5 text-emerald-400 font-mono text-[11px]">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  R3F 60FPS
                </span>
              </div>
              <p className="text-slate-300 font-sans text-[11px] leading-relaxed">
                Procedural faceted pegmatite crystal cluster with PBR transmission, stratified horizons, and metallic vein inclusions.
              </p>
              <div className="space-y-1.5 pt-1 font-mono text-[10px] text-slate-400">
                <div className="flex justify-between items-center py-0.5 border-b border-white/5">
                  <span className="text-slate-300">Surface Regolith</span>
                  <span className="text-slate-400">0m Surface</span>
                </div>
                <div className="flex justify-between items-center py-0.5 border-b border-white/5">
                  <span className="text-slate-300">Sedimentary Quartz</span>
                  <span className="text-cyan-400">-250m Horizon</span>
                </div>
                <div className="flex justify-between items-center py-0.5 border-b border-white/5">
                  <span className="text-slate-300">Metamorphic Shear</span>
                  <span className="text-amber-400">-750m Zone</span>
                </div>
                <div className="flex justify-between items-center py-0.5">
                  <span className="text-slate-300">Sulfide Core Target</span>
                  <span className="text-emerald-400">-1,500m Depth</span>
                </div>
              </div>
              <div className="pt-2 text-[10px] font-sans text-slate-400 flex items-center justify-between">
                <span>Scroll to scrub depth stages</span>
                <span className="text-emerald-400">&darr;</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
