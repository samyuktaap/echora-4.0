import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { mockNGORequests } from '../data/mockData';
import { Search, Sun, Moon, Bell, MapPin, Menu, Building, Star, Handshake, Globe } from 'lucide-react';

const PAGE_TITLES = {
  '/dashboard': 'pageDashboard',
  '/tasks': 'pageTasks',
  '/ngo-requests': 'pageNGORequests',
  '/ngo-form': 'pageNGOForm',
  '/map': 'pageMap',
  '/meetups': 'pageMeetups',
  '/impact': 'pageImpact',
  '/leaderboard': 'pageLeaderboard',
  '/profile': 'pageProfile',
};

const Navbar = ({ onMenuClick }) => {
  const { isDark, toggleTheme } = useTheme();
  const { profile } = useAuth();
  const { t, language, setLanguage, LANGUAGES } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearch, setShowSearch] = useState(false);
  const [showNotifs, setShowNotifs] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);

  const pageTitle = t(PAGE_TITLES[location.pathname]) || 'ECHORA';

  const handleSearch = (val) => {
    setSearch(val);
    if (!val.trim()) { setSearchResults([]); return; }
    const results = mockNGORequests.filter(r =>
      r.ngoName.toLowerCase().includes(val.toLowerCase()) ||
      r.taskDescription.toLowerCase().includes(val.toLowerCase()) ||
      r.location.toLowerCase().includes(val.toLowerCase())
    ).slice(0, 5);
    setSearchResults(results);
  };

  const notifications = [
    { id: 1, text: 'Hope Foundation posted a new task in your area', time: '2m ago', icon: '🏢' },
    { id: 2, text: 'You earned 25 points for applying to a task', time: '1h ago', icon: '⭐' },
    { id: 3, text: 'Volunteer Connect Bangalore meetup in 7 days', time: '3h ago', icon: '🤝' },
  ];

  return (
    <header style={{
      position: 'fixed', top: 0, left: 'var(--sidebar-width)', right: 0,
      height: 'var(--navbar-height)', background: 'var(--bg-secondary)',
      borderBottom: '1px solid var(--border-color)',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 1.75rem', zIndex: 200,
    }}>
      {/* Mobile menu + page title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
        <button onClick={onMenuClick} className="btn btn-ghost btn-sm" id="mobile-menu-btn" style={{ display: 'none' }}>
          <Menu size={18} />
        </button>
        <div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.15rem', color: 'var(--text-primary)' }}>{pageTitle}</div>
          {profile?.location && (
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <MapPin size={12} strokeWidth={2} /> {profile.location}{profile.state ? `, ${profile.state}` : ''}
            </div>
          )}
        </div>
      </div>

      {/* Center: search */}
      <div style={{ position: 'relative', maxWidth: 380, flex: 1, margin: '0 2.5rem' }}>
        <div className="search-input-wrapper">
          <span className="search-icon" style={{ fontSize: '0.85rem' }}>
            <Search size={16} strokeWidth={2} />
          </span>
          <input
            className="form-input"
            placeholder={t('searchPlaceholder')}
            value={search}
            onChange={e => handleSearch(e.target.value)}
            onFocus={() => setShowSearch(true)}
            onBlur={() => setTimeout(() => setShowSearch(false), 200)}
            style={{ paddingLeft: '2.8rem', fontSize: '0.85rem', height: 42 }}
          />
        </div>
        {showSearch && searchResults.length > 0 && (
          <div style={{
            position: 'absolute', top: '110%', left: 0, right: 0,
            background: 'var(--bg-card)', border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-lg)', zIndex: 999, overflow: 'hidden',
          }}>
            {searchResults.map(r => (
              <div key={r.id} onClick={() => { navigate('/tasks'); setSearch(''); setSearchResults([]); }} style={{
                padding: '0.75rem 1rem', cursor: 'pointer', borderBottom: '1px solid var(--border-color)',
                transition: 'background 0.15s',
              }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>{r.ngoName}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <MapPin size={12} strokeWidth={2} /> {r.location} · {r.urgency} priority
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Right controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <button onClick={toggleTheme} style={{
          width: 42, height: 42, borderRadius: '10px', background: 'var(--bg-input)',
          border: '1px solid var(--border-color)', cursor: 'pointer', fontSize: '1rem',
          display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s',
        }} title={isDark ? t('lightMode') : t('darkMode')}
          onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--primary-mid)'}
          onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-color)'}>
          {isDark ? <Sun size={18} strokeWidth={2} /> : <Moon size={18} strokeWidth={2} />}
        </button>

        {/* Notifications */}
        <div style={{ position: 'relative' }}>
          <button onClick={() => setShowNotifs(p => !p)} style={{
            width: 42, height: 42, borderRadius: '10px', position: 'relative',
            background: 'var(--bg-input)', border: '1px solid var(--border-color)',
            cursor: 'pointer', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s',
          }}
            onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--primary-mid)'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-color)'}>
            <Bell size={18} strokeWidth={2} />
            <span className="notification-dot" />
          </button>
          {showNotifs && (
            <div style={{
              position: 'absolute', top: '110%', right: 0, width: 300,
              background: 'var(--bg-card)', border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-lg)', zIndex: 999, overflow: 'hidden',
            }}>
              <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--border-color)', fontWeight: 700, fontSize: '0.875rem' }}>{t('notifications')}</div>
              {notifications.map(n => {
                const getIcon = (icon) => {
                  switch(icon) {
                    case '🏢': return <Building size={16} strokeWidth={2} />;
                    case '⭐': return <Star size={16} strokeWidth={2} />;
                    case '🤝': return <Handshake size={16} strokeWidth={2} />;
                    default: return <Bell size={16} strokeWidth={2} />;
                  }
                };
                return (
                  <div key={n.id} style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                    <span style={{ fontSize: '1.1rem', flexShrink: 0, color: 'var(--primary-mid)' }}>{getIcon(n.icon)}</span>
                    <div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-primary)', marginBottom: '0.25rem', lineHeight: '1.4' }}>{n.text}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{n.time}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Language Switcher */}
        <div style={{ position: 'relative' }}>
          <button onClick={() => setShowLangMenu(p => !p)} style={{
            width: 42, height: 42, borderRadius: '10px',
            background: 'var(--bg-input)', border: '1px solid var(--border-color)',
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all 0.2s', color: 'var(--primary-mid)',
          }}
            onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--primary-mid)'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-color)'}>
            <Globe size={18} strokeWidth={2} />
          </button>
          {showLangMenu && (
            <div style={{
              position: 'absolute', top: '110%', right: 0, width: 180,
              background: 'var(--bg-card)', border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-lg)', zIndex: 999, overflow: 'hidden',
            }}>
              <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid var(--border-color)', fontWeight: 700, fontSize: '0.8rem', color: 'var(--text-muted)' }}>{t('selectLanguage')}</div>
              {LANGUAGES.map(lang => (
                <button
                  key={lang.code}
                  onClick={() => { setLanguage(lang.code); setShowLangMenu(false); }}
                  style={{
                    width: '100%', padding: '0.75rem 1rem', border: 'none', background: language === lang.code ? 'rgba(59,130,246,0.1)' : 'transparent',
                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    color: language === lang.code ? 'var(--primary-light)' : 'var(--text-primary)',
                    fontSize: '0.85rem', fontWeight: language === lang.code ? 600 : 400,
                    transition: 'all 0.15s',
                  }}
                  onMouseEnter={e => { if (language !== lang.code) e.currentTarget.style.background = 'var(--bg-hover)'; }}
                  onMouseLeave={e => { if (language !== lang.code) e.currentTarget.style.background = 'transparent'; }}
                >
                  <span>{lang.name}</span>
                  {language === lang.code && <span style={{ fontSize: '0.75rem' }}>✓</span>}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Profile */}
        <button onClick={() => navigate('/profile')} style={{
          display: 'flex', alignItems: 'center', gap: '0.75rem',
          background: 'var(--bg-input)', border: '1px solid var(--border-color)',
          borderRadius: '12px', padding: '0.4rem 1rem', cursor: 'pointer', transition: 'all 0.2s',
        }}
          onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--primary-mid)'}
          onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-color)'}>
          <div className="avatar" style={{ width: 32, height: 32, fontSize: '0.8rem' }}>
            {profile?.name?.charAt(0) || '?'}
          </div>
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>
            {profile?.name?.split(' ')[0] || 'User'}
          </span>
        </button>
      </div>

      <style>{`@media (max-width: 768px) { header { left: 0 !important; } #mobile-menu-btn { display: flex !important; } }`}</style>
    </header>
  );
};

export default Navbar;
