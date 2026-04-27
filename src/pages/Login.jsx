import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import LanguageSwitcher from '../components/LanguageSwitcher';
import toast from 'react-hot-toast';

const Login = () => {
  const { signInWithEmail, signUpWithEmail } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [mode, setMode] = useState('signin'); // 'signin' | 'signup'
  const [role, setRole] = useState('volunteer');
  const [loading, setLoading] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [showPass, setShowPass] = useState(false);

  const slides = [
    {
      image: '/slides/slide1.png',
      title: 'Make a Real Difference',
      highlight: 'Difference',
      desc: 'Join thousands of volunteers working with verified NGOs across all 28 Indian states.',
    },
    {
      image: '/slides/slide2.png',
      title: 'Empower Lives Daily',
      highlight: 'Lives',
      desc: 'Help provide education, food, and medical aid to those in need in urban and rural India.',
    },
    {
      image: '/slides/slide3.png',
      title: 'Protect Our Future',
      highlight: 'Future',
      desc: 'Contribute to environmental sustainability and urban development projects in your city.',
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const set = (key) => (e) => setForm(p => ({ ...p, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === 'signup') {
        if (form.password !== form.confirmPassword) {
          toast.error(t('passwordsNotMatch'));
          setLoading(false);
          return;
        }
        const result = await signUpWithEmail(form.email, form.password, form.name, role);
        if (result.success) {
          if (result.needsConfirmation) {
            toast.success(t('accountCreatedVerify'), { duration: 6000 });
            setMode('signin');
          } else {
            toast.success(t('welcomeToEchora'));
            navigate('/dashboard');
          }
        } else {
          toast.error(result.error);
        }
      } else {
        const result = await signInWithEmail(form.email, form.password);
        if (result.success) {
          toast.success(t('welcomeBack'));
          navigate('/dashboard');
        } else {
          toast.error(result.error);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    { value: '1,248+', label: 'Volunteers' },
    { value: '89+', label: 'NGOs' },
    { value: '3,672+', label: 'Tasks Done' },
    { value: '28', label: 'States' },
  ];

  const features = [
    { icon: '🗺️', text: t('featureMapDiscovery') },
    { icon: '🤖', text: t('featureAIMatching') },
    { icon: '🏆', text: t('featurePointsBadges') },
    { icon: '📊', text: t('featureRealTimeMetrics') },
    { icon: '🌐', text: t('featureMultilingual') },
    { icon: '🤝', text: t('featureWeekendMeetups') },
  ];

  return (
    <div style={{
      minHeight: '100vh',
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      background: 'var(--bg-primary)',
    }}>
      {/* LEFT: Hero with Slider */}
      <div style={{
        background: '#060a18',
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
        padding: '4rem 3.5rem', position: 'relative', overflow: 'hidden',
      }}>
        {/* Sliding Background Images */}
        {slides.map((slide, idx) => (
          <div
            key={idx}
            style={{
              position: 'absolute',
              top: 0, left: 0, right: 0, bottom: 0,
              backgroundImage: `url(${slide.image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              opacity: currentSlide === idx ? 0.7 : 0,
              filter: 'brightness(1.1) contrast(1.1)',
              transition: 'opacity 1.5s ease-in-out',
              zIndex: 0,
            }}
          />
        ))}

        {/* Gradient Overlay (Lightened for brighter images) */}
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'linear-gradient(160deg, rgba(6,10,24,0.7) 0%, rgba(13,21,38,0.4) 40%, rgba(6,8,18,0.7) 100%)',
          zIndex: 1,
        }} />

        {/* Decorative orbs */}
        <div style={{ position: 'absolute', top: '8%', right: '5%', width: 320, height: 320, borderRadius: '50%', background: 'radial-gradient(circle, rgba(201,168,76,0.12) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 2 }} />
        <div style={{ position: 'absolute', bottom: '10%', left: '-5%', width: 280, height: 280, borderRadius: '50%', background: 'radial-gradient(circle, rgba(42,74,155,0.15) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 2 }} />
        
        {/* Gold line top */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'var(--gold-grad)', zIndex: 5 }} />

        <div style={{ position: 'relative', zIndex: 10, maxWidth: 440 }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '3rem' }}>
            <img 
              src="/echora-logo.svg" 
              alt="ECHORA Logo"
              style={{
                width: 52, height: 52,
                boxShadow: '0 0 30px rgba(201,168,76,0.3)',
              }}
            />
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.7rem', fontWeight: 800, color: '#e8dfc8', letterSpacing: '-0.01em' }}>ECHORA</div>
              <div style={{ color: 'rgba(232,223,200,0.45)', fontSize: '0.75rem', letterSpacing: '0.1em' }}>EMPATHY IN EVERY ECHO</div>
            </div>
          </div>

          {/* Animated Text Content */}
          <div style={{ minHeight: '220px' }}>
            {slides.map((slide, idx) => (
              <div
                key={idx}
                style={{
                  display: currentSlide === idx ? 'block' : 'none',
                  animation: 'fadeInUp 0.8s ease-out forwards',
                }}
              >
                <h1 style={{ fontSize: '2.8rem', fontWeight: 800, color: 'rgba(232,223,200,0.7)', lineHeight: 1.15, marginBottom: '1.25rem', fontFamily: 'var(--font-display)' }}>
                  {slide.title.split(slide.highlight)[0]}<br />
                  <span style={{ background: 'linear-gradient(90deg, #c9a84c 0%, #a68b3e 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', opacity: 0.8 }}>{slide.highlight}</span><br />
                  {slide.title.split(slide.highlight)[1]} Across India
                </h1>
                <p style={{ color: 'rgba(232,223,200,0.5)', fontSize: '1rem', marginBottom: '2.5rem', lineHeight: 1.7 }}>
                  {slide.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Slider Indicators */}
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2.5rem' }}>
            {slides.map((_, idx) => (
              <div
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                style={{
                  width: currentSlide === idx ? 30 : 8,
                  height: 8,
                  borderRadius: 4,
                  background: currentSlide === idx ? 'var(--gold-grad)' : 'rgba(255,255,255,0.2)',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
              />
            ))}
          </div>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '2.5rem' }}>
            {stats.map(s => (
              <div key={s.label} style={{ textAlign: 'center', padding: '1rem 0.5rem', background: 'rgba(255,255,255,0.06)', borderRadius: '12px', border: '1px solid rgba(201,168,76,0.15)', backdropFilter: 'blur(10px)' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', fontWeight: 800, background: 'linear-gradient(90deg, #c9a84c 0%, #a68b3e 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', opacity: 0.7 }}>{s.value}</div>
                <div style={{ color: 'rgba(232,223,200,0.4)', fontSize: '0.7rem', marginTop: '0.2rem' }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Features */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>
            {features.map(f => (
              <div key={f.text} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', background: 'rgba(255,255,255,0.06)', borderRadius: '10px', padding: '0.6rem 0.85rem', border: '1px solid rgba(201,168,76,0.15)', backdropFilter: 'blur(10px)' }}>
                <span style={{ fontSize: '1rem', opacity: 0.7 }}>{f.icon}</span>
                <span style={{ color: 'rgba(232,223,200,0.6)', fontSize: '0.78rem' }}>{f.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT: Auth Form */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', position: 'relative', background: 'var(--bg-secondary)' }}>
        {/* Top Controls: Language & Theme */}
        <div style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <LanguageSwitcher />
          <button onClick={toggleTheme} style={{ width: 40, height: 40, borderRadius: '10px', background: 'var(--bg-input)', border: '1px solid var(--border-color)', cursor: 'pointer', fontSize: '1.1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {isDark ? '☀️' : '🌙'}
          </button>
        </div>

        <div style={{ width: '100%', maxWidth: 420 }}>
          {/* Header */}
          <div style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.3rem' }}>
              {mode === 'signin' ? t('welcomeBack') : t('createAccount')}
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
              {mode === 'signin' ? t('signInToAccount') : t('joinVolunteerNetwork')}
            </p>
          </div>

          {/* Mode toggle */}
          <div style={{ display: 'flex', background: 'var(--bg-input)', borderRadius: '12px', padding: '4px', marginBottom: '1.5rem', border: '1px solid var(--border-color)' }}>
            {[['signin', t('signIn')], ['signup', t('signUp')]].map(([m, label]) => (
              <button key={m} onClick={() => setMode(m)} style={{
                flex: 1, padding: '0.55rem', borderRadius: '9px', border: 'none', cursor: 'pointer',
                fontSize: '0.875rem', fontWeight: 600, transition: 'all 0.2s',
                background: mode === m ? 'var(--gold-grad)' : 'transparent',
                color: mode === m ? '#1a0e05' : 'var(--text-secondary)',
                boxShadow: mode === m ? 'var(--shadow-gold)' : 'none',
              }}>{label}</button>
            ))}
          </div>

          {/* Role selector (signup only) */}
          {mode === 'signup' && (
            <div style={{ display: 'flex', background: 'var(--bg-input)', borderRadius: '12px', padding: '4px', marginBottom: '1.5rem', border: '1px solid var(--border-color)' }}>
              {[['volunteer', '🙋 Volunteer'], ['ngo', '🏢 NGO Rep']].map(([r, label]) => (
                <button key={r} onClick={() => setRole(r)} style={{
                  flex: 1, padding: '0.5rem', borderRadius: '9px', border: 'none', cursor: 'pointer',
                  fontSize: '0.82rem', fontWeight: 600, transition: 'all 0.2s',
                  background: role === r ? 'rgba(201,168,76,0.12)' : 'transparent',
                  color: role === r ? 'var(--gold-light)' : 'var(--text-muted)',
                  borderColor: role === r ? 'var(--gold-mid)' : 'transparent',
                }}>{label}</button>
              ))}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {mode === 'signup' && (
              <div className="form-group">
                <label className="form-label">{t('fullName')}</label>
                <input className="form-input" type="text" placeholder={t('namePlaceholder')} value={form.name} onChange={set('name')} required autoFocus />
              </div>
            )}
            <div className="form-group">
              <label className="form-label">{t('email')}</label>
              <input className="form-input" type="email" placeholder={t('emailPlaceholder')} value={form.email} onChange={set('email')} required autoFocus={mode === 'signin'} />
            </div>
            <div className="form-group">
              <label className="form-label">{t('password')}</label>
              <div style={{ position: 'relative' }}>
                <input className="form-input" type={showPass ? 'text' : 'password'} placeholder={t('passwordPlaceholder')} value={form.password} onChange={set('password')} required style={{ paddingRight: '3rem' }} />
                <button type="button" onClick={() => setShowPass(p => !p)} style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: '1rem' }}>
                  {showPass ? '🙈' : '👁️'}
                </button>
              </div>
            </div>
            {mode === 'signup' && (
              <div className="form-group">
                <label className="form-label">{t('confirmPassword')}</label>
                <input className="form-input" type="password" placeholder={t('confirmPasswordPlaceholder')} value={form.confirmPassword} onChange={set('confirmPassword')} required />
              </div>
            )}
            <button type="submit" className="btn btn-primary btn-lg btn-block" disabled={loading} style={{ marginTop: '0.5rem' }}>
              {loading ? <><span className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} /> {mode === 'signin' ? t('signingIn') : t('creatingAccount')}</> : mode === 'signin' ? `→ ${t('signIn')}` : `→ ${t('createAccount')}`}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            {mode === 'signin' ? (
              <>{t('dontHaveAccount')}{' '}<button onClick={() => setMode('signup')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--gold-mid)', fontWeight: 600, fontSize: '0.82rem' }}>{t('signUp')} →</button></>
            ) : (
              <>{t('alreadyHaveAccount')}{' '}<button onClick={() => setMode('signin')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--gold-mid)', fontWeight: 600, fontSize: '0.82rem' }}>{t('signIn')} →</button></>
            )}
          </div>

          <div style={{ marginTop: '2rem', padding: '1rem', background: 'rgba(201,168,76,0.06)', border: '1px solid rgba(201,168,76,0.15)', borderRadius: '12px', fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
            <strong style={{ color: 'var(--gold-mid)' }}>🔒 Secure:</strong> Your account data is stored privately in a real database. Only you can access your profile, notes, and activity.
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @media (max-width: 768px) { 
          div[style*="gridTemplateColumns: '1fr 1fr'"] { grid-template-columns: 1fr !important; } 
          div[style*="background: #060a18"] { display: none !important; } 
        }
      `}</style>
    </div>
  );
};

export default Login;
