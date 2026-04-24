import React, { useState } from 'react';
import { mockNGORequests, INDIA_STATES, SKILLS_LIST } from '../data/mockData';
import toast from 'react-hot-toast';

const UrgencyBadge = ({ urgency }) => (
  <span className={`badge urgency-${urgency.toLowerCase()}`}>
    {urgency === 'High' ? '🔴' : urgency === 'Medium' ? '🟡' : '🟢'} {urgency}
  </span>
);

const TaskBoard = () => {
  const [filterUrgency, setFilterUrgency] = useState('');
  const [filterState, setFilterState] = useState('');
  const [filterSkill, setFilterSkill] = useState('');
  const [search, setSearch] = useState('');
  const [applied, setApplied] = useState(new Set());
  const [expandedId, setExpandedId] = useState(null);
  const [sortBy, setSortBy] = useState('newest');

  const filtered = mockNGORequests.filter(t => {
    const matchUrgency = !filterUrgency || t.urgency === filterUrgency;
    const matchState = !filterState || t.state === filterState;
    const matchSkill = !filterSkill || t.requiredSkills?.includes(filterSkill);
    const matchSearch = !search || 
      t.ngoName.toLowerCase().includes(search.toLowerCase()) || 
      t.taskDescription.toLowerCase().includes(search.toLowerCase()) ||
      t.location.toLowerCase().includes(search.toLowerCase());
    return matchUrgency && matchState && matchSkill && matchSearch;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
    if (sortBy === 'urgent') {
      const urgencyMap = { 'High': 0, 'Medium': 1, 'Low': 2 };
      return urgencyMap[a.urgency] - urgencyMap[b.urgency];
    }
    return 0;
  });

  const handleApply = (taskId) => {
    if (applied.has(taskId)) { toast.error('Already applied'); return; }
    setApplied(prev => new Set([...prev, taskId]));
    toast.success('✓ Applied successfully! NGO will contact you. +25 pts earned');
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Task Board</h1>
        <p className="page-subtitle">Browse verified volunteer opportunities across India</p>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <div className="search-input-wrapper" style={{ flex: 1, minWidth: 200 }}>
          <span className="search-icon">🔍</span>
          <input className="form-input" placeholder="Search NGOs, tasks, locations…" value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: '2.4rem', fontSize: '0.82rem' }} />
        </div>
        <select className="form-select" value={filterUrgency} onChange={e => setFilterUrgency(e.target.value)} style={{ maxWidth: 140, fontSize: '0.82rem' }}>
          <option value="">All Urgencies</option>
          <option value="High">🔴 High</option>
          <option value="Medium">🟡 Medium</option>
          <option value="Low">🟢 Low</option>
        </select>
        <select className="form-select" value={filterState} onChange={e => setFilterState(e.target.value)} style={{ maxWidth: 140, fontSize: '0.82rem' }}>
          <option value="">All States</option>
          {INDIA_STATES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <select className="form-select" value={filterSkill} onChange={e => setFilterSkill(e.target.value)} style={{ maxWidth: 140, fontSize: '0.82rem' }}>
          <option value="">All Skills</option>
          {SKILLS_LIST.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <select className="form-select" value={sortBy} onChange={e => setSortBy(e.target.value)} style={{ maxWidth: 130, fontSize: '0.82rem' }}>
          <option value="newest">Newest</option>
          <option value="urgent">Most Urgent</option>
        </select>
        <span className="badge badge-gray">{sorted.length} tasks</span>
      </div>

      {/* Results */}
      {sorted.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <div className="empty-icon">🔍</div>
            <p>No tasks match your filters. Try adjusting your search.</p>
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {sorted.map(task => (
            <div key={task.id} className="card card-hover">
              <div className="card-body">
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
                      <h3 style={{ fontSize: '1.05rem', fontWeight: 700, fontFamily: 'var(--font-display)' }}>{task.ngoName}</h3>
                      <UrgencyBadge urgency={task.urgency} />
                    </div>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '0.75rem', lineHeight: 1.6 }}>{task.taskDescription}</p>
                    <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
                      <span className="badge badge-gray">📍 {task.location}, {task.state}</span>
                      <span className="badge badge-gray">📅 Posted {task.createdAt}</span>
                      {task.requiredSkills?.map(s => <span key={s} className="badge badge-primary">{s}</span>)}
                    </div>
                    {expandedId === task.id && (
                      <div style={{ marginTop: '1rem', padding: '1rem 0', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)' }}>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.8 }}>
                          <strong style={{ color: 'var(--text-primary)' }}>About this opportunity:</strong><br />
                          This is a {task.urgency.toLowerCase()} urgency task at {task.ngoName}. You'll be working with dedicated team members on meaningful community impact.
                          <br /><br />
                          <strong style={{ color: 'var(--text-primary)' }}>Requirements:</strong> {task.requiredSkills?.join(', ')}<br />
                          <strong style={{ color: 'var(--text-primary)' }}>Location:</strong> {task.location}, {task.state}<br />
                          <strong style={{ color: 'var(--text-primary)' }}>Points if accepted:</strong> <span style={{ color: 'var(--gold-mid)' }}>+25 pts</span>
                        </div>
                      </div>
                    )}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flexShrink: 0 }}>
                    <button
                      onClick={() => setExpandedId(expandedId === task.id ? null : task.id)}
                      className="btn btn-secondary btn-sm"
                    >
                      {expandedId === task.id ? '^ Details' : 'Details'}
                    </button>
                    <button
                      onClick={() => handleApply(task.id)}
                      className={`btn btn-sm ${applied.has(task.id) ? 'btn-secondary' : 'btn-primary'}`}
                      disabled={applied.has(task.id)}
                    >
                      {applied.has(task.id) ? '✓ Applied' : 'Apply'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TaskBoard;
