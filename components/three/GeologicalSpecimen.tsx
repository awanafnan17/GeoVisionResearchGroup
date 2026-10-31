"use client";

import { useRef, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Sparkles } from "@react-three/drei";
import * as THREE from "three";
import { scrollBridge } from "./scrollBridge";

// Stratum horizon data structure
interface HorizonConfig {
  id: number;
  depth: string;
  name: string;
  y: number;
  rockColor: string;
  veinColor: string;
  veinMetalness: number;
  veinRoughness: number;
  radius: number;
  height: number;
}

const HORIZONS: HorizonConfig[] = [
  {
    id: 1,
    depth: "0m",
    name: "Surface Regolith & Structural Horizon",
    y: -0.95,
    rockColor: "#1E293B",
    veinColor: "#E2E8F0",
    veinMetalness: 0.65,
    veinRoughness: 0.25,
    radius: 1.8,
    height: 0.26,
  },
  {
    id: 2,
    depth: "-250m",
    name: "Stratified Sedimentary & Quartz Horizon",
    y: -1.35,
    rockColor: "#162032",
    veinColor: "#93C5FD",
    veinMetalness: 0.75,
    veinRoughness: 0.2,
    radius: 1.95,
    height: 0.28,
  },
  {
    id: 3,
    depth: "-750m",
    name: "Foliated Metamorphic & Copper Shear Zone",
    y: -1.78,
    rockColor: "#0F172A",
    veinColor: "#D97706",
    veinMetalness: 0.9,
    veinRoughness: 0.18,
    radius: 2.1,
    height: 0.3,
  },
  {
    id: 4,
    depth: "-1500m",
    name: "High-Grade Auriferous Sulfide Core",
    y: -2.25,
    rockColor: "#080E18",
    veinColor: "#F59E0B",
    veinMetalness: 0.96,
    veinRoughness: 0.12,
    radius: 2.25,
    height: 0.34,
  },
];

