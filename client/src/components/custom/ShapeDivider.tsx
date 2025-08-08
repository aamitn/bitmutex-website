import React from 'react';

const ShapeDivider = () => {
  return (
    <div className="relative w-full">
      {/* Main Shape Divider */}
      <div className="absolute top-[-120px] left-0 w-full overflow-hidden leading-none">
        <svg
          className="relative block w-full h-32"
          viewBox="0 0 1440 120"
          preserveAspectRatio="none"
        >
          {/* Gradient Definitions */}
          <defs>
            {/* Primary Gradient - Dark Blue to Orange */}
            <linearGradient id="primaryGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{ stopColor: "#0f172a", stopOpacity: 1 }} />
              <stop offset="30%" style={{ stopColor: "#1a3a87", stopOpacity: 0.98 }} />
              <stop offset="60%" style={{ stopColor: "#164ccc", stopOpacity: 0.95 }} />
              <stop offset="100%" style={{ stopColor: "#fb923c", stopOpacity: 0.98 }} />
            </linearGradient>
            
            {/* Secondary Gradient for depth - Navy to Amber */}
            <linearGradient id="secondaryGrad" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" style={{ stopColor: "#1e3a8a", stopOpacity: 0.85 }} />
              <stop offset="40%" style={{ stopColor: "#3730a3", stopOpacity: 0.75 }} />
              <stop offset="70%" style={{ stopColor: "#1a3a87", stopOpacity: 0.8 }} />
              <stop offset="100%" style={{ stopColor: "#0f172a", stopOpacity: 0.9 }} />
            </linearGradient>

            {/* Sophisticated overlay gradient - Warm accent */}
            <linearGradient id="overlayGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" style={{ stopColor: "#fbbf24", stopOpacity: 0.12 }} />
              <stop offset="50%" style={{ stopColor: "#f59e0b", stopOpacity: 0.08 }} />
              <stop offset="100%" style={{ stopColor: "#ea580c", stopOpacity: 0.15 }} />
            </linearGradient>

            {/* Enhanced shadow filter */}
            <filter id="shadowFilter" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="0" dy="6" stdDeviation="12" floodColor="#000000" floodOpacity="0.25"/>
              <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="#1e40af" floodOpacity="0.1"/>
            </filter>

            {/* Premium glass morphism filter */}
            <filter id="blur" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="1.5"/>
              <feColorMatrix type="saturate" values="1.2"/>
            </filter>

            {/* Subtle inner glow */}
            <filter id="innerGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge> 
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/> 
              </feMerge>
            </filter>
          </defs>

          {/* Enhanced background layer for depth */}
          <path
            d="M0,45 C280,125 520,-15 760,75 C1000,165 1240,-25 1440,65 L1440,120 L0,120 Z"
            fill="url(#secondaryGrad)"
            opacity="0.7"
            filter="url(#blur)"
          />

          {/* Main sophisticated wave */}
          <path
            d="M0,55 C200,135 380,-25 580,65 C780,155 980,-15 1180,75 C1280,125 1440,25 1440,55 L1440,120 L0,120 Z"
            fill="url(#primaryGrad)"
            filter="url(#shadowFilter)"
          />

          {/* Premium highlight layer */}
          <path
            d="M0,60 C220,130 420,-10 620,80 C820,170 1020,10 1220,90 C1320,130 1440,35 1440,60 L1440,120 L0,120 Z"
            fill="url(#overlayGrad)"
            opacity="0.8"
            filter="url(#innerGlow)"
          />

          {/* Refined geometric accents */}
          <polygon
            points="720,40 755,18 790,40 772.5,68"
            fill="rgba(251,146,60,0.25)"
            opacity="0.9"
          />
          <polygon
            points="380,30 405,8 430,30 417.5,58"
            fill="rgba(234,88,12,0.2)"
            opacity="0.7"
          />
          <polygon
            points="1120,50 1150,28 1180,50 1165,78"
            fill="rgba(251,191,36,0.22)"
            opacity="0.8"
          />
          
          {/* Additional micro-details */}
          <circle cx="600" cy="35" r="3" fill="rgba(251,146,60,0.3)" opacity="0.6" />
          <circle cx="900" cy="45" r="2" fill="rgba(234,88,12,0.25)" opacity="0.7" />
          <circle cx="200" cy="55" r="2.5" fill="rgba(251,191,36,0.28)" opacity="0.5" />
        </svg>
      </div>

      {/* Enhanced ambient glow effect */}
      <div className="absolute top-[-140px] left-0 w-full h-40 bg-gradient-to-b from-transparent via-blue-950/10 to-transparent blur-xl"></div>
      <div className="absolute top-[-120px] left-0 w-full h-32 bg-gradient-to-r from-orange-500/5 via-transparent to-orange-600/8 blur-2xl"></div>
      
      {/* Premium particle effects */}
      <div className="absolute top-[-95px] left-1/4 w-2.5 h-2.5 bg-orange-400/40 rounded-full animate-pulse shadow-lg shadow-orange-500/20"></div>
      <div className="absolute top-[-75px] left-3/4 w-2 h-2 bg-amber-300/35 rounded-full animate-pulse delay-700 shadow-md shadow-amber-400/15"></div>
      <div className="absolute top-[-105px] left-1/2 w-1.5 h-1.5 bg-yellow-400/30 rounded-full animate-pulse delay-1000 shadow-sm shadow-yellow-500/10"></div>
      <div className="absolute top-[-85px] left-1/6 w-1 h-1 bg-orange-500/25 rounded-full animate-pulse delay-500"></div>
      <div className="absolute top-[-115px] left-5/6 w-1.5 h-1.5 bg-amber-400/30 rounded-full animate-pulse delay-1200"></div>


    </div>
  );
};

export default ShapeDivider;