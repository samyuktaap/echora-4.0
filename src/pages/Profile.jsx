import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';
import { SKILLS_LIST, LANGUAGES_LIST, INDIA_STATES } from '../data/mockData';

const StarRating = ({ value, onChange }) => (
  <div className="stars" style={{ cursor: onChange ? 'pointer' : 'default' }}>
    {[1,2,3,4,5].map(s => (
      <span key={s} onClick={() => onChange && onChange(s)}
        style={{ fontSize: '1.2rem', color: s <= value ? 'var(--gold-mid)' : 'var(--border-color)', transition: 'color 0.15s' }}>★</span>
    ))}
  </div>
);

const Profile = () => {
  const { profile, user, updateProfile } = useAuth();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showNoteForm, setShowNoteForm] = useState(false);
  const [notes, setNotes] = useState([]);

  // Load notes from Supabase (only this user's notes, enforced by RLS)
  useEffect(() => {
    if (!user) return;
    supabase
      .from('notes')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (error) console.error('Notes fetch error:', error);
        else setNotes(data || []);
      });
  }, [user]);

  const [form, setForm] = useState({
    name: profile?.name || '',
    bio: profile?.bio || '',
    location: profile?.location || '',
    state: profile?.state || '',
    experience: profile?.experience || 'Beginner',
    skills: profile?.skills || [],
    languages: profile?.languages || [],
  });
  const [noteForm, setNoteForm] = useState({ task: '', note: '', rating: 5 });

  const toggleSkill = (s) => setForm(p => ({ ...p, skills: p.skills.includes(s) ? p.skills.filter(x => x !== s) : [...p.skills, s] }));
  const toggleLang = (l) => setForm(p => ({ ...p, languages: p.languages.includes(l) ? p.languages.filter(x => x !== l) : [...p.languages, l] }));

  const handleSave = async () => {
    if (!form.name) { toast.error('Name is required'); return; }
    setSaving(true);
    await new Promise(r => setTimeout(r, 500));
    updateProfile(form);
    setSaving(false);
    setEditing(false);
    toast.success('Profile updated! Map location synced ✓');
  };

  const handleAddNote = async () => {
    if (!noteForm.task || !noteForm.note) { toast.error('Fill in all fields'); return; }
    if (!user) { toast.error('Not logged in'); return; }

    const newNote = {
      user_id: user.id,
      task: noteForm.task,
      note: noteForm.note,
      rating: noteForm.rating,
      date: new Date().toLocaleDateString('en-IN'),
    };

    const { data, error } = await supabase
      .from('notes')
      .insert(newNote)
      .select()
      .single();

    if (error) {
      console.error('Note insert error:', error);
      toast.error('Failed to save note');
      return;
    }

    setNotes(prev => [data, ...prev]);
    updateProfile({ points: (profile?.points || 0) + 10, tasksCompleted: (profile?.tasksCompleted || 0) + 1 });
    setNoteForm({ task: '', note: '', rating: 5 });
    setShowNoteForm(false);
    toast.success('📝 Note saved! +10 points');
  };

  const BADGE_ICONS = { 'Newcomer': '🌱', 'Helper': '🤝', 'Early Bird': '🌅', 'Star Volunteer': '⭐', 'Mentor': '🎓', 'Life Saver': '❤️', 'Builder': '🏗️', 'Educator': '📚' };
  const points = profile?.points || 0;
  const nextTier = points < 200 ? { name: 'Silver', needed: 200 } : points < 500 ? { name: 'Gold', needed: 500 } : { name: 'Platinum', needed: 1000 };
  const progress = Math.min((points / nextTier.needed) * 100, 100);

  return (
    <div className="page-container" style={{ maxWidth: 960 }}>
      <div className="page-header">
        <h1 className="page-title">My Profile</h1>
        <p className="page-subtitle">Manage your volunteer identity and track your impact</p>
      </div>

      {/* Profile Header Card */}
      <div className="card card-gold mb-3">
        <div className="card-body">
          <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
            {/* Avatar + Points */}
            <div style={{ textAlign: 'center', flexShrink: 0 }}>
              <div className="avatar avatar-xl" style={{ margin: '0 auto 1rem' }}>
                {profile?.name?.charAt(0) || '?'}
              </div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 800 }} className="gradient-text">{points}</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Points</div>
              <div style={{ marginTop: '0.75rem', width: 80 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.2rem' }}>
                  <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)' }}>→ {nextTier.name}</span>
                </div>
                <div className="progress-bar" style={{ height: 4 }}>
                  <div className="progress-fill" style={{ width: `${progress}%` }} />
                </div>
              </div>
            </div>

            {/* Info */}
            <div style={{ flex: 1, minWidth: 260 }}>
              {editing ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div className="grid-2">
                    <div className="form-group">
                      <label className="form-label">Name *</label>
                      <input className="form-input" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">State</label>
                      <select className="form-select" value={form.state} onChange={e => setForm(p => ({ ...p, state: e.target.value }))}>
                        <option value="">Select State</option>
                        {INDIA_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">City / Location <span style={{ color: 'var(--gold-mid)', fontSize: '0.65rem' }}>— updates map automatically</span></label>
                    <input className="form-input" value={form.location} onChange={e => setForm(p => ({ ...p, location: e.target.value }))} placeholder="Mumbai, Bangalore, Kochi…" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Bio</label>
                    <textarea className="form-textarea" value={form.bio} onChange={e => setForm(p => ({ ...p, bio: e.target.value }))} placeholder="Tell others about yourself…" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Experience Level</label>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      {['Beginner', 'Intermediate', 'Expert'].map(lvl => (
                        <button key={lvl} type="button" onClick={() => setForm(p => ({ ...p, experience: lvl }))} style={{
                          flex: 1, padding: '0.5rem', borderRadius: '10px', border: '1.5px solid',
                          borderColor: form.experience === lvl ? 'var(--gold-mid)' : 'var(--border-color)',
                          background: form.experience === lvl ? 'rgba(201,168,76,0.1)' : 'var(--bg-input)',
                          color: form.experience === lvl ? 'var(--gold-light)' : 'var(--text-secondary)',
                          cursor: 'pointer', fontWeight: 600, fontSize: '0.82rem', transition: 'all 0.15s',
                        }}>{lvl}</button>
                      ))}
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Skills</label>
                    <div className="chip-group">
                      {SKILLS_LIST.map(s => <div key={s} className={`chip ${form.skills.includes(s) ? 'selected' : ''}`} onClick={() => toggleSkill(s)}>{s}</div>)}
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Languages</label>
                    <div className="chip-group">
                      {LANGUAGES_LIST.map(l => <div key={l} className={`chip ${form.languages.includes(l) ? 'selected' : ''}`} onClick={() => toggleLang(l)}>{l}</div>)}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <button onClick={handleSave} className="btn btn-primary" disabled={saving}>
                      {saving ? <><span className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} /> Saving…</> : '✓ Save Changes'}
                    </button>
                    <button onClick={() => { setEditing(false); setForm({ name: profile?.name||'', bio: profile?.bio||'', location: profile?.location||'', state: profile?.state||'', experience: profile?.experience||'Beginner', skills: profile?.skills||[], languages: profile?.languages||[] }); }} className="btn btn-secondary">Cancel</button>
                  </div>
                </div>
              ) : (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>{profile?.name}</h2>
                    <span className="badge badge-gold">{profile?.experience || 'Beginner'}</span>
                    {profile?.role === 'ngo' && <span className="badge badge-primary">NGO Rep</span>}
                    <button onClick={() => setEditing(true)} className="btn btn-secondary btn-sm" style={{ marginLeft: 'auto' }}>✏️ Edit Profile</button>
                  </div>
                  <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem', fontSize: '0.9rem', lineHeight: 1.7 }}>{profile?.bio || 'No bio added yet. Click Edit Profile to add one.'}</p>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                    {profile?.location && <span className="badge badge-gray">📍 {profile.location}{profile.state ? `, ${profile.state}` : ''}</span>}
                    {profile?.email && <span className="badge badge-gray">✉️ {profile.email}</span>}
                    <span className="badge badge-success">✅ {profile?.tasksCompleted || 0} tasks done</span>
                  </div>
                  {profile?.skills?.length > 0 && (
                    <div style={{ marginBottom: '0.75rem' }}>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>Skills</div>
                      <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                        {profile.skills.map(s => <span key={s} className="badge badge-primary">{s}</span>)}
                      </div>
                    </div>
                  )}
                  {profile?.languages?.length > 0 && (
                    <div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>Languages</div>
                      <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                        {profile.languages.map(l => <span key={l} className="badge badge-gray">🌐 {l}</span>)}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Badges */}
      <div className="card mb-3">
        <div className="card-header">
          <h3 style={{ fontSize: '1.05rem', fontFamily: 'var(--font-display)' }}>🏅 Badges & Achievements</h3>
        </div>
        <div className="card-body">
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            {(profile?.badges?.length > 0 ? profile.badges : ['Newcomer']).map(badge => (
              <div key={badge} style={{ textAlign: 'center', padding: '1.25rem 1rem', background: 'rgba(201,168,76,0.07)', borderRadius: '14px', border: '1px solid rgba(201,168,76,0.2)', minWidth: 90 }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.4rem' }}>{BADGE_ICONS[badge] || '🏅'}</div>
                <div style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--gold-mid)' }}>{badge}</div>
              </div>
            ))}
            {['Gold Star', 'Century Club', 'State Hero', 'Legend'].map(badge => (
              <div key={badge} style={{ textAlign: 'center', padding: '1.25rem 1rem', background: 'var(--bg-input)', borderRadius: '14px', border: '1px dashed var(--border-color)', minWidth: 90, opacity: 0.45 }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.4rem', filter: 'grayscale(1)' }}>🔒</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{badge}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Notes */}
      <div className="card">
        <div className="card-header">
          <h3 style={{ fontSize: '1.05rem', fontFamily: 'var(--font-display)' }}>📝 Task Notes & Feedback</h3>
          <button onClick={() => setShowNoteForm(p => !p)} className="btn btn-primary btn-sm">+ Add Note</button>
        </div>
        {showNoteForm && (
          <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)', background: 'var(--bg-secondary)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Task Name</label>
                <input className="form-input" placeholder="e.g. Food Distribution – Hope Foundation" value={noteForm.task} onChange={e => setNoteForm(p => ({ ...p, task: e.target.value }))} />
              </div>
              <div className="form-group">
                <label className="form-label">Your Experience</label>
                <textarea className="form-textarea" placeholder="Share what you did, what you learned…" value={noteForm.note} onChange={e => setNoteForm(p => ({ ...p, note: e.target.value }))} style={{ minHeight: 80 }} />
              </div>
              <div className="form-group">
                <label className="form-label">Rating</label>
                <StarRating value={noteForm.rating} onChange={r => setNoteForm(p => ({ ...p, rating: r }))} />
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button onClick={handleAddNote} className="btn btn-primary btn-sm">Save Note (+10 pts)</button>
                <button onClick={() => setShowNoteForm(false)} className="btn btn-secondary btn-sm">Cancel</button>
              </div>
            </div>
          </div>
        )}
        <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {notes.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📝</div>
              <p>No notes yet. Complete tasks and share your experience!</p>
            </div>
          ) : notes.map(note => (
            <div key={note.id} style={{ padding: '1.25rem', background: 'var(--bg-secondary)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>{note.task}</span>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{note.date}</span>
              </div>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', lineHeight: 1.6 }}>{note.note}</p>
              <StarRating value={note.rating} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Profile;
