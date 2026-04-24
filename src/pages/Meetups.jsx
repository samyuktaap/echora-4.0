import React, { useState } from 'react';
import { mockMeetups, INDIA_STATES } from '../data/mockData';
import { useLanguage } from '../context/LanguageContext';
import { getTranslatedContent } from '../data/contentTranslations';
import { translateArray } from '../utils/translationHelper';
import toast from 'react-hot-toast';

const Meetups = () => {
  const { language, t } = useLanguage();
  const [filterState, setFilterState] = useState('');
  const [registered, setRegistered] = useState(new Set());
  const [expandedId, setExpandedId] = useState(null);

  // First translate all meetups based on current language
  const translatedMeetups = translateArray(mockMeetups, language, 'meetups');
  const filtered = translatedMeetups.filter(m => !filterState || m.state === filterState);

  const handleRegister = (meetupId) => {
    if (registered.has(meetupId)) { toast.error(t('alreadyRegistered')); return; }
    setRegistered(prev => new Set([...prev, meetupId]));
    toast.success(t('registeredSuccess'));
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">{t('weekendMeetupsTitle')}</h1>
        <p className="page-subtitle">{t('connectVolunteersNGOs')}</p>
      </div>

      {/* Filter */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <select className="form-select" value={filterState} onChange={e => setFilterState(e.target.value)} style={{ maxWidth: 200, fontSize: '0.82rem' }}>
          <option value="">{t('allStatesFilter')}</option>
          {INDIA_STATES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <span className="badge badge-gray">{filtered.length} {t('meetupsCountSuffix')}</span>
      </div>

      {/* Meetups */}
      {filtered.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <div className="empty-icon">📍</div>
            <p>{t('noMeetups')}</p>
          </div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.25rem' }}>
          {filtered.map(m => (
            <div key={m.id} className="card card-hover">
              {/* Meetup Image */}
              <div style={{
                height: 180, overflow: 'hidden', position: 'relative',
                background: 'linear-gradient(135deg, rgba(74,114,212,0.2) 0%, rgba(201,168,76,0.1) 100%)',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <img 
                  src={m.image} 
                  alt={m.name}
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.parentElement.innerHTML = '<div style="font-size: 3rem; color: var(--text-muted);">🤝</div>';
                  }}
                  onLoad={(e) => {
                    e.target.style.display = 'block';
                  }}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.3s ease',
                    display: 'none'
                  }}
                  onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                  onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                />
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.3) 100%)',
                  pointerEvents: 'none'
                }} />
              </div>
              <div className="card-body">
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.5rem', fontFamily: 'var(--font-display)' }}>
                    {m.name}
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginBottom: '1rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    <div>📅 {m.date}</div>
                    <div>📍 {m.location}</div>
                    <div>👥 {m.attendees} {t('goingText')}</div>
                  </div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1rem' }}>
                    {m.description}
                  </p>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    onClick={() => setExpandedId(expandedId === m.id ? null : m.id)}
                    className="btn btn-secondary btn-sm"
                    style={{ flex: 1 }}
                  >
                    {expandedId === m.id ? '^ ' + t('details') : t('details')}
                  </button>
                  <button
                    onClick={() => handleRegister(m.id)}
                    className={`btn btn-sm ${registered.has(m.id) ? 'btn-secondary' : 'btn-primary'}`}
                    disabled={registered.has(m.id)}
                    style={{ flex: 1 }}
                  >
                    {registered.has(m.id) ? '✓ ' + t('registered') : t('register')}
                  </button>
                </div>
                {expandedId === m.id && (
                  <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)', fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.8 }}>
                    <strong style={{ color: 'var(--text-primary)' }}>{t('aboutThisMeetup')}</strong><br />
                    {m.description}<br /><br />
                    <strong style={{ color: 'var(--text-primary)' }}>{t('whenLabel')}</strong> {m.date}<br />
                    <strong style={{ color: 'var(--text-primary)' }}>{t('whereLabel')}</strong> {m.location}<br />
                    <strong style={{ color: 'var(--text-primary)' }}>{t('attendeesSoFar')}</strong> <span style={{ color: 'var(--gold-mid)' }}>{m.attendees}</span><br />
                    <strong style={{ color: 'var(--text-primary)' }}>{t('registrationBonus')}</strong> <span style={{ color: 'var(--gold-mid)' }}>+15 pts</span>
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
