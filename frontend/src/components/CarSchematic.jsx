import React from "react";

const CarSchematic = ({ isCritical }) => {
  return (
    <div className="relative w-full h-full flex items-center justify-center p-4 bg-transparent">
      {/* SVG Filters for Glow */}
      <svg width="0" height="0">
        <defs>
          <filter id="neonGlowGreen">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id="neonGlowRed">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
      </svg>

      {/* Main SVG */}
      <svg
        viewBox="0 0 500 350"
        className="w-full max-w-[700px] drop-shadow-[0_0_20px_rgba(16,185,129,0.3)]"
        fill="none"
        strokeWidth="2"
      >
        {/* --- CAR BODY WIREFRAME --- */}
        <g
          stroke="#00ffcc"
          filter="url(#neonGlowGreen)"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Outer silhouette */}
          <path d="M50 200 L120 120 C150 90 350 90 380 120 L450 200 L450 260 L380 300 L120 300 L50 260 Z" opacity="0.9" />

          {/* Hood lines */}
          <line x1="120" y1="160" x2="380" y2="160" opacity="0.5" />
          <line x1="140" y1="180" x2="360" y2="180" opacity="0.5" />

          {/* Roof */}
          <path d="M170 120 L210 80 L290 80 L330 120" opacity="0.7" />

          {/* Windshield */}
          <path d="M170 120 Q250 100 330 120" opacity="0.8" />

          {/* Wheels */}
          <circle cx="140" cy="290" r="35" />
          <circle cx="360" cy="290" r="35" />
          <circle cx="140" cy="290" r="18" />
          <circle cx="360" cy="290" r="18" />

          {/* Side panel details */}
          <line x1="120" y1="240" x2="380" y2="240" opacity="0.4" />
          <line x1="120" y1="260" x2="380" y2="260" opacity="0.4" />
        </g>

        {/* --- ENGINE BLOCK --- */}
        <g
          className={`transition-all duration-500 ${
            isCritical ? "animate-pulse" : ""
          }`}
        >
          <rect
            x="210"
            y="130"
            width="80"
            height="60"
            rx="4"
            stroke={isCritical ? "#ff4444" : "#00ffcc"}
            fill={isCritical ? "rgba(255,0,0,0.2)" : "rgba(0,255,200,0.1)"}
            strokeWidth="2.5"
            filter={`url(#${isCritical ? "neonGlowRed" : "neonGlowGreen"})`}
          />

          {/* Engine coils */}
          <circle cx="230" cy="150" r="8" fill={isCritical ? "#ff4444" : "#00ffcc"} />
          <circle cx="270" cy="150" r="8" fill={isCritical ? "#ff4444" : "#00ffcc"} />

          {/* Heat Waves */}
          {isCritical && (
            <>
              <path
                d="M200 120 Q220 100 240 120"
                stroke="#ff4444"
                opacity="0.7"
                className="animate-bounce"
              />
              <path
                d="M260 120 Q280 100 300 120"
                stroke="#ff4444"
                opacity="0.7"
                className="animate-bounce"
              />
            </>
          )}
        </g>

        {/* --- HUD LABELS --- */}
        <g fill="none" stroke="#ffffff" strokeWidth="1.2" opacity="0.85">
          {/* Temp */}
          <rect x="60" y="40" width="110" height="40" rx="6" className="fill-black/40" />
          <text x="70" y="65" fontSize="14" fill="#00ffcc" fontFamily="monospace">
            Temp: 115°C
          </text>
          <line x1="115" y1="80" x2="150" y2="160" stroke="#00ffcc" />

          {/* Error */}
          <rect x="350" y="40" width="120" height="40" rx="6" className="fill-black/40" />
          <text x="360" y="65" fontSize="14" fill="#00ffcc" fontFamily="monospace">
            Error: P0217
          </text>
          <line x1="395" y1="80" x2="320" y2="160" stroke="#00ffcc" />

          {/* RPM */}
          <rect x="370" y="260" width="80" height="40" rx="6" className="fill-black/40" />
          <text x="380" y="285" fontSize="14" fill="#00ffcc" fontFamily="monospace">
            RPM: 0
          </text>
          <line x1="390" y1="260" x2="360" y2="290" stroke="#00ffcc" />
        </g>
      </svg>

      {/* --- CRITICAL ALERT BANNER --- */}
      {isCritical && (
        <div className="absolute bottom-4 px-6 py-3 bg-red-600/40 border border-red-400/80 text-red-300 font-mono tracking-wide rounded-lg shadow-[0_0_25px_rgba(255,0,0,0.6)] backdrop-blur-md animate-pulse">
          ⚠️ CRITICAL FAULT DETECTED
        </div>
      )}
    </div>
  );
};

export default CarSchematic;
