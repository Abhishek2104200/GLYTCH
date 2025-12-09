import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import ServicePortal from './pages/ServicePortal'; // <--- Import this

function App() {
  return (
    <Router>
      <Routes>
        {/* Path "/" renders the Dashboard */}
        <Route path="/" element={<Dashboard />} />

        {/* Path "/booking" renders the Service Portal */}
        <Route path="/booking" element={<ServicePortal />} />
      </Routes>
    </Router>
  );
}

export default App;