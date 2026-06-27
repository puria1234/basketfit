"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { BallSize } from "@/lib/types";

// Circumference-accurate scale relative to size 7 (29.5"), exaggerated for visual clarity
const SIZE_SCALE: Record<BallSize, number> = {
  7: 1.0,
  6: 0.86,
  5: 0.72,
  3: 0.54,
};

function BasketballMesh({ size }: { size: BallSize }) {
  const group = useRef<THREE.Group>(null!);
  const currentScale = useRef(SIZE_SCALE[size]);

  useFrame((_, dt) => {
    group.current.rotation.y += dt * 0.55;
    // Smooth scale lerp when size changes
    const target = SIZE_SCALE[size];
    currentScale.current += (target - currentScale.current) * Math.min(1, dt * 4);
    group.current.scale.setScalar(currentScale.current);
  });

  const texture = useMemo(() => {
    const w = 1024;
    const h = 512;
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d")!;

    const bg = ctx.createRadialGradient(w * 0.4, h * 0.35, 0, w * 0.5, h * 0.5, w * 0.55);
    bg.addColorStop(0, "#ffffff");
    bg.addColorStop(0.5, "#d0d0d0");
    bg.addColorStop(1, "#888888");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);

    ctx.strokeStyle = "#111111";
    ctx.lineWidth = 11;
    ctx.lineCap = "round";

    // Equator
    ctx.beginPath();
    ctx.moveTo(0, h / 2);
    ctx.lineTo(w, h / 2);
    ctx.stroke();

    // Vertical seam
    for (const x of [0, w / 2, w]) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }

    // S-curves
    ctx.beginPath();
    ctx.moveTo(0, h / 2);
    ctx.bezierCurveTo(w * 0.14, h * 0.18, w * 0.36, h * 0.18, w * 0.5, h / 2);
    ctx.bezierCurveTo(w * 0.64, h * 0.82, w * 0.86, h * 0.82, w, h / 2);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, h / 2);
    ctx.bezierCurveTo(w * 0.14, h * 0.82, w * 0.36, h * 0.82, w * 0.5, h / 2);
    ctx.bezierCurveTo(w * 0.64, h * 0.18, w * 0.86, h * 0.18, w, h / 2);
    ctx.stroke();

    return new THREE.CanvasTexture(canvas);
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

export default function Basketball3D({ size = 7 }: { size?: BallSize }) {
  return (
    <div style={{ width: "100%", height: 340 }}>
      <Canvas camera={{ position: [0, 0, 4.5], fov: 45 }}>
        <ambientLight intensity={0.6} />
        <pointLight position={[4, 4, 4]} intensity={2.5} color="#ffffff" />
        <pointLight position={[-3, -2, 3]} intensity={0.8} color="#ccccff" />
        <pointLight position={[0, -4, 1]} intensity={0.4} color="#ffffff" />
        <BasketballMesh size={size} />
      </Canvas>
    </div>
  );
}
