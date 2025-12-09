import React, { memo } from 'react';
import { Canvas } from '@react-three/fiber';
import { useGLTF, Stage, OrbitControls } from '@react-three/drei';

function Model() {
    const { scene } = useGLTF('/Car Model.glb');
    return <primitive object={scene} />;
}

// Wrapped in 'memo' for performance
const Car3D = memo(() => {
    return (
        // Changed bg-slate-900 to bg-gray-800 for the "Grey" look
        <div className="h-full w-full bg-gray-800 rounded-xl overflow-hidden border border-slate-600 shadow-2xl relative">
            {/* Label Overlay */}
            <div className="absolute top-4 left-4 z-10 bg-black/40 px-3 py-1 rounded text-xs text-white/80 font-mono border border-white/10 backdrop-blur-sm">
                DIGITAL TWIN
            </div>

            <Canvas shadows={false} dpr={1} camera={{ fov: 50 }}>
                <Stage environment="city" intensity={0.5} contactShadow={false}>
                    <Model />
                </Stage>
                <OrbitControls autoRotate={true} autoRotateSpeed={1.5} enableZoom={false} />
            </Canvas>
        </div>
    );
});

export default Car3D;