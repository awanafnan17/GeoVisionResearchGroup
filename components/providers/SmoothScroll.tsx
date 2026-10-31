"use client";

import { useEffect, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";

const PORTAL_PREFIXES = [
  "/superadmin",
  "/admin",
  "/geosentry-portal",
  "/expert",
  "/student",
];

export function SmoothScroll({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isPortal = PORTAL_PREFIXES.some((prefix) => pathname?.startsWith(prefix));

  useEffect(() => {
    if (isPortal) return;
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      touchMultiplier: 2,
    });

    let frameId = 0;
    function raf(time: number) {
      lenis.raf(time);
      frameId = requestAnimationFrame(raf);
    }

    frameId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(frameId);
      lenis.destroy();
    };
  }, [isPortal]);

  return <>{children}</>;
}
