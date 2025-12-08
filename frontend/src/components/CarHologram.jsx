import React from 'react';

const CarHologram = ({ isCritical }) => {
  // Colors
  const color = isCritical ? '#ef4444' : '#10b981'; // Red vs Green
  
  return (
    <div className="w-full h-full flex items-center justify-center perspective-[1000px] overflow-hidden bg-black/40">
      
      {/* THE 3D CONTAINER */}
      <div 
        className="relative w-[300px] h-[500px] transition-transform duration-700"
        style={{ 
          transformStyle: 'preserve-3d', 
          transform: isCritical ? 'rotateX(60deg) rotateZ(360deg) scale(0.8)' : 'rotateX(55deg) rotateZ(15deg) scale(0.9)' 
        }}
      >
        
        {/* LAYER 1: THE FLOOR GRID (Bottom) */}
        <div 
          className="absolute inset-0 border border-dashed opacity-30"
          style={{ 
            borderColor: color, 
            transform: 'translateZ(-50px)',
            background: `radial-gradient(circle, ${color}20 10%, transparent 70%)` 
          }}
        ></div>

        {/* LAYER 2: THE CAR CHASSIS (Middle) */}
        <svg 
          viewBox="0 0 300 500" 
          className="absolute inset-0 w-full h-full"
          style={{ transform: 'translateZ(0px)', filter: `drop-shadow(0 0 5px ${color})` }}
        >
          {/* Wheels */}
          <rect x="20" y="80" width="40" height="70" fill={color} fillOpacity="0.2" stroke={color} />
          <rect x="240" y="80" width="40" height="70" fill={color} fillOpacity="0.2" stroke={color} />
          <rect x="20" y="350" width="40" height="70" fill={color} fillOpacity="0.2" stroke={color} />
          <rect x="240" y="350" width="40" height="70" fill={color} fillOpacity="0.2" stroke={color} />
          
          {/* Body Outline */}
          <path 
            d="M 70,50 L 230,50 L 240,150 L 240,400 L 230,450 L 70,450 L 60,400 L 60,150 Z" 
            fill="none" 
            stroke={color} 
            strokeWidth="2" 
            strokeDasharray="5 2"
          />
          {/* Axles */}
          <line x1="60" y1="115" x2="240" y2="115" stroke={color} opacity="0.5" />
          <line x1="60" y1="385" x2="240" y2="385" stroke={color} opacity="0.5" />
          <line x1="150" y1="115" x2="150" y2="385" stroke={color} opacity="0.3" strokeDasharray="10 5" />
        </svg>

        {/* LAYER 3: THE ENGINE (Floating Top) */}
        <div 
          className="absolute top-[100px] left-[85px] w-[130px] h-[100px]"
          style={{ 
            transformStyle: 'preserve-3d', 
            transform: 'translateZ(60px)' /* Floats 60px above the car */
          }}
        >
          {/* Connection Lines (Rays connecting engine to chassis) */}
          <div className="absolute top-0 left-0 w-px h-[60px] bg-gradient-to-b from-transparent to-current opacity-50 origin-bottom" style={{ color: color, transform: 'rotateX(-90deg) translateY(30px)' }}></div>
          <div className="absolute top-0 right-0 w-px h-[60px] bg-gradient-to-b from-transparent to-current opacity-50 origin-bottom" style={{ color: color, transform: 'rotateX(-90deg) translateY(30px)' }}></div>
          <div className="absolute bottom-0 left-0 w-px h-[60px] bg-gradient-to-b from-transparent to-current opacity-50 origin-bottom" style={{ color: color, transform: 'rotateX(-90deg) translateY(30px)' }}></div>
          <div className="absolute bottom-0 right-0 w-px h-[60px] bg-gradient-to-b from-transparent to-current opacity-50 origin-bottom" style={{ color: color, transform: 'rotateX(-90deg) translateY(30px)' }}></div>

          {/* The Engine Block SVG */}
          <svg viewBox="0 0 130 100" className="w-full h-full drop-shadow-2xl">
            <rect x="5" y="5" width="120" height="90" fill={color} fillOpacity="0.1" stroke={color} strokeWidth="2" />
            
            {/* Pistons */}
            <circle cx="35" cy="30" r="10" fill={isCritical ? color : 'none'} stroke={color} />
            <circle cx="95" cy="30" r="10" fill={isCritical ? color : 'none'} stroke={color} />
            <circle cx="35" cy="70" r="10" fill={isCritical ? color : 'none'} stroke={color} />
            <circle cx="95" cy="70" r="10" fill={isCritical ? color : 'none'} stroke={color} />
            
            {/* Warning Text Floating */}
            {isCritical && (
              <text x="65" y="50" textAnchor="middle" fill={color} fontSize="10" fontWeight="bold" className="animate-pulse">
                OVERHEAT
              </text>
            )}
          </svg>
        </div>

      </div>

      {/* 3D LABEL */}
      <div className="absolute bottom-10 text-xs font-mono tracking-[0.3em] opacity-80" style={{ color: color }}>
        HOLOGRAPHIC_VIEW_360
      </div>
    </div>
  );
};

export default CarHologram;