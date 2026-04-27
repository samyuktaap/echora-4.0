import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { supabase } from '../lib/supabase';
import { Star, Award, TrendingUp, MessageSquare, Calendar, CheckCircle2 } from 'lucide-react';

const StarDisplay = ({ value, size = 18 }) => (
  <div style={{ display: 'flex', gap: '0.2rem' }}>
    {[1, 2, 3, 4, 5].map(s => (
      <Star
        key={s}
        size={size}
        fill={s <= value ? 'var(--gold-mid)' : 'transparent'}
        color={s <= value ? 'var(--gold-mid)' : 'var(--border-color)'}
        style={{ transition: 'all 0.2s' }}
      />
    ))}
  </div>
);

const RatingBar = ({ label, count, total, color }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.4rem' }}>
    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', width: 40 }}>{label}</span>
    <div style={{ flex: 1, height: 8, background: 'var(--bg-input)', borderRadius: 99, overflow: 'hidden' }}>
      <div
        style={{
          height: '100%',
          width: `${total > 0 ? (count / total) * 100 : 0}%`,
          background: color,
          borderRadius: 99,
          transition: 'width 0.8s cubic-bezier(0.4,0,0.2,1)',
        }}
      />
    </div>
    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', width: 20, textAlign: 'right' }}>{count}</span>
  </div>
);

