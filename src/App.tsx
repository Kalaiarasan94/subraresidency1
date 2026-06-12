import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { CustomerPortal } from './portals/CustomerPortal';
import { ReceptionPortal } from './portals/ReceptionPortal';
import { AdminPortal } from './portals/AdminPortal';

function App() {
  return (
    <Routes>
      {/* Customer Portal - Public Website */}
      <Route path="/*" element={<CustomerPortal />} />
      
      {/* Reception Portal - Staff Only */}
      <Route path="/reception/*" element={<ReceptionPortal />} />
      
      {/* Admin Portal - Executive Command Center */}
      <Route path="/admin/*" element={<AdminPortal />} />
      
      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
