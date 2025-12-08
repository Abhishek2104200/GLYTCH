import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import ServicePortal from './pages/ServicePortal';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/booking" element={<ServicePortal />} />
      </Routes>
    </Router>
  );
}

export default App;