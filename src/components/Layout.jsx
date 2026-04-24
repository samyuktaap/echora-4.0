import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import VoiceAssistant from './VoiceAssistant';

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="app-layout" style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      {/* Sidebar */}
      <Sidebar onClose={() => setSidebarOpen(false)} />

      {/* Main */}
      <div className="main-content" style={{
        marginLeft: 'var(--sidebar-width)',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        transition: 'margin-left 0.3s ease'
      }}>
        <Navbar onMenuClick={() => setSidebarOpen(p => !p)} />
        <main style={{
          flex: 1,
          padding: 'var(--spacing-xl)',
          background: 'var(--bg-primary)',
          position: 'relative'
        }}>
          <Outlet />
        </main>
      </div>

      {/* Voice Assistant */}
      <VoiceAssistant />

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)',
          zIndex: 250, backdropFilter: 'blur(4px)',
          animation: 'fadeIn 0.2s ease'
        }} onClick={() => setSidebarOpen(false)} />
      )}
    </div>
  );
};

export default Layout;
