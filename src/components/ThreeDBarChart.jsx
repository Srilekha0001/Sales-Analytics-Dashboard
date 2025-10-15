
import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Html, Stars } from "@react-three/drei";

function Bar({ height, color, index, label }) {
  const mesh = useRef();
  useFrame(() => (mesh.current.rotation.y += 0.002));
  return (
    <group position={[index * 1.5 - 4, height / 2, 0]}>
      <mesh ref={mesh} scale={[1, height, 1]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color={color} metalness={0.4} roughness={0.2} />
      </mesh>
      <Html center distanceFactor={12}>
        <div style={{ color: "#fff", fontSize: "0.8rem", textAlign: "center" }}>{label}</div>
      </Html>
    </group>
  );
}

export default function ThreeDBarChart({ data }) {
  const colors = ["#38bdf8", "#818cf8", "#22d3ee", "#a855f7", "#34d399"];
  const max = Math.max(...data.sales_values);
  const scale = (v) => (v / max) * 6;

  return (
    <div style={{
      height: "400px",
      borderRadius: "20px",
      overflow: "hidden",
      boxShadow: "0 0 25px rgba(56,189,248,0.3)",
    }}>
      <Canvas camera={{ position: [0, 4, 10], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[5, 10, 5]} intensity={1.2} />
        <Stars radius={100} depth={50} count={5000} factor={4} fade />
        {data.months.map((m, i) => (
          <Bar key={m} index={i} height={scale(data.sales_values[i])}
               color={colors[i % colors.length]} label={m} />
        ))}
        <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.8} />
      </Canvas>
    </div>
  );
}
