"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home, Search, RefreshCw } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import dynamic from 'next/dynamic';
const DynamicLottiePlayer = dynamic(
  () => import('@/components/custom/LottiePlayer').then(mod => mod.LottiePlayer),
  { ssr: false } // This is the key part!
);

export default function NotFoundPage() {
  const sceneRef = useRef<HTMLCanvasElement>(null);
  const leftEyeRef = useRef<HTMLCanvasElement>(null);
  const rightEyeRef = useRef<HTMLCanvasElement>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Setup eye tracking
    const setupEye = (canvas: HTMLCanvasElement | null) => {
      if (!canvas) return;

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
      const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });

      renderer.setSize(100, 100);
      renderer.setClearColor(0x000000, 0);
      camera.position.z = 3;

      const eye = new THREE.Mesh(
        new THREE.SphereGeometry(1, 32, 32),
        new THREE.MeshStandardMaterial({ 
          color: "#f8fafc", 
          emissive: "#3b82f6",
          emissiveIntensity: 0.1,
          roughness: 0.1,
          metalness: 0.1
        })
      );
      scene.add(eye);

      const pupil = new THREE.Mesh(
        new THREE.SphereGeometry(0.35, 32, 32),
        new THREE.MeshStandardMaterial({ 
          color: "#0f172a",
          emissive: "#000000",
          emissiveIntensity: 0.05
        })
      );
      pupil.position.z = 0.8;
      eye.add(pupil);

      // Add iris detail
      const iris = new THREE.Mesh(
        new THREE.SphereGeometry(0.5, 32, 32),
        new THREE.MeshStandardMaterial({ 
          color: "#f59e0b",
          transparent: true,
          opacity: 0.7,
          emissive: "#d97706",
          emissiveIntensity: 0.2
        })
      );
      iris.position.z = 0.6;
      eye.add(iris);

      const ambientLight = new THREE.AmbientLight(0x404040, 0.8);
      scene.add(ambientLight);

      const light = new THREE.PointLight(0xffffff, 1.5);
      light.position.set(2, 2, 2);
      scene.add(light);

      let targetX = 0, targetY = 0;
      let currentX = 0, currentY = 0;

      function animate() {
        requestAnimationFrame(animate);

        // Smooth eye movement with better responsiveness
        currentX += (targetX - currentX) * 0.2;
        currentY += (targetY - currentY) * 0.2;

        pupil.position.x = currentX * 0.7;
        pupil.position.y = currentY * 0.7;
        iris.position.x = currentX * 0.5;
        iris.position.y = currentY * 0.5;

        renderer.render(scene, camera);
      }

      animate();

      const handleMouseMove = (event: MouseEvent) => {
        const rect = canvas.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        // Calculate distance from eye center
        const deltaX = event.clientX - centerX;
        const deltaY = event.clientY - centerY;
        
        // Calculate angle and distance
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        const maxDistance = Math.min(window.innerWidth, window.innerHeight) * 0.5;
        
        // Normalize and apply smooth scaling with increased range
        const normalizedDistance = Math.min(distance / maxDistance, 1);
        const scaleFactor = normalizedDistance * 1.2; // Increased range significantly
        
        targetX = (deltaX / distance) * scaleFactor || 0;
        targetY = -(deltaY / distance) * scaleFactor || 0; // Invert Y for proper tracking
        
        // Apply wider constraints for more dramatic movement
        targetX = Math.max(-1.4, Math.min(1.4, targetX));
        targetY = Math.max(-1.2, Math.min(1.2, targetY));
      };

      window.addEventListener("mousemove", handleMouseMove);
      
      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
      };
    };

    // Setup background 3D scene
    const setupScene = (canvas: HTMLCanvasElement | null) => {
      if (!canvas) return;

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
      const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });

      renderer.setSize(canvas.clientWidth, canvas.clientHeight);
      renderer.setClearColor(0x000000, 0);
      camera.position.z = 5;

      // Create floating particles
      const particlesGeometry = new THREE.BufferGeometry();
      const particlesCount = 200;
      const positions = new Float32Array(particlesCount * 3);

      for (let i = 0; i < particlesCount * 3; i++) {
        positions[i] = (Math.random() - 0.5) * 20;
      }

      particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      
      const particlesMaterial = new THREE.PointsMaterial({
        color: '#f59e0b',
        size: 0.15,
        transparent: true,
        opacity: 0.8
      });

      const particles = new THREE.Points(particlesGeometry, particlesMaterial);
      scene.add(particles);

      // Create 404 text geometry
      const textGeometry = new THREE.BoxGeometry(0.5, 1, 0.1);
      const textMaterial = new THREE.MeshPhongMaterial({ 
        color: '#fb923c', 
        transparent: true, 
        opacity: 0.9,
        emissive: '#ea580c',
        emissiveIntensity: 0.3
      });

      // Create "4" "0" "4" blocks
      const digit1 = new THREE.Mesh(textGeometry, textMaterial);
      digit1.position.set(-1.5, 0, 0);
      scene.add(digit1);

      const digit2 = new THREE.Mesh(textGeometry, textMaterial);
      digit2.position.set(0, 0, 0);
      scene.add(digit2);

      const digit3 = new THREE.Mesh(textGeometry, textMaterial);
      digit3.position.set(1.5, 0, 0);
      scene.add(digit3);

      // Add lighting
      const ambientLight = new THREE.AmbientLight(0x404040, 0.8);
      scene.add(ambientLight);

      const pointLight = new THREE.PointLight(0xfbbf24, 2, 100);
      pointLight.position.set(0, 5, 5);
      scene.add(pointLight);

      let time = 0;

      function animate() {
        requestAnimationFrame(animate);
        time += 0.01;

        // Animate particles
        particles.rotation.x = time * 0.1;
        particles.rotation.y = time * 0.15;

        // Animate 404 blocks
        digit1.rotation.x = Math.sin(time) * 0.1;
        digit1.rotation.y = time * 0.3;
        digit1.position.y = Math.sin(time * 2) * 0.2;

        digit2.rotation.x = Math.sin(time + 1) * 0.1;
        digit2.rotation.y = time * 0.3;
        digit2.position.y = Math.sin(time * 2 + 1) * 0.2;

        digit3.rotation.x = Math.sin(time + 2) * 0.1;
        digit3.rotation.y = time * 0.3;
        digit3.position.y = Math.sin(time * 2 + 2) * 0.2;

        renderer.render(scene, camera);
      }

      animate();
      setIsLoading(false);

      // Handle resize
      const handleResize = () => {
        if (canvas) {
          camera.aspect = canvas.clientWidth / canvas.clientHeight;
          camera.updateProjectionMatrix();
          renderer.setSize(canvas.clientWidth, canvas.clientHeight);
        }
      };

      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    };

    const eyeCleanup1 = setupEye(leftEyeRef.current);
    const eyeCleanup2 = setupEye(rightEyeRef.current);
    const sceneCleanup = setupScene(sceneRef.current);
    
    return () => {
      eyeCleanup1?.();
      eyeCleanup2?.();
      sceneCleanup?.();
    };
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94] as const
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-blue-900 dark:to-indigo-950 flex items-center justify-center p-4 overflow-hidden relative">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-orange-300 dark:bg-orange-400 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-xl opacity-30 dark:opacity-40 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-yellow-300 dark:bg-yellow-400 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-xl opacity-30 dark:opacity-40 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-amber-300 dark:bg-amber-400 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-xl opacity-20 dark:opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 w-full max-w-4xl"
      >
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* 3D Scene with Eyes */}
          <motion.div
            animate={{
              y: [-10, 10, -10],
              transition: {
                duration: 4,
                repeat: Infinity,
                ease: [0.42, 0, 0.58, 1] as const
              }
            }}
            className="relative"
          >
            {/* Floating Eyes */}
            <motion.div
              className="absolute -top-16 left-1/2 transform -translate-x-1/2 flex gap-6 z-20"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
                              transition={{ duration: 1, ease: [0.68, -0.55, 0.265, 1.55] as const, delay: 0.5 }}
            >
              <motion.div 
                className="relative"
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
              >
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-white to-blue-50 dark:from-slate-800 dark:to-blue-900 shadow-xl dark:shadow-2xl border-4 border-orange-200 dark:border-orange-400/30 backdrop-blur-sm overflow-hidden">
                  <canvas ref={leftEyeRef} className="w-full h-full"></canvas>
                </div>
              </motion.div>
              <motion.div 
                className="relative"
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
              >
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-white to-blue-50 dark:from-slate-800 dark:to-blue-900 shadow-xl dark:shadow-2xl border-4 border-orange-200 dark:border-orange-400/30 backdrop-blur-sm overflow-hidden">
                  <canvas ref={rightEyeRef} className="w-full h-full"></canvas>
                </div>
              </motion.div>
            </motion.div>

            <div className="relative w-full h-96 lg:h-[500px] rounded-3xl overflow-hidden bg-gradient-to-br from-white/80 to-blue-100/60 dark:from-slate-800/30 dark:to-blue-900/20 backdrop-blur-lg border border-orange-200 dark:border-orange-400/20 shadow-xl dark:shadow-2xl">
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <RefreshCw className="w-8 h-8 animate-spin text-orange-500 dark:text-orange-400" />
                </div>
              )}
              {/* This is the new Lottie animation player. */}
              <div className="relative w-full h-96 lg:h-[500px] rounded-3xl overflow-hidden bg-gradient-to-br from-white/80 to-blue-100/60 dark:from-slate-800/30 dark:to-blue-900/20 backdrop-blur-lg border border-orange-200 dark:border-orange-400/20 shadow-xl dark:shadow-2xl">
              <DynamicLottiePlayer />
              </div>
              <canvas 
                ref={sceneRef} 
                className="w-full h-full"
                style={{ display: isLoading ? 'none' : 'block' }}
              />
            </div>
          </motion.div>

          {/* Content */}
          <div className="space-y-8 text-center lg:text-left">
            <motion.div variants={itemVariants} className="space-y-4">
              <motion.h1 
                className="text-6xl lg:text-8xl font-black bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 dark:from-orange-400 dark:via-amber-500 dark:to-yellow-500 bg-clip-text text-transparent"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                404
              </motion.h1>
              <h2 className="text-2xl lg:text-4xl font-bold text-gray-800 dark:text-slate-100">
                Page Not Found
              </h2>
            </motion.div>

            <motion.p 
              variants={itemVariants}
              className="text-lg text-gray-600 dark:text-slate-300 leading-relaxed max-w-md mx-auto lg:mx-0"
            >
              The page you&apos;re looking for seems to have vanished into the digital void. 
              Don&apos;t worry, even the best explorers get lost sometimes.
            </motion.p>

            <motion.div 
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  asChild 
                  size="lg" 
                  className="bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 dark:from-orange-500 dark:to-amber-600 dark:hover:from-orange-600 dark:hover:to-amber-700 text-white font-semibold px-8 py-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group"
                >
                  <Link href="/" className="flex items-center gap-3">
                    <Home className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                    Return Home
                  </Link>
                </Button>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  asChild 
                  variant="outline" 
                  size="lg" 
                  className="border-2 border-orange-400 dark:border-orange-400 hover:border-orange-500 dark:hover:border-orange-300 px-8 py-6 rounded-2xl font-semibold hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-all duration-300 group text-gray-700 hover:text-orange-600 dark:text-slate-200 dark:hover:text-orange-300"
                >
                  <Link href="/search" className="flex items-center gap-3">
                    <Search className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    Search Site
                  </Link>
                </Button>
              </motion.div>
            </motion.div>

            <motion.div 
              variants={itemVariants}
              className="pt-6"
            >
              <motion.button
                onClick={() => window.history.back()}
                className="flex items-center gap-2 text-gray-500 hover:text-orange-500 dark:text-slate-400 dark:hover:text-orange-400 transition-colors mx-auto lg:mx-0 group"
                whileHover={{ x: -5 }}
              >
                <ArrowLeft className="w-4 h-4 group-hover:transform group-hover:-translate-x-1 transition-transform" />
                Go back to previous page
              </motion.button>
            </motion.div>
          </div>
        </div>
      </motion.div>

      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}