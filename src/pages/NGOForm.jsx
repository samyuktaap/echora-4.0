import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { SKILLS_LIST, INDIA_STATES } from '../data/mockData';

const NGOForm = () => {
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    ngoName: '',
    ngoRegistration: '',
    email: '',
    phone: '',
    location: '',
    state: '',
    taskDescription: '',
    requiredSkills: [],
    taskDate: '',
    additionalInfo: '',
  });

  const set = (key) => (e) => {
    const val = e.target.value;
    setForm(p => ({ ...p, [key]: val }));
  };

  const toggleSkill = (s) => setForm(p => ({
    ...p,
    requiredSkills: p.requiredSkills.includes(s)
      ? p.requiredSkills.filter(x => x !== s)
      : [...p.requiredSkills, s]
  }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.ngoName || !form.location || !form.taskDescription) {
      toast.error('Fill in all required fields');
      return;
    }
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 1000));
    
    // Save locally
    const saved = JSON.parse(localStorage.getItem('ngo_requests') || '[]');
    saved.push({ id: Date.now(), ...form, submittedAt: new Date().toISOString() });
    localStorage.setItem('ngo_requests', JSON.stringify(saved));
    
    setSubmitting(false);
    setSubmitted(true);
    toast.success('✓ Request submitted! Our team will review and activate your posting.');
    
    setTimeout(() => {
      setForm({
        ngoName: '',
        ngoRegistration: '',
        email: '',
        phone: '',
        location: '',
        state: '',
        taskDescription: '',
        requiredSkills: [],
        taskDate: '',
        additionalInfo: '',
      });
      setSubmitted(false);
    }, 2000);
  };

  if (submitted) {
    return (
      <div className="page-container">
        <div className="card" style={{ maxWidth: 600, margin: '4rem auto' }}>
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>✓</div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem', fontFamily: 'var(--font-display)' }}>Request Submitted!</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: 1.7 }}>
              Thank you for submitting your volunteer opportunity request. Our team will review it within 24 hours and activate it on the platform. You'll receive an email confirmation.
            </p>
            <div style={{ background: 'var(--bg-input)', padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--border-color)', marginBottom: '1.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
              <strong style={{ color: 'var(--text-primary)' }}>📋 Your Submission:</strong><br />
              <strong>{form.ngoName}</strong> in {form.location}, {form.state}<br />
              <strong style={{ color: 'var(--gold-mid)' }}>Skills needed:</strong> {form.requiredSkills.join(', ')}
            </div>
            <a href="/dashboard" style={{ color: 'var(--gold-mid)', fontWeight: 600, textDecoration: 'underline' }}>← Back to Dashboard</a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Submit NGO Request</h1>
        <p className="page-subtitle">Post a volunteer opportunity for your organization</p>
      </div>

      <div className="card card-gold" style={{ maxWidth: 800, margin: '0 auto' }}>
        <div className="card-body">
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, fontFamily: 'var(--font-display)' }}>Organization Details</h3>

            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">NGO / Organization Name *</label>
                <input className="form-input" placeholder="Hope Foundation" value={form.ngoName} onChange={set('ngoName')} required />
              </div>
              <div className="form-group">
                <label className="form-label">Registration Number</label>
                <input className="form-input" placeholder="e.g. 12AB34567" value={form.ngoRegistration} onChange={set('ngoRegistration')} />
              </div>
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Email *</label>
                <input className="form-input" type="email" placeholder="contact@ngo.org" value={form.email} onChange={set('email')} required />
              </div>
              <div className="form-group">
                <label className="form-label">Phone</label>
                <input className="form-input" placeholder="+91 98765 43210" value={form.phone} onChange={set('phone')} />
              </div>
            </div>

            <div className="divider" />
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, fontFamily: 'var(--font-display)' }}>Task Details</h3>

            <div className="form-group">
              <label className="form-label">Task Description *</label>
              <textarea className="form-textarea" placeholder="Describe the volunteer opportunity... What will they be doing? Who will they help? What's the impact?" value={form.taskDescription} onChange={set('taskDescription')} required style={{ minHeight: 100 }} />
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Location / City *</label>
                <input className="form-input" placeholder="Mumbai" value={form.location} onChange={set('location')} required />
              </div>
              <div className="form-group">
                <label className="form-label">State</label>
                <select className="form-select" value={form.state} onChange={set('state')}>
                  <option value="">Select State</option>
                  {INDIA_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Preferred Start Date</label>
                <input className="form-input" type="date" value={form.taskDate} onChange={set('taskDate')} />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Required Skills</label>
              <div className="chip-group">
                {SKILLS_LIST.map(s => (
                  <div key={s} className={`chip ${form.requiredSkills.includes(s) ? 'selected' : ''}`} onClick={() => toggleSkill(s)}>{s}</div>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Additional Information</label>
              <textarea className="form-textarea" placeholder="Any other details volunteers should know?" value={form.additionalInfo} onChange={set('additionalInfo')} style={{ minHeight: 80 }} />
            </div>

            <div style={{ background: 'rgba(201,168,76,0.07)', border: '1px solid rgba(201,168,76,0.2)', borderRadius: '12px', padding: '1rem', fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
              <strong style={{ color: 'var(--gold-mid)' }}>ℹ️ Note:</strong> All NGO requests are verified by our team within 24 hours. Once approved, your opportunity will be visible to {1248} volunteers across India. Ensure your details are accurate and complete.
            </div>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <button type="submit" className="btn btn-primary btn-lg" disabled={submitting}>
                {submitting ? <><span className="spinner" style={{ width: 20, height: 20, borderWidth: 2 }} /> Submitting...</> : '→ Submit Request'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NGOForm;
