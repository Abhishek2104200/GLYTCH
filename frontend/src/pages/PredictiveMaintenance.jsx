import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Activity, CheckCircle, AlertTriangle } from 'lucide-react';

const PredictiveMaintenance = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        mileage: 50000,
        vehicle_age: 5,
        reported_issues: 0,
        engine_size: 2000,
        maintenance_history: "Average"
    });
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handlePredict = async () => {
        setLoading(true);
        try {
            const res = await axios.post("http://127.0.0.1:8000/api/predict-maintenance", formData);
            setResult(res.data);
        } catch (err) {
            console.error(err);
            alert("Prediction failed. Check backend.");
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-[#09090b] text-white p-8 font-sans">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <button onClick={() => navigate('/')} className="p-2 bg-slate-800 rounded-full hover:bg-slate-700 transition">
                    <ArrowLeft className="w-5 h-5 text-slate-300" />
                </button>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                    AI Predictive Maintenance Core
                </h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">

                {/* INPUT FORM */}
                <div className="bg-slate-900/50 p-8 rounded-2xl border border-white/10 backdrop-blur-md shadow-2xl">
                    <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
                        <Activity className="w-5 h-5 text-cyan-400" /> Input Vehicle Parameters
                    </h2>

                    <div className="space-y-5">
                        <div>
                            <label className="block text-xs font-mono text-slate-400 mb-2">MILEAGE (km)</label>
                            <input type="number" name="mileage" value={formData.mileage} onChange={handleChange}
                                className="w-full bg-black/40 border border-slate-700 rounded-lg p-3 text-sm focus:border-cyan-500 outline-none" />
                        </div>
                        <div>
                            <label className="block text-xs font-mono text-slate-400 mb-2">VEHICLE AGE (Years)</label>
                            <input type="number" name="vehicle_age" value={formData.vehicle_age} onChange={handleChange}
                                className="w-full bg-black/40 border border-slate-700 rounded-lg p-3 text-sm focus:border-cyan-500 outline-none" />
                        </div>
                        <div>
                            <label className="block text-xs font-mono text-slate-400 mb-2">REPORTED ISSUES (Count)</label>
                            <input type="number" name="reported_issues" value={formData.reported_issues} onChange={handleChange}
                                className="w-full bg-black/40 border border-slate-700 rounded-lg p-3 text-sm focus:border-cyan-500 outline-none" />
                        </div>
                        <div>
                            <label className="block text-xs font-mono text-slate-400 mb-2">MAINTENANCE HISTORY</label>
                            <select name="maintenance_history" value={formData.maintenance_history} onChange={handleChange}
                                className="w-full bg-black/40 border border-slate-700 rounded-lg p-3 text-sm focus:border-cyan-500 outline-none text-white">
                                <option value="Good">Good</option>
                                <option value="Average">Average</option>
                                <option value="Poor">Poor</option>
                            </select>
                        </div>

                        <button onClick={handlePredict} disabled={loading}
                            className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-cyan-500/20 transition-all active:scale-95 disabled:opacity-50 mt-4">
                            {loading ? "ANALYZING NEURAL NETWORK..." : "RUN PREDICTION"}
                        </button>
                    </div>
                </div>

                {/* RESULTS PANEL */}
                <div className="flex flex-col justify-center items-center">
                    {result ? (
                        <div className={`text-center p-10 rounded-3xl border-2 ${result.color === 'red' ? 'bg-red-900/20 border-red-500' : 'bg-emerald-900/20 border-emerald-500'} animation-fade-in`}>
                            {result.color === 'red' ?
                                <AlertTriangle className="w-20 h-20 text-red-500 mx-auto mb-4 animate-bounce" /> :
                                <CheckCircle className="w-20 h-20 text-emerald-500 mx-auto mb-4" />
                            }

                            <h2 className="text-3xl font-bold mb-2">{result.status}</h2>
                            <div className="text-6xl font-mono font-black tracking-tighter my-4">
                                {result.probability}%
                            </div>
                            <p className="text-slate-400 uppercase tracking-widest text-xs">Failure Probability</p>
                        </div>
                    ) : (
                        <div className="text-center text-slate-600">
                            <Activity className="w-16 h-16 mx-auto mb-4 opacity-20" />
                            <p>Awaiting Data for Analysis...</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PredictiveMaintenance;