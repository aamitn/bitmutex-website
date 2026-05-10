"use client";
import React, { useEffect, useRef } from "react";

interface ShootingStar {
  x: number;
  y: number;
  angle: number;
  scale: number;
  speed: number;
  distance: number;
}

const getRandomStartPoint = () => {
  const side = Math.floor(Math.random() * 4);
  const offset = Math.random() * window.innerWidth;

  switch (side) {
    case 0:
      return { x: offset, y: 0, angle: 45 };
    case 1:
      return { x: window.innerWidth, y: offset, angle: 135 };
    case 2:
      return { x: offset, y: window.innerHeight, angle: 225 };
    case 3:
      return { x: 0, y: offset, angle: 315 };
    default:
      return { x: 0, y: 0, angle: 45 };
  }
};

const ShootingStars: React.FC = () => {
  // Use refs instead of state to prevent 60fps React re-renders
  const rectRef = useRef<SVGRectElement>(null);
  const starData = useRef<ShootingStar | null>(null);
  const animationFrameId = useRef<number | null>(null);
  const timeoutId = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const spawnStar = () => {
      const { x, y, angle } = getRandomStartPoint();
      
      // Reset the star data
      starData.current = {
        x,
        y,
        angle,
        scale: 1,
        speed: Math.random() * 20 + 10,
        distance: 0,
      };

      // Make the rect visible again
      if (rectRef.current) {
        rectRef.current.style.display = "block";
      }

      // Schedule the next star
      const randomDelay = Math.random() * 4500 + 4200;
      timeoutId.current = setTimeout(spawnStar, randomDelay);
    };

    const animate = () => {
      if (starData.current && rectRef.current) {
        const current = starData.current;
        
        // Calculate new positions
        const newX = current.x + current.speed * Math.cos((current.angle * Math.PI) / 180);
        const newY = current.y + current.speed * Math.sin((current.angle * Math.PI) / 180);
        const newDistance = current.distance + current.speed;
        const newScale = 1 + newDistance / 100;

        // Check bounds
        if (
          newX < -20 ||
          newX > window.innerWidth + 20 ||
          newY < -20 ||
          newY > window.innerHeight + 20
        ) {
          // Hide the star when it goes off-screen
          rectRef.current.style.display = "none";
          starData.current = null;
        } else {
          // Update data
          current.x = newX;
          current.y = newY;
          current.distance = newDistance;
          current.scale = newScale;

          // Directly mutate the DOM for maximum performance
          const width = 10 * newScale;
          rectRef.current.setAttribute("x", String(newX));
          rectRef.current.setAttribute("y", String(newY));
          rectRef.current.setAttribute("width", String(width));
          rectRef.current.setAttribute(
            "transform",
            `rotate(${current.angle}, ${newX + width / 2}, ${newY + 1})`
          );
        }
      }

      animationFrameId.current = requestAnimationFrame(animate);
    };

    // Start the loops
    spawnStar();
    animate();

    // Proper cleanup on unmount
    return () => {
      if (timeoutId.current) clearTimeout(timeoutId.current);
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
    };
  }, []);

  return (
    <svg
      width="100%"
      height="100%"
      className="absolute top-0 left-0 pointer-events-none"
    >
      <defs>
        <linearGradient id="star-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: "#2EB9DF", stopOpacity: 0 }} />
          <stop offset="100%" style={{ stopColor: "#9E00FF", stopOpacity: 1 }} />
        </linearGradient>
      </defs>
      <rect
        ref={rectRef}
        height="2"
        fill="url(#star-gradient)"
        style={{ display: "none" }} // Hidden until spawned
      />
    </svg>
  );
};

export default ShootingStars;