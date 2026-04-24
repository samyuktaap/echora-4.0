import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import VoiceAssistant from './VoiceAssistant';

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="app-layout">
      {/* Sidebar */}
      <Sidebar onClose={() => setSidebarOpen(false)} />

      {/* Main */}
      <div className="main-content">
        <Navbar onMenuClick={() => setSidebarOpen(p => !p)} />
        <Outlet />
      </div>

      {/* Voice Assistant */}
      <VoiceAssistant />

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
          zIndex: 250, backdropFilter: 'blur(2px)'
        }} onClick={() => setSidebarOpen(false)} />
      )}
    </div>
  );
};

export default Layout;
