import React from 'react';

const CarSchematic = ({ isCritical }) => {
    // If critical (P0217), color is Red. Otherwise, Green.
    const engineColor = isCritical ? "#ef4444" : "#22c55e"; // Tailwind red-500 vs green-500
    const glowEffect = isCritical ? "drop-shadow(0 0 15px rgba(239, 68, 68, 0.8))" : "";

    return (
        <div className="w-full max-w-md mx-auto transition-all duration-500">
            <svg viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
                {/* Car Body Outline */}
                <path d="M10,100 Q40,40 100,40 L280,40 Q360,40 390,100 L390,160 L10,160 Z"
                    fill="none" stroke="#475569" strokeWidth="4" />

                {/* Wheels */}
                <circle cx="80" cy="160" r="30" fill="#334155" />
                <circle cx="320" cy="160" r="30" fill="#334155" />

                {/* ENGINE BLOCK (The part that changes color) */}
                <g id="engine-block" style={{ filter: glowEffect, transition: "all 0.5s ease" }}>
                    <rect x="260" y="60" width="80" height="60" rx="5"
                        fill={engineColor} stroke="white" strokeWidth="2" />
                    <text x="300" y="95" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">
                        ENGINE
                    </text>
                </g>

                {/* Transmission (Static) */}
                <rect x="150" y="130" width="200" height="10" fill="#64748b" />

                {/* Label */}
                <text x="200" y="190" textAnchor="middle" fill="#94a3b8" fontSize="12">
                    LIVE VEHICLE DIAGNOSTICS
                </text>
            </svg>

            {/* Status Text */}
            <div className={`text-center mt-4 font-mono font-bold ${isCritical ? "text-red-500 animate-pulse" : "text-green-500"}`}>
                STATUS: {isCritical ? "CRITICAL FAILURE (P0217)" : "SYSTEM OPTIMAL"}
            </div>
        </div>
    );
};

export default CarSchematic;