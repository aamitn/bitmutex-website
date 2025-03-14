"use client";

import { useEffect, useState, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

// 3D Particle Shape Component
const ParticleShape = () => {
  const meshRef = useRef<THREE.Points>(null);
  const particles = useRef<THREE.BufferGeometry>(null);
  const [positions, setPositions] = useState<Float32Array>(generateShapePositions("sphere"));
  const [targetPositions, setTargetPositions] = useState<Float32Array>(generateShapePositions("cube"));
  
  // State to track the current theme
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // Detect color scheme (light/dark mode) on initial load
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setTheme(mediaQuery.matches ? 'dark' : 'light');
    
    // Listen for changes in color scheme
    const handleChange = (e: MediaQueryListEvent) => {
      setTheme(e.matches ? 'dark' : 'light');
    };

    mediaQuery.addEventListener('change', handleChange);

    // Cleanup the event listener
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Update particle color based on theme
  const particleColor = theme === 'dark' ? '#f71000' : '#1a73e8'; // Example: red for dark mode, blue for light mode
  
  useEffect(() => {
    if (particles.current) {
      particles.current.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    }
  }, [positions]);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.002; // Slight rotation for movement
    }

    // Smooth transition between positions
    const positionAttr = particles.current?.getAttribute("position");
    if (positionAttr) {
      for (let i = 0; i < positionAttr.array.length; i++) {
        positionAttr.array[i] += (targetPositions[i] - positionAttr.array[i]) * 0.05; // Interpolation
      }
      positionAttr.needsUpdate = true;
    }

    // Update particle color based on theme during every frame
    if (meshRef.current) {
      (meshRef.current.material as THREE.PointsMaterial).color.set(particleColor);
    }
  });

  // Toggle shape every 4 seconds
  useEffect(() => {
    const shapes = ["sphere", "cube", "laptop", "ethernet", "cylinder"] as const;
    const interval = setInterval(() => {
      const nextShape = shapes[Math.floor(Math.random() * shapes.length)];
      setTargetPositions(generateShapePositions(nextShape));
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <points ref={meshRef}>
      <bufferGeometry ref={particles} />
      <pointsMaterial size={0.5} transparent opacity={0.8} />
    </points>
  );
};

// Function to generate particle positions for different shapes
const generateShapePositions = (shape: "sphere" | "cube" | "laptop" | "ethernet" | "cylinder" | "cursor") => {  
  const count = 2200; // Particle count for more detail
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
  } else if (shape === "laptop") {
    for (let i = 0; i < count; i++) {
      const t = i / count;
      if (t < 0.5) {
        positions[i * 3] = (Math.random() - 0.5) * 8; // Random X position
        positions[i * 3 + 1] = -2; // Fixed Y position for the body (close to the bottom)
        positions[i * 3 + 2] = (Math.random() - 0.5) * 4; // Random Z position
      } else {
        positions[i * 3] = (Math.random() - 0.5) * 4; // Random X position (screen narrower)
        positions[i * 3 + 1] = 2; // Fixed Y position for the screen (upward)
        positions[i * 3 + 2] = (Math.random() - 0.5) * 2; // Random Z position
      }
    }
  }else if (shape === "cylinder") {
    const radius = 5;  // Radius of the cylinder
    const height = 6;  // Height of the cylinder
    const count = 2200;  // Particle count for more detail
  
    // Iterate over each particle
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2; // Uniform distribution of particles along the circumference
      const yPos = Math.random() * height - height / 2; // Randomly spread along the height of the cylinder
  
      // Calculate X and Z positions based on angle and radius (circular pattern)
      positions[i * 3] = Math.cos(angle) * radius;  // X position: distribute along a circular perimeter
      positions[i * 3 + 1] = yPos;  // Y position (height): random distribution along the height
      positions[i * 3 + 2] = Math.sin(angle) * radius;  // Z position: distribute along a circular perimeter
    }
  }  
 else if (shape === "ethernet") {
    const radius = 6;  // Increased radius to make the cylinder look more like a database cylinder
    const height = 10;  // Increased height to make the cylinder taller

    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      
      // Adjust positions for a more "database-style" look (wider, taller, and disk-like)
      positions[i * 3] = Math.cos(angle) * radius;  // Controls the X position based on the radius
      positions[i * 3 + 1] = (i / count) * height - (height / 2);  // Controls the Y position (height of the cylinder)
      positions[i * 3 + 2] = Math.sin(angle) * radius;  // Controls the Z position based on the radius
    }
  }



  return positions;
};

export default ParticleShape;