const MyFeedback = () => {
  const { user, profile } = useAuth();
  const { t } = useLanguage();
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all | 5 | 4 | 3 | 2 | 1

  useEffect(() => {
    if (!user) return;
    fetchFeedbacks();
  }, [user]);

  async function fetchFeedbacks() {
    setLoading(true);
    const { data, error } = await supabase
      .from('ngo_applications')
      .select('id, task_title, ngo_feedback, ngo_rating, created_at, ngo_name, status')
      .eq('volunteer_id', user.id)
      .not('ngo_feedback', 'is', null)
      .order('created_at', { ascending: false });

    if (!error) setFeedbacks(data || []);
    setLoading(false);
  }

  // Stats
  const avgRating = feedbacks.length > 0
    ? (feedbacks.reduce((sum, f) => sum + (f.ngo_rating || 0), 0) / feedbacks.length).toFixed(1)
    : 0;

  const ratingCounts = [5, 4, 3, 2, 1].map(r => ({
    star: r,
    count: feedbacks.filter(f => f.ngo_rating === r).length,
  }));

  const starColors = { 5: '#22c55e', 4: '#84cc16', 3: '#f59e0b', 2: '#f97316', 1: '#ef4444' };

  const filtered = filter === 'all'
    ? feedbacks
    : feedbacks.filter(f => f.ngo_rating === parseInt(filter));

  const totalPoints = feedbacks.reduce((sum, f) => sum + (f.ngo_rating || 0) * 10, 0);

  return (
    <div className="page-container" style={{ maxWidth: 900 }}>
      {/* Header */}
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <div
            style={{
              width: 52, height: 52, borderRadius: 16,
              background: 'rgba(201,168,76,0.12)', border: '1px solid rgba(201,168,76,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <Star size={26} color="var(--gold-mid)" fill="var(--gold-mid)" />
          </div>
          <div>
            <h1 className="page-title" style={{ marginBottom: '0.15rem' }}>My Feedback</h1>
            <p className="page-subtitle">Reviews & ratings given by NGOs after your volunteer work</p>
          </div>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '5rem' }}>
          <div className="spinner" style={{ width: 48, height: 48, margin: '0 auto 1rem' }} />
          <p style={{ color: 'var(--text-muted)' }}>Loading your feedback...</p>
        </div>
      ) : feedbacks.length === 0 ? (
        <div className="card" style={{ padding: '5rem 2rem', textAlign: 'center', borderStyle: 'dashed' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>⭐</div>
          <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '0.75rem' }}>No Feedback Yet</h3>
          <p style={{ color: 'var(--text-muted)', maxWidth: 360, margin: '0 auto' }}>
            Complete volunteer tasks and get approved by NGOs to start receiving feedback and earning points!
          </p>
        </div>
      ) : (
        <>
          {/* Summary Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
            {/* Avg Rating */}
            <div className="card" style={{ padding: '1.25rem', textAlign: 'center', border: '1px solid rgba(201,168,76,0.25)', background: 'rgba(201,168,76,0.04)' }}>
              <div style={{ fontSize: '3rem', fontWeight: 900, fontFamily: 'var(--font-display)', color: 'var(--gold-mid)', lineHeight: 1 }}>{avgRating}</div>
              <StarDisplay value={Math.round(avgRating)} size={14} />
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Avg Rating</div>
            </div>

            {/* Total Reviews */}
            <div className="card" style={{ padding: '1.25rem', textAlign: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.5rem' }}>
                <MessageSquare size={28} color="var(--primary-mid)" />
              </div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)' }}>{feedbacks.length}</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Total Reviews</div>
            </div>

            {/* Points Earned */}
            <div className="card" style={{ padding: '1.25rem', textAlign: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.5rem' }}>
                <TrendingUp size={28} color="#22c55e" />
              </div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#22c55e' }}>{totalPoints}</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Points Earned</div>
            </div>

            {/* Top Rated */}
            <div className="card" style={{ padding: '1.25rem', textAlign: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.5rem' }}>
                <Award size={28} color="var(--gold-mid)" />
              </div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--gold-mid)' }}>
                {ratingCounts[0].count}
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>5-Star Reviews</div>
            </div>
          </div>

          {/* Rating Distribution */}
          <div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Rating Breakdown
            </h3>
            {ratingCounts.map(({ star, count }) => (
              <RatingBar
                key={star}
                label={`${star}★`}
                count={count}
                total={feedbacks.length}
                color={starColors[star]}
              />
            ))}
          </div>

          {/* Filter bar */}
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
            {['all', '5', '4', '3', '2', '1'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                style={{
                  padding: '0.4rem 1rem', borderRadius: 20, fontSize: '0.82rem', fontWeight: 600,
                  cursor: 'pointer', transition: 'all 0.2s',
                  background: filter === f ? 'var(--gold-grad)' : 'rgba(255,255,255,0.05)',
                  color: filter === f ? '#1a0e05' : 'var(--text-secondary)',
                  border: `1px solid ${filter === f ? 'var(--gold-mid)' : 'var(--border-color)'}`,
                }}
              >
                {f === 'all' ? 'All Reviews' : `${f} ★`}
              </button>
            ))}
          </div>

          {/* Feedback Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {filtered.map((fb, i) => (
              <div
                key={fb.id}
                className="card card-hover"
                style={{
                  padding: '1.5rem',
                  borderRadius: 20,
                  border: fb.ngo_rating === 5
                    ? '1px solid rgba(201,168,76,0.35)'
                    : '1px solid var(--border-color)',
                  background: fb.ngo_rating === 5
                    ? 'rgba(201,168,76,0.03)'
                    : 'var(--bg-card)',
                  position: 'relative',
                  overflow: 'hidden',
                  animation: `fadeSlideUp 0.4s ease ${i * 0.05}s both`,
                }}
              >
                {/* Gold bar for 5-star */}
                {fb.ngo_rating === 5 && (
                  <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 4, background: 'var(--gold-grad)' }} />
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                    {/* NGO Avatar */}
                    <div style={{
                      width: 44, height: 44, borderRadius: 12,
                      background: 'var(--gold-grad)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '1.1rem', fontWeight: 800, color: '#1a0e05', flexShrink: 0,
                    }}>
                      {fb.ngo_name?.charAt(0)?.toUpperCase() || 'N'}
                    </div>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text-primary)' }}>
                        {fb.ngo_name?.trim() || 'NGO'}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <CheckCircle2 size={12} color="#22c55e" />
                        for <span style={{ color: 'var(--gold-mid)', fontWeight: 600, marginLeft: '0.25rem' }}>{fb.task_title || 'a task'}</span>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.4rem' }}>
                    <StarDisplay value={fb.ngo_rating || 5} />
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                      <Calendar size={11} />
                      {new Date(fb.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </div>
                  </div>
                </div>

                {/* Review text */}
                <div style={{
                  background: 'rgba(255,255,255,0.025)', padding: '1rem 1.25rem',
                  borderRadius: 12, border: '1px solid var(--border-color)',
                  marginBottom: '0.75rem',
                }}>
                  <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.7, fontStyle: 'italic', margin: 0 }}>
                    "{fb.ngo_feedback}"
                  </p>
                </div>

                {/* Points badge */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
                    fontSize: '0.75rem', fontWeight: 700, padding: '3px 10px',
                    borderRadius: 20, background: 'rgba(34,197,94,0.1)',
                    color: '#4ade80', border: '1px solid rgba(34,197,94,0.2)',
                  }}>
                    +{(fb.ngo_rating || 5) * 10} pts earned
                  </span>
                  <span style={{
                    fontSize: '0.72rem', color: starColors[fb.ngo_rating] || 'var(--gold-mid)',
                    fontWeight: 700, padding: '3px 10px', borderRadius: 20,
                    background: `${starColors[fb.ngo_rating] || 'var(--gold-mid)'}15`,
                    border: `1px solid ${starColors[fb.ngo_rating] || 'var(--gold-mid)'}30`,
                  }}>
                    {fb.ngo_rating === 5 ? '⭐ Exceptional' : fb.ngo_rating >= 4 ? '✅ Great' : fb.ngo_rating >= 3 ? '👍 Good' : '📝 Average'}
                  </span>
                </div>
              </div>
            ))}

            {filtered.length === 0 && (
              <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                No {filter}-star reviews yet.
              </div>
            )}
          </div>
        </>
      )}

      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default MyFeedback;
