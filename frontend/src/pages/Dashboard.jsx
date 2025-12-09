import React, { useState, useEffect } from 'react';
import CarSchematic from '../components/CarSchematic';
import { Send, AlertTriangle, Phone, Wrench, Calendar } from 'lucide-react';
import axios from 'axios';
import Car3D from '../components/Car3D';

const Dashboard = () => {
    const [vehicleData, setVehicleData] = useState({ rpm: 0, speed: 0, temp: 90, dtc: null });
    const [messages, setMessages] = useState([
        { sender: "ai", text: "GLYTCH System Online. Monitoring vehicle telemetry..." }
    ]);
    const [inputText, setInputText] = useState("");
    const [isCritical, setIsCritical] = useState(false);

    useEffect(() => {
        const ws = new WebSocket("ws://127.0.0.1:8000/ws/simulation");
        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            setVehicleData(data);
            if (data.dtc === "P0217" && !isCritical) {
                setIsCritical(true);
                addMessage("system", "⚠️ CRITICAL ALERT: OBD-II Code P0217 Detected (Engine Overtemp).");
            }
        };
        return () => ws.close();
    }, [isCritical]);

    const addMessage = (sender, text) => {
        setMessages(prev => [...prev, { sender, text }]);
    };

    const sendMessage = async () => {
        if (!inputText.trim()) return;
        addMessage("user", inputText);
        const query = inputText;
        setInputText("");

        try {
            const res = await axios.post("http://127.0.0.1:8000/api/analyze", {
                query: query,
                vehicle_data: vehicleData
            });
            const analysis = res.data.analysis;
            const steps = res.data.steps || [];
            const booking = res.data.booking_status;

            addMessage("ai", analysis);
            if (steps.length > 0) addMessage("ai", "RECOMMENDED ACTIONS: \n" + steps.join("\n"));
            if (booking) addMessage("ai", "📅 SERVICE UPDATE: " + booking);

        } catch (err) {
            addMessage("ai", "Error connecting to Agent Brain.");
        }
    };

    const handleCallAssist = async () => {
        addMessage("system", "🔄 Initiating Voice Uplink...");
        try {
            await axios.post("http://127.0.0.1:8000/api/voice-test");
            addMessage("system", "📞 Voice Call Dispatched! (Check Backend Console)");
        } catch (err) {
            addMessage("ai", "❌ Error: Could not connect to Voice Service.");
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 text-slate-100 p-6">
            <header className="flex justify-between items-center mb-8 border-b border-slate-700 pb-4">
                <h1 className="text-3xl font-bold tracking-tighter text-blue-400">GLYTCH <span className="text-white">AUTOSYNC</span></h1>
                <div className="flex gap-4 text-sm text-slate-400">
                    <span>VIN: VH-8821-X</span>
                    <span className="flex items-center gap-2"><div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div> LIVE</span>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* LEFT PANEL: VISUALS (Takes up 2 columns) */}
                <div className="lg:col-span-2 space-y-6">

                    {/* --- SIDE-BY-SIDE CONTAINER --- */}
                    {/* We use Flexbox here to force them side-by-side on large screens */}
                    <div className="flex flex-col md:flex-row gap-6 h-[400px]">

                        {/* 1. 3D Digital Twin (Grey) - Takes 50% width */}
                        <div className="w-full md:w-1/2 h-full">
                            <Car3D />
                        </div>

                        {/* 2. 2D Schematic (Blue) - Takes 50% width */}
                        <div className="w-full md:w-1/2 h-full bg-slate-800 rounded-xl p-4 border border-slate-700 shadow-2xl relative overflow-hidden flex flex-col justify-center">
                            <CarSchematic isCritical={isCritical} />

                            {/* Live Metrics Overlay */}
                            <div className="absolute top-4 left-4 grid grid-cols-2 gap-4 text-xs font-mono">
                                <div>
                                    <div className="text-slate-500">RPM</div>
                                    <div className="text-xl">{vehicleData.rpm}</div>
                                </div>
                                <div>
                                    <div className="text-slate-500">TEMP</div>
                                    <div className={`text-xl ${vehicleData.temp > 110 ? "text-red-500 blink" : "text-blue-400"}`}>
                                        {vehicleData.temp}°C
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-3 gap-4">
                        <div onClick={handleCallAssist} className="bg-slate-800 p-4 rounded-lg border border-slate-700 flex flex-col items-center justify-center hover:bg-slate-700 cursor-pointer transition active:scale-95">
                            <Phone className="w-6 h-6 mb-2 text-blue-400" />
                            <span className="text-xs">Call Assist</span>
                        </div>
                        <div className="bg-slate-800 p-4 rounded-lg border border-slate-700 flex flex-col items-center justify-center hover:bg-slate-700 cursor-pointer transition opacity-50">
                            <Wrench className="w-6 h-6 mb-2 text-orange-400" />
                            <span className="text-xs">Book Service</span>
                        </div>
                        <div className="bg-slate-800 p-4 rounded-lg border border-slate-700 flex flex-col items-center justify-center hover:bg-slate-700 cursor-pointer transition opacity-50">
                            <AlertTriangle className="w-6 h-6 mb-2 text-red-400" />
                            <span className="text-xs">Emergency</span>
                        </div>
                    </div>
                </div>

                {/* RIGHT PANEL: CHAT AGENT */}
                <div className="bg-slate-800 rounded-xl border border-slate-700 flex flex-col h-[600px]">
                    <div className="p-4 border-b border-slate-700 bg-slate-800 rounded-t-xl">
                        <h2 className="font-semibold flex items-center gap-2">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div> AI Assistant
                        </h2>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[80%] p-3 rounded-lg text-sm whitespace-pre-line ${msg.sender === 'user' ? 'bg-blue-600 text-white' : msg.sender === 'system' ? 'bg-red-900/50 text-red-200 border border-red-800' : 'bg-slate-700 text-slate-200'}`}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="p-4 border-t border-slate-700">
                        <div className="flex gap-2">
                            <input type="text" className="flex-1 bg-slate-900 border border-slate-600 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-blue-500" placeholder="Ask about vehicle status..." value={inputText} onChange={(e) => setInputText(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && sendMessage()} />
                            <button onClick={sendMessage} className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition"><Send className="w-4 h-4" /></button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;