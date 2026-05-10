import React from 'react';

const ShapeDivider = () => {
  return (
    <div className="relative w-full h-0">
      <div className="absolute top-[-100px] left-0 w-full overflow-hidden leading-none">
        <svg
          className="relative block w-full h-28"
          viewBox="0 0 1440 100"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Light mode — indigo to slate */}
            <linearGradient id="waveLight1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#c7d2fe" stopOpacity="0.9" />
              <stop offset="50%" stopColor="#e0e7ff" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#f1f5f9" stopOpacity="0.9" />
            </linearGradient>
            <linearGradient id="waveLight2" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#a5b4fc" stopOpacity="0.5" />
              <stop offset="60%" stopColor="#818cf8" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#c7d2fe" stopOpacity="0.4" />
            </linearGradient>

            {/* Dark mode — deep purple to near-black */}
            <linearGradient id="waveDark1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#0f0a1e" stopOpacity="1" />
              <stop offset="40%" stopColor="#1a1035" stopOpacity="1" />
              <stop offset="100%" stopColor="#0a0a0f" stopOpacity="1" />
            </linearGradient>
            <linearGradient id="waveDark2" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#312e81" stopOpacity="0.4" />
              <stop offset="50%" stopColor="#4f46e5" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#1e1b4b" stopOpacity="0.3" />
            </linearGradient>
            <linearGradient id="waveDark3" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#6366f1" stopOpacity="0.15" />
              <stop offset="50%" stopColor="#818cf8" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#4f46e5" stopOpacity="0.12" />
            </linearGradient>

            {/* Animated shimmer */}
            <linearGradient id="shimmer" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="white" stopOpacity="0" />
              <stop offset="50%" stopColor="white" stopOpacity="0.06" />
              <stop offset="100%" stopColor="white" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* ── LIGHT MODE ─────────────────────────────── */}

          {/* Back wave — wider, slower curve */}
          <path
            className="dark:hidden"
            d="M0,60 C240,20 480,90 720,50 C960,10 1200,80 1440,45 L1440,100 L0,100 Z"
            fill="url(#waveLight2)"
          />
          {/* Front wave — tighter, fills bottom */}
          <path
            className="dark:hidden"
            d="M0,70 C180,30 420,95 660,55 C900,15 1140,85 1440,55 L1440,100 L0,100 Z"
            fill="url(#waveLight1)"
          />
          {/* Hair-line edge accent */}
          <path
            className="dark:hidden"
            d="M0,70 C180,30 420,95 660,55 C900,15 1140,85 1440,55"
            fill="none"
            stroke="#a5b4fc"
            strokeWidth="0.75"
            strokeOpacity="0.6"
          />

          {/* ── DARK MODE ──────────────────────────────── */}

          {/* Deepest layer */}
          <path
            className="hidden dark:block"
            d="M0,55 C300,10 600,95 900,45 C1100,15 1280,75 1440,40 L1440,100 L0,100 Z"
            fill="url(#waveDark2)"
          />
          {/* Mid layer */}
          <path
            className="hidden dark:block"
            d="M0,65 C240,20 500,90 740,50 C980,10 1220,80 1440,50 L1440,100 L0,100 Z"
            fill="url(#waveDark1)"
          />
          {/* Indigo shimmer on top */}
          <path
            className="hidden dark:block"
            d="M0,65 C240,20 500,90 740,50 C980,10 1220,80 1440,50 L1440,100 L0,100 Z"
            fill="url(#waveDark3)"
          />
          {/* Glowing edge line */}
          <path
            className="hidden dark:block"
            d="M0,65 C240,20 500,90 740,50 C980,10 1220,80 1440,50"
            fill="none"
            stroke="#6366f1"
            strokeWidth="0.75"
            strokeOpacity="0.5"
          />
          {/* Shimmer pass */}
          <path
            className="hidden dark:block"
            d="M0,65 C240,20 500,90 740,50 C980,10 1220,80 1440,50 L1440,100 L0,100 Z"
            fill="url(#shimmer)"
          />

          {/* ── SHARED — tiny dot accents on the wave crest ── */}
          <circle cx="440"  cy="52" r="1.5" fill="#818cf8" fillOpacity="0.5" />
          <circle cx="740"  cy="48" r="1"   fill="#a5b4fc" fillOpacity="0.4" />
          <circle cx="1080" cy="56" r="1.5" fill="#6366f1" fillOpacity="0.45" />
        </svg>
      </div>

      {/* Soft glow bloom behind the wave — dark mode only */}
      <div className="hidden dark:block absolute top-[-110px] left-1/2 -translate-x-1/2 w-2/3 h-20 bg-indigo-700/10 blur-3xl rounded-full pointer-events-none" />
    </div>
  );
};

export default ShapeDivider;