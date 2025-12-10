import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import ServicePortal from './pages/ServicePortal';
import PredictiveMaintenance from './pages/PredictiveMaintenance'; // <--- 1. NEW IMPORT

function App() {
  return (
    <Router>
      <Routes>
        {/* Path "/" renders the Dashboard */}
        <Route path="/" element={<Dashboard />} />

        {/* Path "/booking" renders the Service Portal */}
        <Route path="/booking" element={<ServicePortal />} />

        {/* Path "/predict" renders the AI Maintenance Page (NEW) */}
        <Route path="/predict" element={<PredictiveMaintenance />} />
      </Routes>
    </Router>
  );
}

export default App;