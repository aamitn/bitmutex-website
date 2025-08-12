'use client';

import React, { Suspense, useRef, ReactNode } from 'react';
import { Canvas } from '@react-three/fiber';
import { useGLTF, OrbitControls, Environment, Html } from '@react-three/drei';
import * as THREE from 'three';
import { Vector3 } from 'three';

// Custom loading component for when the model is being fetched
const Loader = () => {
  return (
    // Using Html from drei to correctly position the loader within the 3D scene
    <Html center>
      <div className="text-gray-500 text-lg">
        Loading 3D Model...
      </div>
    </Html>
  );
};

// Define the props interface to make the component type-safe
interface ModelViewerProps {
  modelPath: string;
  cameraPosition?: [number, number, number];
  ambientIntensity?: number;
  directionalIntensity?: number;
  lightPosition?: [number, number, number];
  scale?: number;
  rotation?: [number, number, number];
  enableZoom?: boolean;
  enablePan?: boolean;
  enableRotate?: boolean;
  showEnvironment?: boolean;
  shadows?: boolean;
  children?: ReactNode;
}

// Main reusable component to display a GLB model
// Props allow for extensive customization of the scene
const ModelViewer = ({
  modelPath,
  cameraPosition = [0, 0, 5],
  ambientIntensity = 0.5,
  directionalIntensity = 0.8,
  lightPosition = [10, 10, 10],
  scale = 1,
  rotation = [0, 0, 0],
  enableZoom = true,
  enablePan = true,
  enableRotate = true,
  showEnvironment = true,
  shadows = true,
  children,
  ...canvasProps
}: ModelViewerProps) => {
  // Use useGLTF hook to load the glb model. This hook returns a GLTF object.
  // We destructure it to get the scene property.
  const { scene } = useGLTF(modelPath) as any;

  // Set initial rotation for the model
  const modelRef = useRef(null);

  return (
    <Canvas
      className="w-full h-full"
      camera={{ position: cameraPosition as unknown as Vector3 }}
      shadows={shadows}
      {...canvasProps}
    >
      {/* Suspense handles the loading state of the model */}
      <Suspense fallback={<Loader />}>
        {/* Set up the scene lighting */}
        <ambientLight intensity={ambientIntensity} />
        <directionalLight
          position={lightPosition as unknown as Vector3}
          intensity={directionalIntensity}
          castShadow
        />

        {/* Use OrbitControls for camera interaction (pan, zoom, rotate) */}
        <OrbitControls
          enableZoom={enableZoom}
          enablePan={enablePan}
          enableRotate={enableRotate}
        />

        {/* Environment component for realistic backgrounds and reflections */}
        {showEnvironment && <Environment preset="city" />}

        {/* Render the loaded 3D model */}
        {/* The primitive component is used to display a raw Three.js object */}
        <primitive
          ref={modelRef}
          object={scene}
          scale={scale}
          rotation={rotation}
        />

        {/* Render any children passed into the component (e.g., extra lights, etc.) */}
        {children}
      </Suspense>
    </Canvas>
  );
};

export default ModelViewer;
