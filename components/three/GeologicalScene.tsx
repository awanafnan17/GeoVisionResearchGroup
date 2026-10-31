"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { CameraRig } from "./CameraRig";
import { GeologicalSpecimen } from "./GeologicalSpecimen";
import { StudioLights } from "./StudioLights";

export default function GeologicalScene() {
  return (
    <div className="relative w-full h-full min-h-[520px] pointer-events-none select-none">
      <Canvas
        camera={{ position: [0, 0.8, 5.6], fov: 42 }}
        dpr={[1, 1.75]}
        gl={{
          powerPreference: "high-performance",
          antialias: true,
          alpha: true,
        }}
        className="w-full h-full"
      >
        <Suspense fallback={null}>
          <StudioLights />
          <CameraRig />
          <GeologicalSpecimen />
        </Suspense>
      </Canvas>
    </div>
  );
}
