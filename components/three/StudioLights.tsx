"use client";

import { Environment, Lightformer } from "@react-three/drei";

export function StudioLights() {
  return (
    <>
      {/* ══════════════════════════════════════════════════════════
          PROCEDURAL STUDIO ENVIRONMENT (0 MB External Download)
          Generates rich PBR reflections on crystal facets and metallic veins
          ══════════════════════════════════════════════════════════ */}
      <Environment resolution={256}>
        {/* Overhead Key Softbox */}
        <Lightformer
          form="rect"
          intensity={4.5}
          position={[0, 4.5, 3]}
          scale={[10, 5, 1]}
          color="#FFFFFF"
        />

        {/* Emerald Rim Grazing Light */}
        <Lightformer
          form="circle"
          intensity={3.2}
          position={[-6, 1.5, -2]}
          rotation={[0, Math.PI / 2, 0]}
          scale={[7, 7, 1]}
          color="#10B981"
        />

        {/* Geological Cyan Lateral Fill */}
        <Lightformer
          form="rect"
          intensity={3.8}
          position={[6, 0.5, 2]}
          rotation={[0, -Math.PI / 2, 0]}
          scale={[8, 4, 1]}
          color="#06B6D4"
        />

        {/* Deep Pyrite / Gold Low Reflector */}
        <Lightformer
          form="ring"
          intensity={2.4}
          position={[0, -3.5, 1.5]}
          scale={[8, 8, 1]}
          color="#F59E0B"
        />
      </Environment>

      {/* ══════════════════════════════════════════════════════════
          DIRECT PHYSICAL LIGHTS
          ══════════════════════════════════════════════════════════ */}
      {/* Subtle midnight ambient baseline */}
      <ambientLight intensity={0.45} color="#0B1324" />

      {/* Primary Key Directional Sun / Studio Beam */}
      <directionalLight
        position={[4, 7, 5]}
        intensity={1.8}
        color="#F8FAFC"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-bias={-0.0001}
      />

      {/* Emerald Edge Accent Light */}
      <pointLight position={[-4, 2, -2]} intensity={1.5} distance={10} color="#10B981" />

      {/* Cyan Specular High-Refraction Rim */}
      <pointLight position={[3, -2, 3]} intensity={1.2} distance={8} color="#06B6D4" />
    </>
  );
}
