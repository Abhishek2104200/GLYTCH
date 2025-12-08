import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, User, Phone, Mail, MapPin, Car, Clock, Search } from 'lucide-react';

const ServicePortal = () => {
  // Mock Data for the Demo (Simulating the CSV)
  const mockDatabase = {
    "TN-01-AB-1234": [
      { date: "2023-10-15", time: "10:00 AM", status: "Completed", service: "General Service" },
      { date: "2023-12-01", time: "02:30 PM", status: "Upcoming", service: "Brake Inspection" }
    ]
  };

  const [regNumber, setRegNumber] = useState("");
  const [history, setHistory] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = () => {
    setLoading(true);
    // Simulate API delay
    setTimeout(() => {
      const data = mockDatabase[regNumber] || [];
      setHistory(data);
      setLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-white font-sans text-gray-800">
      
      {/* --- HEADER (Replicating Honda Style) --- */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            {/* Honda Logo Placeholder Text */}
            <div className="text-red-600 font-black text-3xl italic tracking-tighter">HONDA</div>
            <div className="hidden md:block h-8 w-px bg-gray-300"></div>
            <div className="hidden md:block text-xs font-bold text-gray-500 uppercase tracking-widest">
              The Power of Dreams
            </div>
          </div>
          
          <nav className="flex items-center gap-6 text-sm font-medium text-gray-600">
            <span className="hidden md:inline hover:text-red-600 cursor-pointer">Virtual Showroom</span>
            <span className="hidden md:inline hover:text-red-600 cursor-pointer">Cars</span>
            <span className="text-red-600 font-bold border-b-2 border-red-600 pb-1">Service</span>
            <Link to="/" className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition text-xs uppercase tracking-wide">
              Exit to Dashboard
            </Link>
          </nav>
        </div>
      </header>

      {/* --- MAIN CONTENT --- */}
      <main className="max-w-6xl mx-auto px-6 py-12">
        
        {/* Title Section */}
        <div className="mb-10 relative">
          <h1 className="text-4xl font-light text-black mb-2">Book A Service</h1>
          <p className="text-gray-500 text-lg font-light">Keep your car running smoothly</p>
          <div className="w-20 h-1 bg-red-600 mt-4"></div>
          
          {/* Decorative Blur */}
          <div className="absolute -top-10 -left-20 w-64 h-64 bg-red-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* LEFT: THE FORM (Replicated from Screenshot) */}
          <div className="lg:col-span-2 space-y-10">
            
            {/* Section 1: Customer Details */}
            <section>
              <h3 className="text-lg font-bold text-black mb-6 flex items-center gap-2">
                Customer Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="group">
                  <label className="text-xs font-bold text-gray-400 uppercase mb-1 block group-focus-within:text-red-600">Name</label>
                  <div className="flex items-center border-b border-gray-300 py-2 group-focus-within:border-red-600 transition">
                    <User size={18} className="text-gray-400 mr-3" />
                    <input type="text" className="w-full outline-none text-gray-700 placeholder-gray-300" placeholder="Enter full name" />
                  </div>
                </div>
                <div className="group">
                  <label className="text-xs font-bold text-gray-400 uppercase mb-1 block group-focus-within:text-red-600">Mobile Number</label>
                  <div className="flex items-center border-b border-gray-300 py-2 group-focus-within:border-red-600 transition">
                    <Phone size={18} className="text-gray-400 mr-3" />
                    <input type="text" className="w-full outline-none text-gray-700 placeholder-gray-300" placeholder="+91 XXXXX XXXXX" />
                  </div>
                </div>
                <div className="group md:col-span-2">
                  <label className="text-xs font-bold text-gray-400 uppercase mb-1 block group-focus-within:text-red-600">Email ID</label>
                  <div className="flex items-center border-b border-gray-300 py-2 group-focus-within:border-red-600 transition">
                    <Mail size={18} className="text-gray-400 mr-3" />
                    <input type="email" className="w-full outline-none text-gray-700 placeholder-gray-300" placeholder="yourname@example.com" />
                  </div>
                </div>
              </div>
            </section>

            {/* Section 2: Vehicle Details (With the Special Logic) */}
            <section>
              <h3 className="text-lg font-bold text-black mb-6 flex items-center gap-2">
                Vehicle Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="group">
                  <label className="text-xs font-bold text-gray-400 uppercase mb-1 block group-focus-within:text-red-600">Select Model</label>
                  <div className="flex items-center border-b border-gray-300 py-2 group-focus-within:border-red-600 transition">
                    <Car size={18} className="text-gray-400 mr-3" />
                    <select className="w-full outline-none text-gray-700 bg-transparent">
                      <option>Select Model</option>
                      <option>Honda City</option>
                      <option>Honda Amaze</option>
                      <option>Honda Elevate</option>
                    </select>
                  </div>
                </div>

                {/* THE MAGIC FIELD (Registration Number) */}
                <div className="group relative">
                  <label className="text-xs font-bold text-gray-400 uppercase mb-1 block group-focus-within:text-red-600">Vehicle Registration Number</label>
                  <div className="flex items-center border-b border-gray-300 py-2 group-focus-within:border-red-600 transition">
                    <input 
                      type="text" 
                      value={regNumber}
                      onChange={(e) => setRegNumber(e.target.value)}
                      className="w-full outline-none text-gray-700 placeholder-gray-300 uppercase font-mono" 
                      placeholder="TN-01-AB-1234" 
                    />
                    {/* The "View Slots" Button inside the input */}
                    <button 
                      onClick={handleSearch}
                      className="bg-red-50 hover:bg-red-100 text-red-600 px-3 py-1 rounded text-xs font-bold transition flex items-center gap-2"
                    >
                      <Search size={12} />
                      CHECK HISTORY
                    </button>
                  </div>
                  <p className="text-[10px] text-red-500 mt-1 flex items-center gap-1">
                    ⚠ Vehicle Registration Number is required for history
                  </p>
                </div>
              </div>
            </section>

            {/* Submit Button */}
            <div className="pt-6">
              <button className="bg-red-500 hover:bg-red-600 text-white font-bold py-4 px-12 rounded-full shadow-lg shadow-red-200 transition-transform transform hover:-translate-y-1 w-full md:w-auto">
                SUBMIT BOOKING REQUEST
              </button>
            </div>

          </div>

          {/* RIGHT: THE HISTORY PANEL (The New Feature) */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 border border-gray-100 rounded-2xl p-6 sticky top-24 shadow-sm">
              <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Clock size={18} className="text-red-600" />
                Service History
              </h4>
              
              {!history && !loading && (
                <div className="text-center py-10 text-gray-400 text-sm">
                  <Car size={40} className="mx-auto mb-3 opacity-20" />
                  <p>Enter Registration Number to view past and upcoming slots.</p>
                </div>
              )}

              {loading && (
                <div className="text-center py-10 text-gray-400">
                  <div className="animate-spin w-6 h-6 border-2 border-red-600 border-t-transparent rounded-full mx-auto mb-2"></div>
                  <p className="text-xs">Searching Database...</p>
                </div>
              )}

              {history && history.length === 0 && (
                <div className="text-center py-10 text-gray-500 text-sm">
                  <p>No records found for <span className="font-mono font-bold text-black">{regNumber}</span></p>
                </div>
              )}

              {history && history.length > 0 && (
                <div className="space-y-4">
                  {history.map((slot, index) => (
                    <div key={index} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm relative overflow-hidden">
                      <div className={`absolute top-0 left-0 w-1 h-full ${slot.status === 'Completed' ? 'bg-green-500' : 'bg-blue-500'}`}></div>
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-bold text-sm text-gray-800">{slot.service}</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full ${slot.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                          {slot.status}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 flex items-center gap-4">
                        <span className="flex items-center gap-1"><Calendar size={12}/> {slot.date}</span>
                        <span className="flex items-center gap-1"><Clock size={12}/> {slot.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default ServicePortal;