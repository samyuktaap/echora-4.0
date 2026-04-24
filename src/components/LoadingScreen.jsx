import React from 'react';

const LoadingScreen = () => (
  <div style={{
    minHeight: '100vh',
    background: 'var(--bg-primary)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    gap: '1.5rem',
  }}>
    <div style={{
      width: 52,
      height: 52,
      borderRadius: '12px',
      background: 'var(--gold-grad)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '1.5rem',
      boxShadow: 'var(--shadow-gold)',
      animation: 'pulse 2s ease-in-out infinite',
    }}>⚡</div>
    <div style={{ textAlign: 'center' }}>
      <div style={{
        fontFamily: 'var(--font-display)',
        fontSize: '1.3rem',
        fontWeight: 800,
        color: 'var(--text-primary)',
        marginBottom: '0.5rem',
      }}>ECHORA</div>
      <div style={{
        fontSize: '0.85rem',
        color: 'var(--text-secondary)',
      }}>Loading your volunteer network...</div>
    </div>
    <style>{`
      @keyframes pulse {
        0%, 100% { opacity: 0.6; transform: scale(1); }
        50% { opacity: 1; transform: scale(1.05); }
      }
    `}</style>
  </div>
);

export default LoadingScreen;
