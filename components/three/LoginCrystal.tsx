"use client";

import { useRef, useEffect } from "react";
import * as THREE from "three";

export default function LoginCrystal() {
  const mountRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const frameRef = useRef<number>(0);

  useEffect(() => {
    if (!mountRef.current) return;

    const container = mountRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0b1929);
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 100);
    camera.position.z = 5;
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Crystal geometry
    const crystalGeometry = new THREE.IcosahedronGeometry(1.5, 1);

    // Solid mesh
    const solidMaterial = new THREE.MeshPhongMaterial({
      color: 0x1e4d8c,
      emissive: 0x0b1929,
      shininess: 100,
      opacity: 0.85,
      transparent: true,
    });
    const solidMesh = new THREE.Mesh(crystalGeometry, solidMaterial);
    scene.add(solidMesh);

    // Wireframe mesh
    const wireMaterial = new THREE.MeshBasicMaterial({
      color: 0xc9a84c,
      wireframe: true,
      opacity: 0.3,
      transparent: true,
    });
    const wireMesh = new THREE.Mesh(crystalGeometry, wireMaterial);
    scene.add(wireMesh);

    // Lights
    const ambientLight = new THREE.AmbientLight(0x112240, 0.5);
    scene.add(ambientLight);

    const goldLight = new THREE.PointLight(0xc9a84c, 2, 10);
    scene.add(goldLight);

    const blueLight = new THREE.PointLight(0x2e6db4, 1.5, 8);
    scene.add(blueLight);

    // Particles
    const particleCount = 200;
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 16;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 16;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const particleMaterial = new THREE.PointsMaterial({
      color: 0xc9a84c,
      size: 0.05,
      transparent: true,
      opacity: 0.6,
    });
    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    // Grid
    const grid = new THREE.GridHelper(20, 20, 0x1e4d8c, 0x112240);
    grid.position.y = -3;
    grid.rotation.x = 0.1;
    (grid.material as THREE.Material).opacity = 0.08;
    (grid.material as THREE.Material).transparent = true;
    scene.add(grid);

    // Animation
    const clock = new THREE.Clock();

    function animate() {
      frameRef.current = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      solidMesh.rotation.y += 0.003;
      solidMesh.rotation.x += 0.001;
      wireMesh.rotation.y += 0.003;
      wireMesh.rotation.x += 0.001;

      goldLight.position.x = Math.sin(elapsed * 0.5) * 3;
      goldLight.position.z = Math.cos(elapsed * 0.5) * 3;
      goldLight.position.y = Math.sin(elapsed * 0.3) * 1;

      blueLight.position.x = Math.sin(elapsed * 0.3 + Math.PI) * 4;
      blueLight.position.z = Math.cos(elapsed * 0.3 + Math.PI) * 4;
      blueLight.position.y = Math.cos(elapsed * 0.5) * 1;

      particles.rotation.y += 0.0005;

      renderer.render(scene, camera);
    }

    animate();

    // Resize
    function handleResize() {
      if (!container || !camera || !renderer) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    }
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(frameRef.current);
      crystalGeometry.dispose();
      solidMaterial.dispose();
      wireMaterial.dispose();
      particleGeometry.dispose();
      particleMaterial.dispose();
      (grid.material as THREE.Material).dispose();
      grid.geometry.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={mountRef} className="absolute inset-0 w-full h-full" />;
}
