import React, { useState } from 'react';
import axios from 'axios';
import { Calendar, CheckCircle, Clock } from 'lucide-react';

const ServicePortal = () => {
    const [regNumber, setRegNumber] = useState("TN-01-AB-1234"); // Default for demo
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchHistory = async () => {
        setLoading(true);
        try {
            // Fetch from our new Backend Endpoint
            const res = await axios.get(`http://127.0.0.1:8000/api/service-history/${regNumber}`);
            setHistory(res.data);
        } catch (err) {
            console.error("Failed to fetch history", err);
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-gray-50 text-slate-800 font-sans">
            {/* Navbar */}
            <nav className="bg-white shadow-sm border-b border-gray-200 px-8 py-4 flex justify-between items-center">
                <div className="text-2xl font-bold text-red-600 tracking-tighter">HONDA <span className="text-slate-600 text-sm font-normal">SERVICE CONNECT</span></div>
                <a href="/" className="text-blue-600 hover:underline text-sm">Back to Dashboard</a>
            </nav>

            <div className="max-w-4xl mx-auto p-8 mt-8">
                <h1 className="text-3xl font-light mb-2">Service Booking History</h1>
                <p className="text-gray-500 mb-8">View past maintenance and upcoming scheduled repairs.</p>

                {/* Search Box */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex gap-4 items-end mb-8">
                    <div className="flex-1">
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Vehicle Registration Number</label>
                        <input
                            type="text"
                            value={regNumber}
                            onChange={(e) => setRegNumber(e.target.value)}
                            className="w-full text-lg border-b-2 border-gray-300 focus:border-red-600 outline-none py-2 bg-transparent"
                        />
                    </div>
                    <button
                        onClick={fetchHistory}
                        className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded font-semibold transition"
                    >
                        {loading ? "Loading..." : "View Records"}
                    </button>
                </div>

                {/* Results Table */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-semibold">
                            <tr>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4">Time</th>
                                <th className="px-6 py-4">Service Status</th>
                                <th className="px-6 py-4">Vehicle</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {history.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="px-6 py-8 text-center text-gray-400 italic">
                                        No records found. Click "View Records" to search.
                                    </td>
                                </tr>
                            ) : (
                                history.map((slot, idx) => (
                                    <tr key={idx} className="hover:bg-gray-50 transition">
                                        <td className="px-6 py-4 flex items-center gap-2">
                                            <Calendar className="w-4 h-4 text-gray-400" /> {slot.Date}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <Clock className="w-4 h-4 text-gray-400" /> {slot.Time}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${slot.Status === 'COMPLETED' ? 'bg-green-100 text-green-700' :
                                                slot.Status === 'BOOKED' ? 'bg-blue-100 text-blue-700' :
                                                    'bg-gray-100 text-gray-600'
                                                }`}>
                                                {slot.Status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 font-mono text-sm">{slot.VehicleReg}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ServicePortal;