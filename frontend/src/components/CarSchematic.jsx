import React from 'react';

const CarSchematic = ({ isCritical }) => {
    // --- COLORS ---
    const primaryColor = isCritical ? '#ef4444' : '#06b6d4'; // Cyan vs Red
    const glowFilter = isCritical ? 'drop-shadow(0 0 15px rgba(239, 68, 68, 0.8))' : 'drop-shadow(0 0 8px rgba(6, 182, 212, 0.5))';

    return (
        <div className="w-full h-full flex flex-col items-center justify-center relative overflow-hidden">

            {/* 2. THE CAR WIREFRAME (Clean Front View) */}
            <svg
                viewBox="0 0 800 500"
                className="z-10 w-full max-w-[800px] transition-all duration-500"
                style={{ filter: glowFilter }}
            >

                {/* --- A. CHASSIS & BODY --- */}
                <g stroke={primaryColor} strokeWidth="2" fill="none" strokeLinejoin="round">
                    {/* 1. Roof & Windshield */}
                    <path d="M 280,120 L 520,120 L 560,200 L 240,200 Z" opacity="0.5" />
                    <path d="M 280,120 L 520,120 L 500,80 L 300,80 Z" opacity="0.3" />

                    {/* 2. Hood (Transparent X-Ray) */}
                    <path d="M 240,200 L 560,200 L 580,280 L 220,280 Z" strokeDasharray="2 2" opacity="0.8" />

                    {/* 3. Bumper & Fender Flares */}
                    <path d="M 220,280 L 580,280 L 560,350 L 240,350 Z" strokeWidth="2" />
                    <path d="M 240,350 L 560,350 L 540,380 L 260,380 Z" opacity="0.6" />

                    {/* 4. Headlights (Angular & Aggressive) */}
                    <path d="M 230,290 L 300,290 L 290,320 L 235,315 Z" fill={primaryColor} fillOpacity="0.2" />
                    <path d="M 570,290 L 500,290 L 510,320 L 565,315 Z" fill={primaryColor} fillOpacity="0.2" />

                    {/* 5. Side Mirrors (Attached to A-Pillars) */}
                    <path d="M 195,190 L 235,195 L 235,210 L 195,205 Z" fill={primaryColor} fillOpacity="0.1" />
                    <path d="M 605,190 L 565,195 L 565,210 L 605,205 Z" fill={primaryColor} fillOpacity="0.1" />

                    {/* 6. Wheels (Tucked & Connected) */}
                    <path d="M 190,300 L 190,380 L 230,380 L 230,300 Z" strokeWidth="2" />
                    <path d="M 220,280 Q 180,280 190,340" opacity="0.5" />
                    <path d="M 610,300 L 610,380 L 570,380 L 570,300 Z" strokeWidth="2" />
                    <path d="M 580,280 Q 620,280 610,340" opacity="0.5" />
                </g>

                {/* --- B. THE ENGINE BLOCK (Centered & Prominent) --- */}
                <g id="engine-block" className={`transition-all duration-300 ${isCritical ? 'animate-pulse' : ''}`}>
                    <path d="M 320,210 L 480,210 L 460,270 L 340,270 Z" fill={isCritical ? 'rgba(239, 68, 68, 0.4)' : 'rgba(6, 182, 212, 0.1)'} stroke={primaryColor} strokeWidth="3" />
                    <circle cx="360" cy="230" r="8" fill={isCritical ? primaryColor : 'none'} stroke={primaryColor} />
                    <circle cx="440" cy="230" r="8" fill={isCritical ? primaryColor : 'none'} stroke={primaryColor} />
                    <circle cx="360" cy="250" r="8" fill={isCritical ? primaryColor : 'none'} stroke={primaryColor} />
                    <circle cx="440" cy="250" r="8" fill={isCritical ? primaryColor : 'none'} stroke={primaryColor} />

                    {/* WARNING OVERLAY */}
                    {isCritical && (
                        <g>
                            <circle cx="400" cy="240" r="60" stroke="red" strokeWidth="2" fill="none" className="animate-ping" opacity="0.8" />
                            <text x="400" y="190" textAnchor="middle" fill="red" fontSize="14" fontWeight="bold" fontFamily="monospace">⚠ ENGINE FAULT</text>
                        </g>
                    )}
                </g>
            </svg>
        </div>
    );
};

export default CarSchematic;