"use client";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

interface ModelProps {
  url: string;
  scale?: number;
}

const CustomModel = ({ url, scale = 1 }: ModelProps) => {
  const { scene } = useGLTF(url);
  const modelRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (modelRef.current) {
      modelRef.current.rotation.y += 0.002; // Slow rotation
    }
  });

  return <primitive ref={modelRef} object={scene} scale={scale} />;
};

export default CustomModel;
