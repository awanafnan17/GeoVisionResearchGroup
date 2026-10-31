/**
 * Mutable state bridge for framerate-independent camera and specimen tweening.
 * Mutated by GSAP ScrollTrigger outside React state to ensure 60 FPS scrolling
 * with zero component re-renders.
 */
export interface ScrollStateBridge {
  progress: number; // 0 to 1
  azimuth: number; // radians around Y axis
  elevation: number; // radians up/down
  radius: number; // camera distance
  targetY: number; // camera lookAt Y position
  specimenX: number; // specimen X offset
  specimenY: number; // specimen Y offset
  specimenScale: number; // specimen scale multiplier
  activeHorizon: number; // 1 to 4 representing geological depth horizons
}

export const scrollBridge: ScrollStateBridge = {
  progress: 0,
  azimuth: 0.15,
  elevation: 0.18,
  radius: 5.6,
  targetY: 0,
  specimenX: 1.8,
  specimenY: 0,
  specimenScale: 1.1,
  activeHorizon: 1,
};
