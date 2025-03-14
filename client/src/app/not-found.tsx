"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { XCircle } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function NotFoundPage() {
  const leftEyeRef = useRef<HTMLCanvasElement>(null);
  const rightEyeRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const setupEye = (canvas: HTMLCanvasElement | null) => {
      if (!canvas) return;

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
      const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });

      renderer.setSize(80, 80);
      camera.position.z = 3;

      const eye = new THREE.Mesh(
        new THREE.SphereGeometry(1, 32, 32),
        new THREE.MeshStandardMaterial({ color: "#ffffff", emissive: "#ffffff" })
      );
      scene.add(eye);

      const pupil = new THREE.Mesh(
        new THREE.SphereGeometry(0.3, 32, 32),
        new THREE.MeshStandardMaterial({ color: "#000000" })
      );
      pupil.position.z = 0.8;
      eye.add(pupil);

      const light = new THREE.PointLight(0xffffff, 2);
      light.position.set(2, 2, 2);
      scene.add(light);

      let targetX = 0, targetY = 0;
      let currentX = 0, currentY = 0;

      function animate() {
        requestAnimationFrame(animate);

        // Lerp for smooth movement
        currentX += (targetX - currentX) * 0.2;
        currentY += (targetY - currentY) * 0.2;

        pupil.position.x = currentX;
        pupil.position.y = currentY;

        renderer.render(scene, camera);
      }

      animate();

      window.addEventListener("mousemove", (event) => {
        targetX = (event.clientX / window.innerWidth - 0.5) * 0.5;
        targetY = (event.clientY / window.innerHeight - 0.5) * -0.5;
      });
    };

    setupEye(leftEyeRef.current);
    setupEye(rightEyeRef.current);
  }, []);

  return (
    <div className="mt-4 mb-4 flex items-center justify-center min-h-screen bg-gradient-to-r from-white to-gray-300 dark:from-gray-900 dark:to-gray-800 transition-all">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <Card className="relative w-full max-w-md p-8 space-y-6 text-center shadow-lg backdrop-blur-lg bg-white/10 dark:bg-black/10 border border-white/20 rounded-2xl">
          {/* Eyes */}
          <motion.div
            className="absolute -top-10 left-1/2 transform -translate-x-[60px] flex gap-5"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, ease: "backOut" }}
          >
            <canvas ref={leftEyeRef} className="w-20 h-20"></canvas>
            <canvas ref={rightEyeRef} className="w-20 h-20"></canvas>
          </motion.div>

          {/* 404 Icon */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.3 }}
            className="flex justify-center pt-8"
          >
            <XCircle className="w-16 h-16 text-red-500 dark:text-red-400" />
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="text-3xl font-bold text-gray-800 dark:text-gray-200"
          >
            404 - Page Not Found
          </motion.h1>

          {/* Message */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="text-gray-800 dark:text-gray-200"
          >
            Oops! The page you're looking for doesn't exist.
          </motion.p>

          {/* Button */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.9 }}
            className="pt-4"
          >
            <Button asChild className="bg-blue-500 hover:bg-blue-600 text-white dark:bg-blue-600 dark:hover:bg-blue-700 rounded-lg">
              <Link href="/">Return Home</Link>
            </Button>
          </motion.div>
        </Card>
      </motion.div>
    </div>
  );
}
