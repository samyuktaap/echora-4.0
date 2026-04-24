import React, { useState } from 'react';
import { mockVolunteers } from '../data/mockData';
import { useAuth } from '../context/AuthContext';
import { Trophy, Award, MapPin, CheckCircle, Users, Star, Heart, Hammer, BookOpen, Sun, Target, Crown, Medal } from 'lucide-react';

const TrophyIcons = [Trophy, Medal, Award];
const BADGE_ICONS = { 
  'Newcomer': { icon: Target, color: 'var(--success)' }, 
  'Helper': { icon: Users, color: 'var(--primary-mid)' }, 
  'Early Bird': { icon: Sun, color: 'var(--warning)' }, 
  'Star Volunteer': { icon: Star, color: 'var(--primary-light)' }, 
  'Mentor': { icon: Award, color: 'var(--primary-mid)' }, 
  'Life Saver': { icon: Heart, color: 'var(--danger)' }, 
  'Builder': { icon: Hammer, color: 'var(--warning)' }, 
  'Educator': { icon: BookOpen, color: 'var(--success)' } 
};

const Leaderboard = () => {
  const { profile } = useAuth();
  const [filter, setFilter] = useState('all');
  const [selectedSkill, setSelectedSkill] = useState('');

  const allVolunteers = [
    ...mockVolunteers,
    profile && !mockVolunteers.find(v => v.name === profile.name) ? {
      id: 999, name: profile.name, skills: profile.skills||[], state: profile.state||'',
      experience: profile.experience||'Beginner', points: profile.points||0,
      badges: profile.badges||[], tasksCompleted: profile.tasksCompleted||0,
    } : null,
  ].filter(Boolean);

  let ranked = [...allVolunteers].sort((a, b) => b.points - a.points);

  if (filter === 'state' && profile?.state) {
    ranked = ranked.filter(v => v.state === profile.state);
  }
  if (filter === 'skill' && selectedSkill) {
    ranked = ranked.filter(v => v.skills?.includes(selectedSkill));
  }

  const skills = [...new Set(allVolunteers.flatMap(v => v.skills||[]))].sort();
  const userRank = ranked.findIndex(v => v.id === profile?.id || v.name === profile?.name) + 1;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Leaderboard</h1>
        <p className="page-subtitle">Top volunteers making impact across India</p>
      </div>

      {/* User Position */}
      {profile && (
        <div className="card card-primary mb-3">
          <div className="card-body" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', justifyContent: 'space-between', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 800, color: 'var(--primary-mid)' }}>#{userRank}</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Your Rank</div>
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '1.05rem', marginBottom: '0.2rem' }}>{profile.name}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  <span>{profile.experience}</span>
                  <span>·</span>
                  <MapPin size={12} strokeWidth={2} />
                  <span>{profile.state || 'India'}</span>
                </div>
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div className="gradient-text" style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 800 }}>{profile.points || 0}</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Points</div>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
        {[
          { label: 'Global', val: 'all' },
          { label: `My State${profile?.state ? ` (${profile.state})` : ''}`, val: 'state', disabled: !profile?.state },
          { label: 'By Skill', val: 'skill' },
        ].map(opt => (
          <button key={opt.val}
            onClick={() => setFilter(opt.val)}
            disabled={opt.disabled}
            style={{
              padding: '0.4rem 1rem', borderRadius: '20px', border: '1.5px solid',
              fontSize: '0.78rem', fontWeight: 600, cursor: opt.disabled ? 'not-allowed' : 'pointer',
              borderColor: filter === opt.val ? 'var(--primary-mid)' : 'var(--border-color)',
              background: filter === opt.val ? 'rgba(59,130,246,0.1)' : 'var(--bg-input)',
              color: filter === opt.val ? 'var(--primary-light)' : 'var(--text-secondary)',
              opacity: opt.disabled ? 0.4 : 1,
            }}
          >{opt.label}</button>
        ))}
        {filter === 'skill' && (
          <select className="form-select" value={selectedSkill} onChange={e => setSelectedSkill(e.target.value)} style={{ maxWidth: 180, fontSize: '0.82rem' }}>
            <option value="">Select a skill</option>
            {skills.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        )}
        <span className="badge badge-gray" style={{ marginLeft: 'auto' }}>{ranked.length} volunteers</span>
      </div>

      {/* Rankings */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {ranked.map((v, i) => (
          <div key={v.id} className="card card-hover">
            <div className="card-body" style={{ padding: '1.25rem 1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1, minWidth: 0 }}>
                  {/* Rank */}
                  <div style={{ width: 40, textAlign: 'center', flexShrink: 0 }}>
                    {i < 3 ? (
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: i === 0 ? 'var(--warning)' : i === 1 ? 'var(--text-muted)' : 'var(--danger-light)' }}>
                        {(() => {
                          const IconComp = TrophyIcons[i];
                          return <IconComp size={28} strokeWidth={2} />;
                        })()}
                      </div>
                    ) : (
                      <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-muted)' }}>#{i + 1}</span>
                    )}
                  </div>
                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem', flexWrap: 'wrap' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>{v.name}</span>
                      {v.id === profile?.id || v.name === profile?.name ? (
                        <span className="badge badge-primary">You</span>
                      ) : null}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                      <span>{v.experience}</span>
                      <span>·</span>
                      <MapPin size={12} strokeWidth={2} />
                      <span>{v.state || 'India'}</span>
                      <span>·</span>
                      <CheckCircle size={12} strokeWidth={2} />
                      <span>{v.tasksCompleted || 0} tasks</span>
                    </div>
                    <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                      {v.badges?.slice(0, 3).map(b => {
                        const badgeConfig = BADGE_ICONS[b] || { icon: Trophy, color: 'var(--primary-mid)' };
                        const IconComponent = badgeConfig.icon;
                        const colorValue = badgeConfig.color;
                        return (
                          <div key={b} style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', padding: '0.2rem 0.5rem', borderRadius: '12px', background: `${colorValue}26`, border: `1px solid ${colorValue}4D` }}>
                            <IconComponent size={14} strokeWidth={2} style={{ color: colorValue }} />
                            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: colorValue }}>{b}</span>
                          </div>
                        );
                      })}
                      {v.badges?.length > 3 && <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', padding: '0.2rem 0.5rem' }}>+{v.badges.length - 3}</span>}
                    </div>
                  </div>
                </div>
                {/* Points */}
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div className="gradient-text" style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 800 }}>{v.points}</div>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>pts</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Leaderboard;
