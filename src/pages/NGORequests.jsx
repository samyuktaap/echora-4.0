import React, { useState } from 'react';
import toast from 'react-hot-toast';

const NGORequests = () => {
  const [requests, setRequests] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('ngo_requests') || '[]');
    } catch {
      return [];
    }
  });
  const [filterStatus, setFilterStatus] = useState('all');
  const [expandedId, setExpandedId] = useState(null);

  const filtered = requests.filter(r => {
    if (filterStatus === 'pending') return !r.approved;
    if (filterStatus === 'approved') return r.approved;
    return true;
  });

  const handleApprove = (id) => {
    const updated = requests.map(r => r.id === id ? { ...r, approved: true } : r);
    setRequests(updated);
    localStorage.setItem('ngo_requests', JSON.stringify(updated));
    toast.success('Request approved and is now live!');
  };

  const handleDelete = (id) => {
    const updated = requests.filter(r => r.id !== id);
    setRequests(updated);
    localStorage.setItem('ngo_requests', JSON.stringify(updated));
    toast.success('Request removed');
  };

  const formatDate = (dateStr) => {
    try {
      return new Date(dateStr).toLocaleDateString('en-IN');
    } catch {
      return 'N/A';
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">NGO Task Requests</h1>
        <p className="page-subtitle">View all submitted volunteer opportunities</p>
      </div>

      {/* Filter */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
        {[
          { label: 'All Requests', val: 'all' },
          { label: 'Pending Review', val: 'pending' },
          { label: 'Live', val: 'approved' },
        ].map(f => (
          <button key={f.val}
            onClick={() => setFilterStatus(f.val)}
            style={{
              padding: '0.4rem 1rem', borderRadius: '20px', border: '1.5px solid',
              fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer',
              borderColor: filterStatus === f.val ? 'var(--gold-mid)' : 'var(--border-color)',
              background: filterStatus === f.val ? 'rgba(201,168,76,0.1)' : 'var(--bg-input)',
              color: filterStatus === f.val ? 'var(--gold-light)' : 'var(--text-secondary)',
            }}
          >{f.label}</button>
        ))}
        <span className="badge badge-gray">{filtered.length} requests</span>
      </div>

      {/* Requests */}
      {filtered.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <div className="empty-icon">📋</div>
            <p>No {filterStatus === 'pending' ? 'pending' : filterStatus === 'approved' ? 'live' : ''} requests</p>
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {filtered.map(req => (
            <div key={req.id} className="card card-hover">
              <div className="card-body">
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '0.3rem' }}>
                      <h3 style={{ fontSize: '1.05rem', fontWeight: 700, fontFamily: 'var(--font-display)' }}>{req.ngoName}</h3>
                      {req.approved ? (
                        <span className="badge badge-success">✓ Live</span>
                      ) : (
                        <span className="badge badge-warning">⏳ Pending Review</span>
                      )}
                    </div>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>{req.taskDescription}</p>
                    <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
                      <span className="badge badge-gray">📍 {req.location}{req.state ? `, ${req.state}` : ''}</span>
                      <span className="badge badge-gray">📅 {formatDate(req.submittedAt)}</span>
                      {req.taskDate && <span className="badge badge-gray">📆 Start: {req.taskDate}</span>}
                    </div>
                    {req.requiredSkills?.length > 0 && (
                      <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap' }}>
                        {req.requiredSkills.map(s => <span key={s} className="badge badge-primary">{s}</span>)}
                      </div>
                    )}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flexShrink: 0 }}>
                    {!req.approved && (
                      <button onClick={() => handleApprove(req.id)} className="btn btn-primary btn-sm">Approve</button>
                    )}
                    <button
                      onClick={() => setExpandedId(expandedId === req.id ? null : req.id)}
                      className="btn btn-secondary btn-sm"
                    >
                      {expandedId === req.id ? '^ Details' : 'Details'}
                    </button>
                    <button onClick={() => handleDelete(req.id)} className="btn btn-danger btn-sm">Delete</button>
                  </div>
                </div>

                {expandedId === req.id && (
                  <div style={{ marginTop: '1rem', padding: '1rem 0', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', fontSize: '0.85rem' }}>
                      {req.email && <div>
                        <strong style={{ color: 'var(--text-primary)' }}>Email:</strong>
                        <div style={{ color: 'var(--text-secondary)' }}>{req.email}</div>
                      </div>}
                      {req.phone && <div>
                        <strong style={{ color: 'var(--text-primary)' }}>Phone:</strong>
                        <div style={{ color: 'var(--text-secondary)' }}>{req.phone}</div>
                      </div>}
                      {req.ngoRegistration && <div>
                        <strong style={{ color: 'var(--text-primary)' }}>Registration:</strong>
                        <div style={{ color: 'var(--text-secondary)' }}>{req.ngoRegistration}</div>
                      </div>}
                    </div>
                    {req.additionalInfo && (
                      <div style={{ marginTop: '1rem' }}>
                        <strong style={{ color: 'var(--text-primary)', display: 'block', marginBottom: '0.3rem' }}>Additional Info:</strong>
                        <div style={{ color: 'var(--text-secondary)', whiteSpace: 'pre-wrap' }}>{req.additionalInfo}</div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Help section */}
      <div className="card" style={{ marginTop: '2rem', background: 'var(--bg-input)', border: '1px dashed var(--border-color)' }}>
        <div className="card-body">
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.75rem', fontFamily: 'var(--font-display)' }}>Want to add a new opportunity?</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1rem' }}>Go to Submit Request page to post a new volunteer opportunity for your NGO.</p>
          <a href="/ngo-form" style={{ color: 'var(--gold-mid)', fontWeight: 600, textDecoration: 'none' }}>Post a new opportunity →</a>
        </div>
      </div>
    </div>
  );
};

export default NGORequests;
