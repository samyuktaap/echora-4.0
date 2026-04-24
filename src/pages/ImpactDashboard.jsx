import React, { useState } from 'react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { mockImpactStats } from '../data/mockData';

const COLORS = ['#4a72d4','#c94060','#c9a84c','#2d9e6a','#f59e0b','#2a6ab5','#9b2335','#14b8a6'];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '10px', padding: '0.75rem 1rem', boxShadow: 'var(--shadow-md)' }}>
        <p style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.25rem', fontSize: '0.85rem' }}>{label}</p>
        {payload.map((p, i) => (
          <p key={i} style={{ color: p.color, fontSize: '0.8rem' }}>{p.name}: <strong>{p.value.toLocaleString()}</strong></p>
        ))}
      </div>
    );
  }
  return null;
};

const ImpactDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const statCards = [
    { icon: '🙋', label: 'Total Volunteers', value: mockImpactStats.totalVolunteers.toLocaleString(), color: '#4a72d4', sub: '+98 this month' },
    { icon: '✅', label: 'Tasks Completed', value: mockImpactStats.tasksCompleted.toLocaleString(), color: '#2d9e6a', sub: '+472 this month' },
    { icon: '🏢', label: 'NGOs Supported', value: mockImpactStats.ngosSupported, color: '#c9a84c', sub: '+7 new NGOs' },
    { icon: '🏙️', label: 'Cities Covered', value: mockImpactStats.citiesCovered, color: '#f59e0b', sub: 'Across India' },
  ];

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Impact Dashboard</h1>
        <p className="page-subtitle">Real-time metrics of volunteer network impact</p>
      </div>

      {/* Stats */}
      <div className="grid-4 mb-4">
        {statCards.map(s => (
          <div key={s.label} className="stat-card card-hover fade-in">
            <div className="stat-icon" style={{ background: `${s.color}18` }}>
              <span>{s.icon}</span>
            </div>
            <div>
              <div className="stat-number" style={{ color: s.color }}>{s.value}</div>
              <div className="stat-label">{s.label}</div>
              <div style={{ fontSize: '0.7rem', color: s.color, marginTop: '2px' }}>↑ {s.sub}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
        {['overview', 'growth', 'skills', 'hours'].map(tab => (
          <button key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '0.5rem 1rem', borderRadius: '8px 8px 0 0', fontSize: '0.85rem', fontWeight: 600,
              border: 'none', cursor: 'pointer', transition: 'all 0.2s',
              color: activeTab === tab ? 'var(--gold-light)' : 'var(--text-muted)',
              background: activeTab === tab ? 'rgba(201,168,76,0.1)' : 'transparent',
              borderBottom: activeTab === tab ? '2px solid var(--gold-mid)' : '2px solid transparent',
            }}
          >
            {tab === 'overview' && '📊 Overview'}
            {tab === 'growth' && '📈 Growth'}
            {tab === 'skills' && '🛠️ Skills'}
            {tab === 'hours' && '⏱️ Hours'}
          </button>
        ))}
      </div>

      {/* Content */}
      {activeTab === 'overview' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          {/* Tasks vs Volunteers */}
          <div className="card">
            <div className="card-header"><h3 style={{ fontSize: '0.95rem' }}>📈 Monthly Growth</h3></div>
            <div className="card-body">
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={mockImpactStats.monthlyGrowth}>
                  <defs>
                    <linearGradient id="colorVol" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4a72d4" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#4a72d4" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorTask" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2d9e6a" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#2d9e6a" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                  <XAxis dataKey="month" stroke="var(--text-muted)" style={{ fontSize: '0.8rem' }} />
                  <YAxis stroke="var(--text-muted)" style={{ fontSize: '0.8rem' }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Area type="monotone" dataKey="volunteers" stroke="#4a72d4" fillOpacity={1} fill="url(#colorVol)" name="Volunteers" />
                  <Area type="monotone" dataKey="tasks" stroke="#2d9e6a" fillOpacity={1} fill="url(#colorTask)" name="Tasks" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Skills Distribution */}
          <div className="card">
            <div className="card-header"><h3 style={{ fontSize: '0.95rem' }}>🛠️ Top Skills</h3></div>
            <div className="card-body">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={mockImpactStats.skillDistribution} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                  <XAxis type="number" stroke="var(--text-muted)" style={{ fontSize: '0.75rem' }} />
                  <YAxis dataKey="skill" type="category" width={100} stroke="var(--text-muted)" style={{ fontSize: '0.75rem' }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="count" fill="#c9a84c" radius={[0, 8, 8, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'growth' && (
        <div className="card">
          <div className="card-header"><h3 style={{ fontSize: '0.95rem' }}>Growth Trajectory</h3></div>
          <div className="card-body">
            <ResponsiveContainer width="100%" height={400}>
              <AreaChart data={mockImpactStats.monthlyGrowth}>
                <defs>
                  <linearGradient id="volGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4a72d4" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#4a72d4" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="taskGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2d9e6a" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#2d9e6a" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                <XAxis dataKey="month" stroke="var(--text-muted)" style={{ fontSize: '0.85rem' }} />
                <YAxis stroke="var(--text-muted)" style={{ fontSize: '0.85rem' }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Area type="monotone" dataKey="volunteers" stroke="#4a72d4" fillOpacity={1} fill="url(#volGrad)" name="Active Volunteers" />
                <Area type="monotone" dataKey="tasks" stroke="#2d9e6a" fillOpacity={1} fill="url(#taskGrad)" name="Tasks Completed" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {activeTab === 'skills' && (
        <div className="card">
          <div className="card-header"><h3 style={{ fontSize: '0.95rem' }}>Skill Distribution</h3></div>
          <div className="card-body" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
            {/* Pie */}
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={mockImpactStats.skillDistribution} cx="50%" cy="50%" labelLine={false}
                    label={({ skill, count }) => `${skill}: ${count}`}
                    outerRadius={80} fill="#8884d8" dataKey="count">
                    {mockImpactStats.skillDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            {/* List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {mockImpactStats.skillDistribution.map((s, i) => (
                <div key={s.skill} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ width: 12, height: 12, borderRadius: '50%', background: COLORS[i % COLORS.length], flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.1rem' }}>{s.skill}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{s.count} volunteers</div>
                  </div>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--gold-mid)' }}>{Math.round((s.count / mockImpactStats.skillDistribution.reduce((a,b) => a + b.count, 0)) * 100)}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'hours' && (
        <div className="card">
          <div className="card-header"><h3 style={{ fontSize: '0.95rem' }}>⏱️ Total Volunteer Hours</h3></div>
          <div className="card-body">
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '2rem', marginBottom: '2rem' }}>
              <div>
                <div className="gradient-text" style={{ fontFamily: 'var(--font-display)', fontSize: '3rem', fontWeight: 800, lineHeight: 1 }}>{(mockImpactStats.hoursContributed || 18540).toLocaleString()}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '0.25rem' }}>Total Hours</div>
              </div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.8 }}>
                <strong style={{ color: 'var(--text-primary)' }}>Average per volunteer:</strong> ~15 hours<br />
                <strong style={{ color: 'var(--text-primary)' }}>Equivalent to:</strong> ~$277.5K in community value<br />
                <strong style={{ color: 'var(--text-primary)' }}>Lives impacted:</strong> 15,000+
              </div>
            </div>
            <div className="progress-bar" style={{ height: 8, marginBottom: '2rem' }}>
              <div className="progress-fill" style={{ width: '85%' }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              {[
                { label: 'Medical Outreach', hours: 4200 },
                { label: 'Education', hours: 5100 },
                { label: 'Community Service', hours: 3640 },
                { label: 'Disaster Relief', hours: 2800 },
                { label: 'Environmental', hours: 2200 },
                { label: 'Other', hours: 600 },
              ].map(c => (
                <div key={c.label} style={{ padding: '1rem', background: 'var(--bg-input)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.3rem' }}>{c.label}</div>
                  <div className="gradient-text" style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', fontWeight: 800 }}>{c.hours.toLocaleString()}</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>hours</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImpactDashboard;
