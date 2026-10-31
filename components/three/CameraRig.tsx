"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { scrollBridge } from "./scrollBridge";

export function CameraRig() {
  const lookTarget = useRef(new THREE.Vector3(0, 0, 0));

  useFrame((state, delta) => {
    // Clamp delta to prevent erratic jumps on lag spikes
    const safeDelta = Math.min(delta, 0.1);

    // Responsive distance adjustment: pull back slightly on narrower screens (mobile/tablet)
    const distanceModifier =
      state.viewport.width < 5 ? 1.35 : state.viewport.width < 8 ? 1.15 : 1.0;
    const r = scrollBridge.radius * distanceModifier;
    const el = scrollBridge.elevation;
    const az = scrollBridge.azimuth;

    // Spherical coordinate mapping
    const targetX = r * Math.cos(el) * Math.sin(az);
    const targetY = r * Math.sin(el) + scrollBridge.targetY;
    const targetZ = r * Math.cos(el) * Math.cos(az);

    // Framerate-independent exponential damping
    state.camera.position.x = THREE.MathUtils.damp(
      state.camera.position.x,
      targetX,
      3.5,
      safeDelta
    );
    state.camera.position.y = THREE.MathUtils.damp(
      state.camera.position.y,
      targetY,
      3.5,
      safeDelta
    );
    state.camera.position.z = THREE.MathUtils.damp(
      state.camera.position.z,
      targetZ,
      3.5,
      safeDelta
    );

    // Smoothly update lookAt orientation
    lookTarget.current.y = THREE.MathUtils.damp(
      lookTarget.current.y,
      scrollBridge.targetY,
      3.5,
      safeDelta
    );
    state.camera.lookAt(lookTarget.current);
  });

  return null;
}
