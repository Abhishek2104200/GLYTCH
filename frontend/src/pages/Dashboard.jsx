import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import CarSchematic from '../components/CarHologram';
import { Activity, AlertTriangle, Thermometer } from 'lucide-react';
import CarHologram from '../components/CarHologram';

const Dashboard = () => {
  // State to simulate the error (Phase 2 Testing)
  const [isCritical, setIsCritical] = useState(false);

  const toggleSimulation = () => {
    setIsCritical(!isCritical);
  };

  return (
    <div className={`min-h-screen p-10 font-mono transition-colors duration-1000 ${isCritical ? 'bg-red-950/30' : 'bg-black'} text-green-500`}>
      {/* Header */}
      <div className="flex justify-between items-center border-b border-green-800 pb-4 mb-8">
        <h1 className="text-4xl font-bold tracking-wider flex items-center gap-4">
          GLYTCH_AUTOSYNC 
          <span className="text-xs align-top bg-green-900 text-white px-2 py-1 rounded">V2.0</span>
        </h1>
        
        {/* Status Indicator */}
        <div className={`text-xs px-4 py-2 rounded-full border ${isCritical ? 'border-red-500 text-red-500 bg-red-900/20 animate-pulse' : 'border-green-500 text-green-500'}`}>
          {isCritical ? '⚠ CRITICAL FAULT DETECTED' : '● SYSTEM ONLINE'}
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-[calc(100vh-200px)]">
        
        {/* LEFT: The Car Schematic */}
        <div className={`border p-4 flex flex-col items-center justify-center relative overflow-hidden transition-all duration-500 ${isCritical ? 'border-red-600 bg-red-900/10 shadow-[0_0_50px_rgba(220,38,38,0.2)]' : 'border-green-800 bg-gray-900/30'}`}>
          <div className="absolute top-4 left-4 z-10">
            <h3 className="text-xs uppercase tracking-widest opacity-70">Live Telemetry</h3>
            <div className="text-2xl font-bold mt-1 flex items-center gap-2">
                <Thermometer size={20} />
                {isCritical ? '115°C' : '90°C'}
            </div>
          </div>
          
          {/* The SVG Component */}
          <CarHologram isCritical={isCritical} />

          {isCritical && (
            <div className="absolute bottom-20 bg-red-600 text-white px-6 py-2 rounded font-bold animate-bounce shadow-lg">
                ENGINE OVERHEAT (P0217)
            </div>
          )}
        </div>
        
        {/* RIGHT: Controls & Logs */}
        <div className="flex flex-col gap-6">
           
           {/* Simulation Controls (Temporary for Testing) */}
           <div className="border border-green-800 p-5 bg-gray-900/30">
             <h2 className="text-xl mb-4 border-b border-green-900 pb-2 flex items-center gap-2">
                <Activity size={18} />
                SIMULATION CONTROLS
             </h2>
             <p className="text-xs text-gray-400 mb-4">
                Use this button to test the visual response before connecting the backend.
             </p>
             <button 
                onClick={toggleSimulation}
                className={`w-full py-4 font-bold border transition-all ${isCritical ? 'border-green-500 text-green-500 hover:bg-green-900/20' : 'border-red-500 text-red-500 hover:bg-red-900/20'}`}
             >
                {isCritical ? 'RESET SYSTEM' : 'TRIGGER FAULT (P0217)'}
             </button>
           </div>

           {/* Console Log */}
           <div className="border border-green-800 p-5 flex-grow flex flex-col">
             <h2 className="text-xl mb-4 border-b border-green-900 pb-2">LIVE CONSOLE</h2>
             <div className="bg-black p-4 text-xs font-mono overflow-y-auto flex-grow h-40 border border-green-900/50">
               <p className="text-gray-500">> Initializing GLYTCH Core...</p>
               <p className="text-gray-500">> Connecting to WebSocket...</p>
               {isCritical && (
                   <>
                    <p className="text-red-500 mt-2">> [CRITICAL] ANOMALY DETECTED</p>
                    <p className="text-red-400">> ERROR CODE: P0217</p>
                    <p className="text-red-400">> PART: ENGINE_BLOCK</p>
                    <p className="text-yellow-500 mt-1">> [UEBA] Verifying sensor data integrity...</p>
                    <p className="text-green-500">> [UEBA] Data validated. Alerting driver.</p>
                   </>
               )}
             </div>
           </div>

           {/* Navigation */}
           <div className="border border-green-800 p-5">
             <Link to="/booking" className="block w-full bg-green-700 hover:bg-green-600 text-black font-bold py-4 px-6 text-center transition-all uppercase tracking-widest">
               Open Service Portal &rarr;
             </Link>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;