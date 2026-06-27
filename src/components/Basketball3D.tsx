"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

function BasketballMesh() {
  const group = useRef<THREE.Group>(null!);

  useFrame((_, dt) => {
    group.current.rotation.y += dt * 0.55;
  });

  const texture = useMemo(() => {
    const size = 1024;
    const half = size / 2;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = half;
    const ctx = canvas.getContext("2d")!;

    // Silver-to-white radial gradient base
    const bg = ctx.createRadialGradient(size * 0.4, half * 0.35, 0, size * 0.5, half * 0.5, size * 0.55);
    bg.addColorStop(0, "#ffffff");
    bg.addColorStop(0.5, "#d0d0d0");
    bg.addColorStop(1, "#888888");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, size, half);

    // Seam lines
    ctx.strokeStyle = "#111111";
    ctx.lineWidth = 11;
    ctx.lineCap = "round";

    // Equator
    ctx.beginPath();
    ctx.moveTo(0, half / 2);
    ctx.lineTo(size, half / 2);
    ctx.stroke();

    // Vertical seam (two edges that meet when wrapped)
    for (const x of [0, size / 2, size]) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, half);
      ctx.stroke();
    }

    // S-curve top
    ctx.beginPath();
    ctx.moveTo(0, half / 2);
    ctx.bezierCurveTo(size * 0.14, half * 0.18, size * 0.36, half * 0.18, size * 0.5, half / 2);
    ctx.bezierCurveTo(size * 0.64, half * 0.82, size * 0.86, half * 0.82, size, half / 2);
    ctx.stroke();

    // S-curve bottom (mirror)
    ctx.beginPath();
    ctx.moveTo(0, half / 2);
    ctx.bezierCurveTo(size * 0.14, half * 0.82, size * 0.36, half * 0.82, size * 0.5, half / 2);
    ctx.bezierCurveTo(size * 0.64, half * 0.18, size * 0.86, half * 0.18, size, half / 2);
    ctx.stroke();

    const tex = new THREE.CanvasTexture(canvas);
    return tex;
  }, []);

  return (
    <group ref={group} rotation={[0.25, 0, 0]}>
      <mesh>
        <sphereGeometry args={[1.6, 64, 64]} />
        <meshStandardMaterial map={texture} roughness={0.25} metalness={0.08} />
      </mesh>
    </group>
  );
}

export default function Basketball3D() {
  return (
    <div style={{ width: "100%", height: 340 }}>
      <Canvas camera={{ position: [0, 0, 4.5], fov: 45 }}>
        <ambientLight intensity={0.6} />
        <pointLight position={[4, 4, 4]} intensity={2.5} color="#ffffff" />
        <pointLight position={[-3, -2, 3]} intensity={0.8} color="#ccccff" />
        <pointLight position={[0, -4, 1]} intensity={0.4} color="#ffffff" />
        <BasketballMesh />
      </Canvas>
    </div>
  );
}
