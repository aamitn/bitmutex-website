"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useTheme } from "next-themes";

// 🚀 Bitmutex-Themed Predefined Color Gradients for modern UI
// These gradients are carefully chosen for a high-tech, professional look.
const lightModeColors = [
  new THREE.Color(0x0096FF), // Bright Sky Blue
  new THREE.Color(0x002147), // Rich Navy Blue (for contrast)
  new THREE.Color(0xFF7300), // Vibrant Orange
];

const darkModeColors = [
  new THREE.Color(0x00FFFF), // Cyan-Aqua (for an energetic feel)
  new THREE.Color(0xFF4500), // Fiery Orange (a striking accent)
  new THREE.Color(0x2A0944), // Deep Purple-Black (for depth and mystery)
];

// Define a few new, more visually interesting shapes
const shapes = ["sphere", "cube", "torus", "helix", "vortex"];
const PARTICLE_COUNT = 3000;

// Particle Shape Component
const ParticleShape = () => {
  // We use a group to apply the rotation to the entire particle system
  const groupRef = useRef<THREE.Group>(null);
  const particles = useRef<THREE.BufferGeometry>(null);
  const { theme } = useTheme(); // Detects light/dark mode

  // Memoize initial positions and colors to calculate them only once or on theme change
  const { initialPositions, colors } = useMemo(() => {
    const initial = generateShapePositions("sphere", PARTICLE_COUNT);
    const initialColors = generateGradientColors(initial, theme, lightModeColors, darkModeColors);
    
    return {
      initialPositions: initial,
      colors: initialColors,
    };
  }, [theme]);

  // Use state for the target positions, so changes trigger a re-render
  const [targetPositions, setTargetPositions] = useState<Float32Array>(generateShapePositions("cube", PARTICLE_COUNT));
  const positionsRef = useRef<Float32Array>(initialPositions);

  // State to hold the current target for transitions
  const [currentShapeIndex, setCurrentShapeIndex] = useState(0);

  // Set up geometry attributes on initial load and theme change
  useEffect(() => {
    if (particles.current) {
      // Set initial geometry positions and colors
      particles.current.setAttribute("position", new THREE.BufferAttribute(positionsRef.current, 3));
      particles.current.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    }
  }, [colors]);

  // Animate the rotation and particle transitions
  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.001; // Slower, more subtle rotation
      groupRef.current.rotation.x += 0.0005;
    }

    const positionAttr = particles.current?.getAttribute("position");
    if (positionAttr) {
      // Smoother, more elegant transition using a smaller lerp factor
      for (let i = 0; i < positionAttr.array.length; i++) {
        (positionAttr.array as Float32Array)[i] += (targetPositions[i] - (positionAttr.array as Float32Array)[i]) * 0.02;
      }
      positionAttr.needsUpdate = true;
    }
  });

  // Cycle through shapes with a dynamic transition effect
  useEffect(() => {
    const interval = setInterval(() => {
      // 1. Scatter effect: Burst out before reforming
      setTargetPositions(generateScatterEffect(PARTICLE_COUNT));

      setTimeout(() => {
        // 2. Select next shape and transition
        const nextIndex = (currentShapeIndex + 1) % shapes.length;
        setTargetPositions(generateShapePositions(shapes[nextIndex] as any, PARTICLE_COUNT));
        setCurrentShapeIndex(nextIndex);
      }, 1000);
    }, 5000); // Wait 5 seconds before the next transition

    return () => clearInterval(interval);
  }, [currentShapeIndex]); // The dependency array is now correct

  return (
    <group ref={groupRef}>
      <points>
        <bufferGeometry attach="geometry" ref={particles} />
        {/*
          Modern material for a professional, glowing effect:
          - `sizeAttenuation`: Ensures particles look the same size regardless of distance.
          - `blending`: Additive blending creates a light, glowing, and overlapping effect.
          - `depthWrite`: Disabling this prevents particles from occluding each other, enhancing the glow.
          - `size`: Smaller size for a more sophisticated, high-density feel.
        */}
        <pointsMaterial 
          attach="material"
          size={0.25} 
          transparent 
          opacity={0.8} 
          vertexColors 
          sizeAttenuation={true}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
    </group>
  );
};


// 🌟 Generate Colors Based on Predefined Gradient & Theme
const generateGradientColors = (positions: Float32Array, theme: string | undefined, lightColors: THREE.Color[], darkColors: THREE.Color[]) => {
  const colors = new Float32Array(positions.length);
  const gradientColors = theme === "dark" ? darkColors : lightColors;

  if (gradientColors.length === 0) {
    console.error("No colors defined for theme:", theme);
    return colors;
  }

  const steps = gradientColors.length - 1;

  for (let i = 0; i < positions.length; i += 3) {
    const t = (positions[i] + 5) / 10;
    let index = Math.floor(t * steps);
    let nextIndex = index + 1;

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
const generateShapePositions = (shape: string, count: number): Float32Array => {
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
  } else if (shape === "torus") {
    const mainRadius = 4;
    const tubeRadius = 1;
    for (let i = 0; i < count; i++) {
      const u = (i / count) * Math.PI * 2;
      const v = (Math.random() - 0.5) * Math.PI * 2;
      positions[i * 3] = (mainRadius + tubeRadius * Math.cos(v)) * Math.cos(u);
      positions[i * 3 + 1] = (mainRadius + tubeRadius * Math.cos(v)) * Math.sin(u);
      positions[i * 3 + 2] = tubeRadius * Math.sin(v);
    }
  } else if (shape === "helix") {
    const radius = 3;
    const height = 10;
    for (let i = 0; i < count; i++) {
      const t = (i / count) * Math.PI * 8;
      positions[i * 3] = radius * Math.cos(t);
      positions[i * 3 + 1] = (i / count - 0.5) * height;
      positions[i * 3 + 2] = radius * Math.sin(t);
    }
  } else if (shape === "vortex") {
    const radius = 0.5;
    const height = 10;
    for (let i = 0; i < count; i++) {
      const t = (i / count) * Math.PI * 10;
      const r = (i / count) * radius * height;
      positions[i * 3] = r * Math.cos(t);
      positions[i * 3 + 1] = (i / count - 0.5) * height;
      positions[i * 3 + 2] = r * Math.sin(t);
    }
  } else {
    // Default to sphere if shape is unknown
    return generateShapePositions("sphere", count);
  }

  return positions;
};


// 💥 Scatter Effect (Particles Move Out Before Reforming)
const generateScatterEffect = (count: number) => {
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 20;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
  }
  return positions;
};

export default ParticleShape;
