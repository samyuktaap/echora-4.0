import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import VoiceAssistant from './VoiceAssistant';

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="app-layout" style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>

      {/* Sidebar — fixed on desktop, drawer on mobile */}
      <div style={{
        position: 'fixed',
        left: 0, top: 0, bottom: 0,
        zIndex: 300,
        transform: isMobile ? (sidebarOpen ? 'translateX(0)' : 'translateX(-100%)') : 'translateX(0)',
        transition: 'transform 0.3s cubic-bezier(0.4,0,0.2,1)',
        width: 'var(--sidebar-width)',
      }}>
        <Sidebar onClose={() => setSidebarOpen(false)} />
      </div>

      {/* Main content */}
      <div className="main-content" style={{
        marginLeft: isMobile ? 0 : 'var(--sidebar-width)',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        transition: 'margin-left 0.3s ease'
      }}>
        <Navbar onMenuClick={() => setSidebarOpen(p => !p)} />
        <main style={{
          flex: 1,
          padding: isMobile ? '1rem' : 'var(--spacing-xl)',
          background: 'var(--bg-primary)',
          position: 'relative'
        }}>
          <Outlet />
        </main>
      </div>

      {/* Voice Assistant */}
      <VoiceAssistant />

      {/* Mobile sidebar overlay */}
      {sidebarOpen && isMobile && (
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
