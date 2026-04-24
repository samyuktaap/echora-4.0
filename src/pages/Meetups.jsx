import React, { useState } from 'react';
import { mockMeetups, INDIA_STATES } from '../data/mockData';
import toast from 'react-hot-toast';

const Meetups = () => {
  const [filterState, setFilterState] = useState('');
  const [registered, setRegistered] = useState(new Set());
  const [expandedId, setExpandedId] = useState(null);

  const filtered = mockMeetups.filter(m => !filterState || m.state === filterState);

  const handleRegister = (meetupId) => {
    if (registered.has(meetupId)) { toast.error('Already registered'); return; }
    setRegistered(prev => new Set([...prev, meetupId]));
    toast.success('Registered! See you there. +15 pts earned');
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Weekend Meetups</h1>
        <p className="page-subtitle">Connect with volunteers & NGOs in person across India</p>
      </div>

      {/* Filter */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <select className="form-select" value={filterState} onChange={e => setFilterState(e.target.value)} style={{ maxWidth: 200, fontSize: '0.82rem' }}>
          <option value="">All States</option>
          {INDIA_STATES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <span className="badge badge-gray">{filtered.length} meetups</span>
      </div>

      {/* Meetups */}
      {filtered.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <div className="empty-icon">📍</div>
            <p>No meetups in this state yet. Check back soon!</p>
          </div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.25rem' }}>
          {filtered.map(m => (
            <div key={m.id} className="card card-hover">
              {/* Image placeholder */}
              <div style={{
                height: 180, background: 'linear-gradient(135deg, rgba(74,114,212,0.2) 0%, rgba(201,168,76,0.1) 100%)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem', color: 'var(--text-muted)', overflow: 'hidden'
              }}>
                🤝
              </div>
              <div className="card-body">
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.5rem', fontFamily: 'var(--font-display)' }}>{m.name}</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginBottom: '1rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  <div>📅 {m.date}</div>
                  <div>📍 {m.location}</div>
                  <div>👥 {m.attendees} going</div>
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1rem' }}>{m.description}</p>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    onClick={() => setExpandedId(expandedId === m.id ? null : m.id)}
                    className="btn btn-secondary btn-sm"
                    style={{ flex: 1 }}
                  >
                    {expandedId === m.id ? '^ Details' : 'Details'}
                  </button>
                  <button
                    onClick={() => handleRegister(m.id)}
                    className={`btn btn-sm ${registered.has(m.id) ? 'btn-secondary' : 'btn-primary'}`}
                    disabled={registered.has(m.id)}
                    style={{ flex: 1 }}
                  >
                    {registered.has(m.id) ? '✓ Registered' : 'Register'}
                  </button>
                </div>
                {expandedId === m.id && (
                  <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)', fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.8 }}>
                    <strong style={{ color: 'var(--text-primary)' }}>About this meetup:</strong><br />
                    {m.description}<br /><br />
                    <strong style={{ color: 'var(--text-primary)' }}>When:</strong> {m.date}<br />
                    <strong style={{ color: 'var(--text-primary)' }}>Where:</strong> {m.location}<br />
                    <strong style={{ color: 'var(--text-primary)' }}>Attendees so far:</strong> <span style={{ color: 'var(--gold-mid)' }}>{m.attendees}</span><br />
                    <strong style={{ color: 'var(--text-primary)' }}>Registration bonus:</strong> <span style={{ color: 'var(--gold-mid)' }}>+15 pts</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Meetups;
