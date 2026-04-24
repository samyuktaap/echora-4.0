import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { mockNGORequests, mockMeetups, mockImpactStats } from '../data/mockData';
import { CheckCircle, Star, Trophy, Handshake, MapPin, Calendar, Users, TrendingUp, Award, Target, BarChart3, Map, Navigation } from 'lucide-react';

const StatCard = ({ icon: IconComponent, label, value, color, delta }) => (
  <div className="stat-card card-hover fade-in">
    <div className="stat-icon" style={{ background: `${color}18` }}>
      <IconComponent size={24} strokeWidth={2} style={{ color }} />
    </div>
    <div>
      <div className="stat-number" style={{ color }}>{value}</div>
      <div className="stat-label">{label}</div>
      {delta && <div style={{ fontSize: '0.7rem', color: 'var(--success)', marginTop: '2px' }}>↑ {delta}</div>}
    </div>
  </div>
);

const Dashboard = () => {
  const { profile } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [greeting] = useState(() => {
    const h = new Date().getHours();
    return h < 12 ? 'greetingMorning' : h < 17 ? 'greetingAfternoon' : 'greetingEvening';
  });

  const matchedTasks = mockNGORequests.filter(req =>
    profile?.skills?.some(skill => req.requiredSkills?.includes(skill)) ||
    (profile?.state && req.state === profile?.state)
  ).slice(0, 3);

  const points = profile?.points || 0;
  const nextTier = points < 200 ? { name: 'Silver', needed: 200 } : points < 500 ? { name: 'Gold', needed: 500 } : { name: 'Platinum', needed: 1000 };
  const progress = Math.min((points / nextTier.needed) * 100, 100);

  return (
    <div className="page-container">
      {/* Hero */}
      <div className="card hero-gradient mb-4 card-gold">
        <div className="card-body" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1.5rem', flexWrap: 'wrap' }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.3rem', letterSpacing: '0.05em' }}>{t(greeting)}</div>
            <h1 style={{ fontSize: '2rem', marginBottom: '0.4rem', fontFamily: 'var(--font-display)' }}>
              {t('welcome')} <span className="gradient-text">{profile?.name?.split(' ')[0] || t('volunteerRole')}</span>
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1rem' }}>
              <MapPin size={14} strokeWidth={2} />
              <span>{profile?.location ? `${profile.location}${profile.state ? `, ${profile.state}` : ''}` : 'India'}</span>
              <span style={{ color: 'var(--text-muted)' }}>·</span>
              <span>{profile?.experience || t('beginner')} {t('volunteerRole')}</span>
              {profile?.skills?.length > 0 && (
                <>
                  <span style={{ color: 'var(--text-muted)' }}>·</span>
                  <span>{profile.skills.slice(0,3).join(', ')}</span>
                </>
              )}
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {profile?.badges?.map(b => (
                <span key={b} className="badge badge-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Award size={12} strokeWidth={2} /> {b}
                </span>
              ))}
            </div>
          </div>
          <div style={{ textAlign: 'center', flexShrink: 0 }}>
            <div className="avatar avatar-xl" style={{ margin: '0 auto 0.75rem' }}>{profile?.name?.charAt(0) || '?'}</div>
            <div className="gradient-text" style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', fontWeight: 800 }}>{points}</div>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{t('points')}</div>
            <div style={{ marginTop: '0.6rem', width: 90 }}>
              <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>{nextTier.needed - points} {t('left')} {t('to' + nextTier.name)}</div>
              <div className="progress-bar" style={{ height: 4 }}>
                <div className="progress-fill" style={{ width: `${progress}%` }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid-4 mb-4">
        <StatCard icon={CheckCircle} label={t('tasksCompleted')} value={profile?.tasksCompleted || 0} color="var(--success)" delta="+2" />
        <StatCard icon={Star} label={t('pointsEarned')} value={points} color="var(--primary-mid)" delta="+50" />
        <StatCard icon={Trophy} label={t('badgesEarned')} value={profile?.badges?.length || 1} color="var(--primary-light)" />
        <StatCard icon={Handshake} label={t('ngosHelped')} value={Math.max(1, Math.floor((profile?.tasksCompleted || 0) / 3))} color="var(--danger-light)" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
        {/* Matched Tasks */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <h2 style={{ fontSize: '1.15rem', fontFamily: 'var(--font-display)' }}>{t('tasksMatchedForYou')}</h2>
            <button onClick={() => navigate('/tasks')} className="btn btn-secondary btn-sm">{t('viewAll')}</button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {(matchedTasks.length > 0 ? matchedTasks : mockNGORequests.slice(0, 3)).map(task => (
              <div key={task.id} className="card card-hover fade-in">
                <div className="card-body" style={{ padding: '1.25rem 1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem', flexWrap: 'wrap' }}>
                        <span style={{ fontWeight: 700, fontSize: '0.95rem', fontFamily: 'var(--font-display)' }}>{task.ngoName}</span>
                      </div>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.6rem', lineHeight: 1.6 }}>{task.taskDescription}</p>
                      <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                        <span className="badge badge-gray" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                          <MapPin size={12} strokeWidth={2} /> {task.location}, {task.state}
                        </span>
                        {task.requiredSkills?.map(s => <span key={s} className="badge badge-primary">{s}</span>)}
                      </div>
                    </div>
                    <button onClick={() => navigate('/tasks')} className="btn btn-primary btn-sm" style={{ flexShrink: 0 }}>{t('apply')}</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Upcoming Meetups */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <h2 style={{ fontSize: '1rem', fontFamily: 'var(--font-display)' }}>{t('upcomingMeetups')}</h2>
              <button onClick={() => navigate('/meetups')} className="btn btn-ghost btn-sm" style={{ fontSize: '0.75rem' }}>{t('seeAll')}</button>
            </div>
            {mockMeetups.slice(0, 2).map(m => (
              <div key={m.id} className="card card-hover" style={{ marginBottom: '0.6rem', cursor: 'pointer' }} onClick={() => navigate('/meetups')}>
                <div className="card-body" style={{ padding: '1rem 1.25rem' }}>
                  <div style={{ fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.2rem', fontFamily: 'var(--font-display)' }}>{m.name}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    <Calendar size={12} strokeWidth={2} /> {m.date}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    <MapPin size={12} strokeWidth={2} /> {m.location.split(',')[0]}
                    <span style={{ color: 'var(--text-muted)' }}>·</span>
                    <Users size={12} strokeWidth={2} /> {m.attendees}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="card">
            <div className="card-header"><h3 style={{ fontSize: '0.95rem', fontFamily: 'var(--font-display)' }}>{t('quickActions')}</h3></div>
            <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', padding: '1rem' }}>
              {[
                { icon: Target, label: t('browseTasks'), to: '/tasks' },
                { icon: Map, label: t('viewMap'), to: '/map' },
                { icon: BarChart3, label: t('impactStats'), to: '/impact' },
                { icon: Trophy, label: t('navLeaderboard'), to: '/leaderboard' },
              ].map(({ icon: IconComponent, label, to }) => (
                <button key={label} onClick={() => navigate(to)} className="btn btn-secondary btn-sm btn-block" style={{ justifyContent: 'flex-start', gap: '0.75rem' }}>
                  <IconComponent size={16} strokeWidth={2} />{label}
                </button>
              ))}
            </div>
          </div>

          {/* Platform Impact */}
          <div className="card" style={{ background: 'linear-gradient(135deg, rgba(17,28,51,0.98) 0%, rgba(8,13,26,0.98) 100%)', border: '1px solid rgba(201,168,76,0.2)' }}>
            <div className="card-body" style={{ padding: '1.25rem' }}>
              <div style={{ fontSize: '0.65rem', color: 'var(--gold-mid)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '1rem' }}>{t('platformImpact')}</div>
              {[
                { icon: Users, value: mockImpactStats.totalVolunteers.toLocaleString(), label: t('volunteers') },
                { icon: CheckCircle, value: mockImpactStats.tasksCompleted.toLocaleString(), label: t('tasksDone') },
                { icon: Navigation, value: mockImpactStats.ngosSupported, label: t('ngos') },
                { icon: MapPin, value: mockImpactStats.citiesCovered, label: t('cities') },
              ].map(({ icon: IconComponent, value, label }) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                    <IconComponent size={14} strokeWidth={2} /> {label}
                  </span>
                  <span className="gradient-text" style={{ fontWeight: 700, fontSize: '0.95rem', fontFamily: 'var(--font-display)' }}>{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
