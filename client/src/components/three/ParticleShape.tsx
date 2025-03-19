"use client";

import { useEffect, useState, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useTheme } from "next-themes";

// 🚀 Bitmutex-Themed Predefined Color Gradients
const lightModeColors = [
  new THREE.Color(0x002147), // Rich Navy Blue (Darker, for depth)
  new THREE.Color(0x0502CF), // Rich Blue (More contrast)
  new THREE.Color(0xFF7300), // Bright Orange
];

const darkModeColors = [
  new THREE.Color(0x0096FF), // Electric Blue
  new THREE.Color(0xFF4500), // Fiery Orange
  new THREE.Color(0x001F3F), // Deep Midnight Blue
];

// Particle Shape Component
const ParticleShape = () => {
  const meshRef = useRef<THREE.Points>(null);
  const particles = useRef<THREE.BufferGeometry>(null);
  const { theme } = useTheme(); // Detects light/dark mode
  const [positions, setPositions] = useState<Float32Array>(generateShapePositions("sphere"));
  const [targetPositions, setTargetPositions] = useState<Float32Array>(generateShapePositions("cube"));

  useEffect(() => {
    if (particles.current) {
      particles.current.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      particles.current.setAttribute("color", new THREE.BufferAttribute(generateGradientColors(positions, theme), 3));
    }
  }, [positions, theme]); // Recalculate colors on theme change

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.002; // Smooth rotation
    }

    const positionAttr = particles.current?.getAttribute("position");
    if (positionAttr) {
      for (let i = 0; i < positionAttr.array.length; i++) {
        positionAttr.array[i] += (targetPositions[i] - positionAttr.array[i]) * 0.05;
      }
      positionAttr.needsUpdate = true;
    }
  });

  useEffect(() => {
    const shapes = ["sphere", "cube", "cylinder", "torus", "wave","infinity", "lambda"];
    const interval = setInterval(() => {
      const nextShape = shapes[Math.floor(Math.random() * shapes.length)] as any;
      
      // Burst effect: Scatter before reshaping
      setTargetPositions(generateScatterEffect());
      
      setTimeout(() => {
        setTargetPositions(generateShapePositions(nextShape));
      }, 1000);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <points ref={meshRef}>
      <bufferGeometry ref={particles} />
      <pointsMaterial size={0.5} transparent opacity={0.8} vertexColors />
    </points>
  );
};

// 🌟 Generate Colors Based on Predefined Gradient & Theme
const generateGradientColors = (positions: Float32Array, theme: string | undefined) => {
  const colors = new Float32Array(positions.length);
  const gradientColors = theme === "dark" ? darkModeColors : lightModeColors;

  // Ensure gradientColors array has at least one color to prevent undefined access
  if (gradientColors.length === 0) {
    console.error("No colors defined for theme:", theme);
    return colors; // Return an empty color array
  }

  const steps = gradientColors.length - 1;

  for (let i = 0; i < positions.length; i += 3) {
    const t = (positions[i] + 5) / 10; // Normalize position to [0,1]
    let index = Math.floor(t * steps);
    let nextIndex = index + 1;

    // 🔥 Clamp indices to avoid out-of-bounds errors
    index = Math.max(0, Math.min(index, steps));
    nextIndex = Math.max(0, Math.min(nextIndex, steps));

    const mixFactor = t * steps - index;
    const color = gradientColors[index].clone().lerp(gradientColors[nextIndex], mixFactor);

    colors[i] = color.r;
    colors[i + 1] = color.g;
    colors[i + 2] = color.b;
  }

  return colors;
};


// ✨ Generate Particle Positions for Different Shapes
const generateShapePositions = (shape: "sphere" | "cube" | "cylinder" | "torus"  | "wave" | "infinity" | "lambda") => {  
  const count = 2200;
  const positions = new Float32Array(count * 3);

  if (shape === "sphere") {
    for (let i = 0; i < count; i++) {
      const phi = Math.acos(-1 + (2 * i) / count);
      const theta = Math.sqrt(count * Math.PI) * phi;
      positions[i * 3] = Math.sin(phi) * Math.cos(theta) * 4;
      positions[i * 3 + 1] = Math.sin(phi) * Math.sin(theta) * 4;
      positions[i * 3 + 2] = Math.cos(phi) * 4;
    }
  } else if (shape === "cube") {
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 8;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 8;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 8;
    }
  } else if (shape === "cylinder") {
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      positions[i * 3] = Math.cos(angle) * 5;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 2] = Math.sin(angle) * 5;
    }
  } else if (shape === "torus") {
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const radius = 4 + Math.sin(angle * 5) * 1.5;
      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = Math.sin(angle * 5) * 2;
      positions[i * 3 + 2] = Math.sin(angle) * radius;
    }
  }  else if (shape === "wave") {
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 8;
      positions[i * 3 + 1] = Math.sin(positions[i * 3] * 2) * 2;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 8;
    }
  }

  else if (shape === "infinity") {
    const a = 5; // Size of the infinity shape
    for (let i = 0; i < count; i++) {
      const t = (i / count) * Math.PI * 2 * 4; // Spread particles along the curve
  
      positions[i * 3] = a * (Math.cos(t) / (1 + Math.sin(t) ** 2)); // X-axis (horizontal loop)
      positions[i * 3 + 1] = a * (Math.cos(t) * Math.sin(t) / (1 + Math.sin(t) ** 2)); // Y-axis (vertical variation)
      positions[i * 3 + 2] = (Math.random() - 0.5) * 1.5; // Slight depth variation for 3D effect
    }
  }

  else if (shape === "lambda") {
    const height = 6; // Height of the lambda symbol
    const width = 4; // Spacing between diagonal strokes
    const midPoint = Math.floor(count * 0.5); // Middle point to divide two strokes
  
    for (let i = 0; i < count; i++) {
      const t = i / count;
  
      if (i < midPoint) {
        // Left diagonal stroke: Moves from bottom left to top middle
        positions[i * 3] = -width / 2 + t * (width / 2); // X moves right
        positions[i * 3 + 1] = -height / 2 + t * height; // Y moves up
        positions[i * 3 + 2] = (Math.random() - 0.5) * 1; // Small Z variation for 3D effect
      } else {
        // Right diagonal stroke: Moves from bottom right to top middle
        const ti = (i - midPoint) / midPoint; // Normalize second half
        positions[i * 3] = width / 2 - ti * (width / 2); // X moves left
        positions[i * 3 + 1] = -height / 2 + ti * height; // Y moves up
        positions[i * 3 + 2] = (Math.random() - 0.5) * 1; // Small Z variation
      }
    }
  }

  return positions;
};

// 💥 Scatter Effect (Particles Move Out Before Reforming)
const generateScatterEffect = () => {
  const count = 2200;
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 20;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
  }
  return positions;
};

export default ParticleShape;
