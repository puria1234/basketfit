"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

function MiniBasketball() {
  const group = useRef<THREE.Group>(null!);

  useFrame((_, dt) => {
    group.current.rotation.y += dt * 1.1;
  });

  const texture = useMemo(() => {
    const w = 256, h = 128;
    const canvas = document.createElement("canvas");
    canvas.width = w; canvas.height = h;
    const ctx = canvas.getContext("2d")!;

    const bg = ctx.createRadialGradient(w * 0.38, h * 0.3, 0, w * 0.5, h * 0.5, w * 0.56);
    bg.addColorStop(0, "#FFAE4A");
    bg.addColorStop(0.28, "#E85C00");
    bg.addColorStop(0.62, "#BF3F00");
    bg.addColorStop(1, "#5C1600");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);

    ctx.strokeStyle = "#1A0500";
    ctx.lineWidth = 6;
    ctx.lineCap = "round";

    ctx.beginPath(); ctx.moveTo(0, h / 2); ctx.lineTo(w, h / 2); ctx.stroke();
    for (const x of [0, w / 2, w]) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
    }
    ctx.beginPath();
    ctx.moveTo(0, h / 2);
    ctx.bezierCurveTo(w * .14, h * .18, w * .36, h * .18, w * .5, h / 2);
    ctx.bezierCurveTo(w * .64, h * .82, w * .86, h * .82, w, h / 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, h / 2);
    ctx.bezierCurveTo(w * .14, h * .82, w * .36, h * .82, w * .5, h / 2);
    ctx.bezierCurveTo(w * .64, h * .18, w * .86, h * .18, w, h / 2);
    ctx.stroke();

    return new THREE.CanvasTexture(canvas);
  }, []);

  return (
    <group ref={group} rotation={[0.3, 0, 0]}>
      <mesh>
        <sphereGeometry args={[0.88, 32, 32]} />
        <meshStandardMaterial map={texture} roughness={0.4} metalness={0.02} />
      </mesh>
    </group>
  );
}

export default function Logo3D({ size = 32 }: { size?: number }) {
  return (
    <div style={{ width: size, height: size, flexShrink: 0 }}>
      <Canvas
        camera={{ position: [0, 0, 2.8], fov: 42 }}
        style={{ width: size, height: size }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.55} />
        <pointLight position={[3, 4, 3]} intensity={2.8} color="#ffffff" />
        <pointLight position={[-2, -1, 2]} intensity={0.9} color="#40E0FF" />
        <MiniBasketball />
      </Canvas>
    </div>
  );
}