export function GeologicalSpecimen() {
  const { viewport } = useThree();
  const rootGroupRef = useRef<THREE.Group>(null);
  const crystalClusterRef = useRef<THREE.Group>(null);
  const veinMaterialRefs = useRef<(THREE.MeshStandardMaterial | null)[]>([]);

  // Pre-configured cluster crystal rotations and scales for natural hydrothermal pegmatite growth
  const crystalOffsets = useMemo(
    () => [
      // Central principal prismatic crystal
      { pos: [0, 0.45, 0] as [number, number, number], rot: [0.1, 0.2, -0.05] as [number, number, number], scale: [1.1, 1.7, 1.1] as [number, number, number] },
      // Flanking satellite crystals
      { pos: [-0.62, 0.2, 0.35] as [number, number, number], rot: [-0.35, 0.4, 0.45] as [number, number, number], scale: [0.55, 1.15, 0.55] as [number, number, number] },
      { pos: [0.65, 0.15, -0.25] as [number, number, number], rot: [0.4, -0.3, -0.5] as [number, number, number], scale: [0.6, 1.25, 0.6] as [number, number, number] },
      { pos: [-0.15, 0.1, -0.65] as [number, number, number], rot: [-0.5, 0.8, -0.2] as [number, number, number], scale: [0.5, 1.05, 0.5] as [number, number, number] },
      { pos: [0.35, -0.05, 0.55] as [number, number, number], rot: [0.45, -0.6, 0.3] as [number, number, number], scale: [0.45, 0.95, 0.45] as [number, number, number] },
    ],
    []
  );

  useFrame((state, delta) => {
    const safeDelta = Math.min(delta, 0.1);

    if (rootGroupRef.current) {
      // Responsive positioning: center specimen on small mobile screens, right-offset on desktop
      const isMobile = viewport.width < 6;
      const targetSpecimenX = isMobile ? 0 : scrollBridge.specimenX;
      const targetSpecimenY = scrollBridge.specimenY + (isMobile ? -0.2 : 0);
      const targetSpecimenScale = scrollBridge.specimenScale * (isMobile ? 0.78 : 1.0);

      // Framerate-independent damping of group coordinates
      rootGroupRef.current.position.x = THREE.MathUtils.damp(
        rootGroupRef.current.position.x,
        targetSpecimenX,
        3.0,
        safeDelta
      );
      rootGroupRef.current.position.y = THREE.MathUtils.damp(
        rootGroupRef.current.position.y,
        targetSpecimenY,
        3.0,
        safeDelta
      );
      const currentScale = rootGroupRef.current.scale.x;
      const dampedScale = THREE.MathUtils.damp(
        currentScale,
        targetSpecimenScale,
        3.0,
        safeDelta
      );
      rootGroupRef.current.scale.setScalar(dampedScale);
    }

    // Subtle natural continuous rotation & harmonic buoyancy
    if (crystalClusterRef.current) {
      crystalClusterRef.current.rotation.y += safeDelta * 0.18;
      crystalClusterRef.current.position.y =
        Math.sin(state.clock.elapsedTime * 0.85) * 0.04;
    }

    // Dynamic horizon vein illumination based on active scroll stage
    veinMaterialRefs.current.forEach((mat, idx) => {
      if (!mat) return;
      const horizonNumber = idx + 1;
      const isActive = scrollBridge.activeHorizon === horizonNumber;
      const targetIntensity = isActive ? 1.6 : 0.25;
      mat.emissiveIntensity = THREE.MathUtils.damp(
        mat.emissiveIntensity,
        targetIntensity,
        4.0,
        safeDelta
      );
    });
  });

  return (
    <group ref={rootGroupRef} position={[1.8, 0, 0]}>
      {/* ══════════════════════════════════════════════════════════
          1. FACETED MINERAL CRYSTAL CLUSTER (PBR Physical Material)
          ══════════════════════════════════════════════════════════ */}
      <group ref={crystalClusterRef}>
        {crystalOffsets.map((crystal, i) => (
          <group key={i} position={crystal.pos} rotation={crystal.rot} scale={crystal.scale}>
            {/* Outer Faceted Crystal Prisms (Emerald/Cyan Transmission) */}
            <mesh castShadow receiveShadow>
              <icosahedronGeometry args={[0.7, 0]} />
              <meshPhysicalMaterial
                color="#10B981"
                emissive="#064E3B"
                emissiveIntensity={0.2}
                roughness={0.12}
                metalness={0.06}
                clearcoat={1.0}
                clearcoatRoughness={0.08}
                transmission={0.86}
                ior={1.54}
                thickness={1.6}
                attenuationColor="#06B6D4"
                attenuationDistance={1.3}
                transparent
                opacity={0.92}
                reflectivity={0.9}
              />
            </mesh>

            {/* Inner Refractive Core (High Specular / Prismatic Reflection) */}
            <mesh scale={[0.55, 0.65, 0.55]}>
              <octahedronGeometry args={[0.5, 0]} />
              <meshStandardMaterial
                color="#06B6D4"
                emissive="#0891B2"
                emissiveIntensity={0.35}
                roughness={0.2}
                metalness={0.6}
                transparent
                opacity={0.7}
              />
            </mesh>
          </group>
        ))}

        {/* Crystalline Apex Sparkle Accent */}
        <pointLight position={[0, 1.2, 0]} intensity={1.8} distance={3} color="#34D399" />
      </group>

      {/* ══════════════════════════════════════════════════════════
          2. STRATIFIED STRATA HORIZONS WITH METALLIC INCLUSIONS
          ══════════════════════════════════════════════════════════ */}
      <group position={[0, -0.1, 0]}>
        {HORIZONS.map((h, idx) => (
          <group key={h.id} position={[0, h.y, 0]}>
            {/* Strata Horizon Geological Slices */}
            <mesh receiveShadow>
              <cylinderGeometry args={[h.radius, h.radius * 1.04, h.height, 32]} />
              <meshStandardMaterial
                color={h.rockColor}
                roughness={0.85}
                metalness={0.2}
              />
            </mesh>

            {/* Metallic Inclusion Vein Ring (Gold, Copper, Quartz) */}
            <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[h.radius * 1.015, 0.032, 16, 48]} />
              <meshStandardMaterial
                ref={(el) => {
                  veinMaterialRefs.current[idx] = el;
                }}
                color={h.veinColor}
                emissive={h.veinColor}
                emissiveIntensity={0.25}
                metalness={h.veinMetalness}
                roughness={h.veinRoughness}
              />
            </mesh>
          </group>
        ))}
      </group>

      {/* ══════════════════════════════════════════════════════════
          3. AMBIENT DEPTH MINERAL PARTICLES (Drei Sparkles)
          ══════════════════════════════════════════════════════════ */}
      <Sparkles
        count={40}
        scale={[8, 6, 8]}
        size={1.8}
        speed={0.2}
        color="#10B981"
        opacity={0.35}
      />
    </group>
  );
}
