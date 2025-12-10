import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom'; // 1. Added Navigation Hook
import CarSchematic from '../components/CarSchematic';
// 2. Added Activity icon for the new button
import { Send, Phone, Wrench, AlertTriangle, Activity } from 'lucide-react';
import axios from 'axios';
import Car3D from '../components/Car3D';

const Dashboard = () => {
    const navigate = useNavigate(); // Initialize Navigate
    const [vehicleData, setVehicleData] = useState({ rpm: 0, speed: 0, temp: 90, dtc: null });
    const [messages, setMessages] = useState([
        { sender: "ai", text: "Hello. I am GLYTCH AI. I am monitoring your vehicle telemetry in real-time. How can I assist you today?" }
    ]);
    const [inputText, setInputText] = useState("");
    const [isCritical, setIsCritical] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const chatEndRef = useRef(null);

    // Auto-scroll chat
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isTyping]);

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
        setIsTyping(true);

        try {
            const res = await axios.post("http://127.0.0.1:8000/api/analyze", {
                query: query,
                vehicle_data: vehicleData
            });
            setIsTyping(false);

            addMessage("ai", res.data.analysis);
            if (res.data.steps?.length > 0) addMessage("ai", "**Recommended Actions:**\n" + res.data.steps.join("\n"));
            if (res.data.booking_status) addMessage("ai", "📅 **Service Update:** " + res.data.booking_status);
        } catch (err) {
            setIsTyping(false);
            addMessage("ai", "I'm having trouble connecting to the neural core. Please try again.");
        }
    };

    const handleCallAssist = async () => {
        addMessage("system", "🔄 Initiating Voice Uplink...");
        try {
            await axios.post("http://127.0.0.1:8000/api/voice-test");
            addMessage("system", "📞 Voice Call Dispatched! (Check Backend)");
        } catch (err) {
            addMessage("ai", "❌ Error: Could not connect to Voice Service.");
        }
    };

    return (
        <div className="min-h-screen bg-[#09090b] text-white p-6 font-sans relative overflow-hidden selection:bg-indigo-500/30">

            {/* Background Glow */}
            <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[150px] pointer-events-none"></div>

            {/* HEADER */}
            <header className="relative z-10 flex justify-between items-center mb-6 px-2">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center font-bold italic text-white shadow-lg shadow-indigo-500/20">G</div>
                    <h1 className="text-xl font-semibold tracking-tight text-slate-200">GLYTCH <span className="text-slate-600 font-light">AUTOSYNC</span></h1>
                </div>
                <div className="flex gap-3">
                    <div className="flex items-center gap-2 bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/20 text-[10px] font-bold text-emerald-400">
                        <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></div>
                        ONLINE
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative z-10">

                {/* LEFT PANEL: COMMAND CENTER (Takes 7 columns) */}
                <div className="lg:col-span-7 flex flex-col gap-6">

                    {/* --- FIXED SIDE-BY-SIDE VISUALS --- */}
                    {/* grid-cols-2 ensures they are strictly side-by-side */}
                    <div className="grid grid-cols-2 gap-4 h-[380px]">

                        {/* 1. 3D DIGITAL TWIN (Left) */}
                        <div className="relative h-full w-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-800 to-[#050505] rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
                            <Car3D />
                        </div>

                        {/* 2. 2D SCHEMATIC (Right) */}
                        <div className="relative h-full w-full bg-slate-900/50 backdrop-blur-sm rounded-2xl p-1 border border-white/10 shadow-2xl flex flex-col justify-center overflow-hidden">
                            <div className={`absolute inset-0 opacity-10 pointer-events-none transition-colors duration-500 ${isCritical ? 'bg-red-500' : 'bg-blue-500'}`}></div>
                            <CarSchematic isCritical={isCritical} />

                            {/* Overlay Metrics */}
                            <div className="absolute bottom-4 left-4 right-4 grid grid-cols-2 gap-3">
                                <div className="bg-black/40 backdrop-blur p-2 rounded-lg border border-white/5">
                                    <div className="text-[9px] text-slate-500 uppercase font-mono">RPM</div>
                                    <div className="text-lg font-mono text-indigo-400 font-bold">{vehicleData.rpm}</div>
                                </div>
                                <div className={`bg-black/40 backdrop-blur p-2 rounded-lg border border-white/5 transition-colors ${isCritical ? 'border-red-500/50' : ''}`}>
                                    <div className="text-[9px] text-slate-500 uppercase font-mono">TEMP</div>
                                    <div className={`text-lg font-mono font-bold ${isCritical ? "text-red-400" : "text-emerald-400"}`}>{vehicleData.temp}°C</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ACTION BUTTONS (Updated to 3 Columns to fit the new button) */}
                    <div className="grid grid-cols-3 gap-4">
                        <button
                            onClick={handleCallAssist}
                            className="group bg-slate-800 hover:bg-indigo-600 border border-slate-700 hover:border-indigo-400 p-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-3 shadow-lg"
                        >
                            <Phone className="w-5 h-5 text-indigo-400 group-hover:text-white" />
                            <div className="text-left">
                                <div className="text-[10px] text-slate-400 group-hover:text-indigo-100">PRIORITY</div>
                                <div className="font-bold text-sm text-slate-200 group-hover:text-white">Call Assist</div>
                            </div>
                        </button>

                        <button
                            onClick={() => navigate('/booking')} // Updated to go to Portal
                            className="group bg-slate-800 hover:bg-amber-600 border border-slate-700 hover:border-amber-400 p-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-3 shadow-lg"
                        >
                            <Wrench className="w-5 h-5 text-amber-400 group-hover:text-white" />
                            <div className="text-left">
                                <div className="text-[10px] text-slate-400 group-hover:text-amber-100">MAINTENANCE</div>
                                <div className="font-bold text-sm text-slate-200 group-hover:text-white">Book Slot</div>
                            </div>
                        </button>

                        {/* NEW BUTTON: PREDICT MAINTENANCE */}
                        <button
                            onClick={() => navigate('/predict')}
                            className="group bg-slate-800 hover:bg-cyan-600 border border-slate-700 hover:border-cyan-400 p-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-3 shadow-lg"
                        >
                            <Activity className="w-5 h-5 text-cyan-400 group-hover:text-white" />
                            <div className="text-left">
                                <div className="text-[10px] text-slate-400 group-hover:text-cyan-100">AI ANALYSIS</div>
                                <div className="font-bold text-sm text-slate-200 group-hover:text-white">Predict Maint.</div>
                            </div>
                        </button>
                    </div>
                </div>

                {/* RIGHT PANEL: MODERN AI CHAT (Takes 5 columns) */}
                <div className="lg:col-span-5 h-[600px]">
                    <div className="h-full bg-[#0c0c0e] rounded-2xl border border-white/10 flex flex-col shadow-2xl overflow-hidden relative">

                        {/* Chat Header */}
                        <div className="p-4 border-b border-white/5 bg-white/[0.02] backdrop-blur flex justify-between items-center z-10">
                            <div className="flex items-center gap-2">
                                <div className="text-indigo-400 font-bold text-lg">✦</div>
                                <span className="font-medium text-sm text-slate-200">AutoSYNC Assistant</span>
                            </div>
                            <span className="text-[10px] bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded border border-indigo-500/20">Beta 2.0</span>
                        </div>

                        {/* Chat Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-thin scrollbar-thumb-slate-800">
                            {messages.map((msg, idx) => (
                                <div key={idx} className={`flex gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                                    {/* Avatar */}
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold ${msg.sender === 'ai' ? 'bg-indigo-600 text-white' :
                                        msg.sender === 'system' ? 'bg-red-900/50 text-red-200' : 'bg-slate-700 text-slate-300'
                                        }`}>
                                        {msg.sender === 'ai' ? 'AI' : msg.sender === 'system' ? '!' : 'U'}
                                    </div>

                                    {/* Message Text */}
                                    <div className={`flex flex-col max-w-[85%] ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                                        <div className={`text-[10px] mb-1 text-slate-500 uppercase font-mono`}>
                                            {msg.sender === 'ai' ? 'GLYTCH AI' : msg.sender === 'system' ? 'SYSTEM' : 'YOU'}
                                        </div>
                                        <div className={`text-sm leading-relaxed whitespace-pre-wrap ${msg.sender === 'user' ? 'bg-slate-800 p-3 rounded-2xl rounded-tr-sm text-slate-200' :
                                            msg.sender === 'system' ? 'text-red-300 bg-red-900/10 p-3 rounded-lg border border-red-500/20' :
                                                'text-slate-300'
                                            }`}>
                                            {msg.text}
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {/* Typing Animation */}
                            {isTyping && (
                                <div className="flex gap-3">
                                    <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center flex-shrink-0 text-white text-xs font-bold">AI</div>
                                    <div className="flex items-center gap-1 h-8">
                                        <div className="w-1.5 h-1.5 bg-slate-600 rounded-full animate-bounce"></div>
                                        <div className="w-1.5 h-1.5 bg-slate-600 rounded-full animate-bounce delay-100"></div>
                                        <div className="w-1.5 h-1.5 bg-slate-600 rounded-full animate-bounce delay-200"></div>
                                    </div>
                                </div>
                            )}
                            <div ref={chatEndRef} />
                        </div>

                        {/* Input Area */}
                        <div className="p-4 bg-gradient-to-t from-[#0c0c0e] to-transparent">
                            <div className="relative group">
                                <input
                                    type="text"
                                    className="w-full bg-[#18181b] border border-white/10 rounded-xl px-4 py-3.5 pr-12 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all shadow-lg"
                                    placeholder="Ask anything about your car..."
                                    value={inputText}
                                    onChange={(e) => setInputText(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                                />
                                <button
                                    onClick={sendMessage}
                                    className={`absolute right-2 top-2 p-1.5 rounded-lg transition-all duration-200 ${inputText.trim()
                                        ? 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-lg shadow-indigo-500/25'
                                        : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                                        }`}
                                    disabled={!inputText.trim()}
                                >
                                    <Send className="w-4 h-4" />
                                </button>
                            </div>
                            <div className="text-center mt-2">
                                <p className="text-[10px] text-slate-600">GLYTCH AI can make mistakes. Verify critical alerts manually.</p>
                            </div>
                        </div>

                    </div>
                </div>

            </div>
        </div>
    );
};

export default Dashboard;