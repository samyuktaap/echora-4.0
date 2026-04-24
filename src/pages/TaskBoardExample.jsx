// Example: TaskBoard with full multilingual translation integration
import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import toast from 'react-hot-toast';
import { MapPin, Clock, Users, Briefcase, Calendar, Check, Search, Filter, SlidersHorizontal, ArrowRight, Zap, Target } from 'lucide-react';
import { INDIA_STATES } from '../data/mockData';

const TaskBoard = () => {
  const { user, profile } = useAuth();
  const { t, language } = useLanguage(); // Get translation function and current language
  
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterCause, setFilterCause] = useState('');
  const [filterCity, setFilterCity] = useState('');
  const [filterUrgency, setFilterUrgency] = useState('');
  const [sortBy, setSortBy] = useState('match');
  const [skillsOnly, setSkillsOnly] = useState(false);

  // Fetch tasks from Supabase
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const { data, error } = await supabase
        .from('ngo_tasks')
        .select('*')
        .eq('active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTasks(data || []);
    } catch (err) {
      console.error('Error fetching tasks:', err);
      toast.error(t('error')); // Use translation for error
    } finally {
      setLoading(false);
    }
  };

  // Filter and sort tasks
  const filteredTasks = useMemo(() => {
    let filtered = tasks.filter(task => {
      if (search && !task.title.toLowerCase().includes(search.toLowerCase()) && 
          !task.description.toLowerCase().includes(search.toLowerCase())) return false;
      if (filterCause && task.cause !== filterCause) return false;
      if (filterCity && task.city !== filterCity) return false;
      if (filterUrgency && task.urgency !== filterUrgency) return false;
      if (skillsOnly && profile?.skills) {
        const taskSkills = task.required_skills || [];
        const hasSkillMatch = taskSkills.some(skill => 
          profile.skills.some(userSkill => 
            userSkill.toLowerCase() === skill.toLowerCase()
          )
        );
        if (!hasSkillMatch) return false;
      }
      return true;
    });

    // Sort tasks
    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'match':
          const scoreA = calculateMatchScore(profile, a);
          const scoreB = calculateMatchScore(profile, b);
          return scoreB - scoreA;
        case 'urgency':
          const urgencyOrder = { 'High': 3, 'Medium': 2, 'Low': 1 };
          return urgencyOrder[b.urgency] - urgencyOrder[a.urgency];
        case 'newest':
          return new Date(b.created_at) - new Date(a.created_at);
        default:
          return 0;
      }
    });
  }, [tasks, search, filterCause, filterCity, filterUrgency, sortBy, skillsOnly, profile]);

  const calculateMatchScore = (profile, task) => {
    if (!profile) return 0;
    let score = 0;

    // Skills overlap
    const mySkills = (profile.skills || []).map(s => s.toLowerCase());
    const needed = (task.required_skills || []).map(s => s.toLowerCase());
    if (needed.length > 0) {
      const matched = needed.filter(s => mySkills.includes(s)).length;
      score += Math.round((matched / needed.length) * 50);
    } else {
      score += 25;
    }

    // Location
    const myCity = (profile.location || '').toLowerCase();
    const taskCity = (task.city || '').toLowerCase();
    if (myCity && taskCity && myCity === taskCity) {
      score += 30;
    }

    // Experience
    const expRank = { 'Beginner': 0, 'Intermediate': 1, 'Expert': 2 };
    if ((expRank[profile.experience] || 0) >= (expRank[task.min_experience] || 0)) {
      score += 20;
    }

    return Math.min(score, 100);
  };

  const getMatchLabel = (score) => {
    if (score >= 80) return t('greatFit'); // "🎯 Great fit!"
    if (score >= 60) return t('goodFit');   // "👍 Good fit"
    return t('partialMatch');              // "📋 Partial match"
  };

  const getMatchColor = (score) => {
    if (score >= 80) return '#22c55e';
    if (score >= 60) return '#f59e0b';
    return '#ef4444';
  };

  if (loading) {
    return (
      <div className="page-container">
        <div style={{ textAlign: 'center', padding: '5rem' }}>
          <div className="spinner" style={{ width: 48, height: 48, margin: '0 auto 1.5rem' }} />
          <p style={{ color: 'var(--text-muted)' }}>{t('loadingOpportunities')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      {/* Page Header */}
      <div className="page-header">
        <h1 className="page-title">{t('volunteerOpportunities')}</h1>
        <p className="page-subtitle">{t('browseNGORequests')}</p>
      </div>

      {/* Filters Bar */}
      <div style={{ 
        display: 'flex', gap: '1rem', marginBottom: '2rem', 
        flexWrap: 'wrap', alignItems: 'center' 
      }}>
        {/* Search */}
        <div style={{ position: 'relative', flex: 1, minWidth: 250 }}>
          <Search size={16} style={{ 
            position: 'absolute', left: '0.9rem', top: '50%', 
            transform: 'translateY(-50%)', color: 'var(--text-muted)' 
          }} />
          <input
            className="form-input"
            placeholder={t('search')}
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ paddingLeft: '2.5rem', height: 40 }}
          />
        </div>

        {/* Cause Filter */}
        <select 
          className="form-select" 
          style={{ height: 40, minWidth: 150 }}
          value={filterCause} 
          onChange={e => setFilterCause(e.target.value)}
        >
          <option value="">{t('allCauses')}</option>
          <option value="Education">Education</option>
          <option value="Healthcare">Healthcare</option>
          <option value="Environment">Environment</option>
          <option value="Social">Social</option>
        </select>

        {/* City Filter */}
        <select 
          className="form-select" 
          style={{ height: 40, minWidth: 150 }}
          value={filterCity} 
          onChange={e => setFilterCity(e.target.value)}
        >
          <option value="">{t('allCitiesFilter')}</option>
          {INDIA_STATES.map(state => (
            <option key={state} value={state}>{state}</option>
          ))}
        </select>

        {/* Urgency Filter */}
        <select 
          className="form-select" 
          style={{ height: 40, minWidth: 120 }}
          value={filterUrgency} 
          onChange={e => setFilterUrgency(e.target.value)}
        >
          <option value="">{t('anyUrgency')}</option>
          <option value="High">{t('urgencyHigh')}</option>
          <option value="Medium">{t('urgencyMedium')}</option>
          <option value="Low">{t('urgencyLow')}</option>
        </select>

        {/* Sort */}
        <select 
          className="form-select" 
          style={{ height: 40, minWidth: 150 }}
          value={sortBy} 
          onChange={e => setSortBy(e.target.value)}
        >
          <option value="match">{t('sortBestMatch')}</option>
          <option value="urgency">{t('sortMostUrgent')}</option>
          <option value="newest">{t('sortNewest')}</option>
        </select>

        {/* Skills Only Toggle */}
        <button
          onClick={() => setSkillsOnly(!skillsOnly)}
          className={`btn ${skillsOnly ? 'btn-primary' : 'btn-secondary'}`}
          style={{ height: 40, whiteSpace: 'nowrap' }}
        >
          {t('mySkillsOnly')}
        </button>

        {/* Clear Filters */}
        {(search || filterCause || filterCity || filterUrgency) && (
          <button
            onClick={() => {
              setSearch('');
              setFilterCause('');
              setFilterCity('');
              setFilterUrgency('');
            }}
            className="btn btn-ghost"
            style={{ height: 40 }}
          >
            {t('clearFilters')}
          </button>
        )}
      </div>

      {/* Results Count */}
      <div style={{ marginBottom: '1.5rem', color: 'var(--text-muted)' }}>
        {filteredTasks.length} {filteredTasks.length === 1 ? t('opportunityFound') : t('opportunitiesFound')}
      </div>

      {/* Tasks Grid */}
      {filteredTasks.length === 0 ? (
        <div className="card" style={{ padding: '5rem', textAlign: 'center', borderStyle: 'dashed' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.3 }}>🔍</div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>
            {t('noOpportunitiesFound')}
          </h3>
          <p style={{ color: 'var(--text-muted)' }}>
            {t('tryAdjustingFilters')}
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
          {filteredTasks.map(task => {
            const matchScore = calculateMatchScore(profile, task);
            const matchColor = getMatchColor(matchScore);
            
            return (
              <div key={task.id} className="card" style={{ height: 'fit-content' }}>
                {/* Task Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem', lineHeight: 1.3 }}>
                      {task.title}
                    </h3>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <MapPin size={12} />
                      {task.city}, {task.state}
                    </div>
                  </div>
                  
                  {/* Match Score */}
                  {profile && (
                    <div style={{ 
                      display: 'flex', flexDirection: 'column', alignItems: 'center',
                      padding: '0.5rem', borderRadius: '8px', background: `${matchColor}20`,
                      border: `1px solid ${matchColor}40`
                    }}>
                      <div style={{ fontSize: '1.2rem', fontWeight: 800, color: matchColor }}>
                        {matchScore}%
                      </div>
                      <div style={{ fontSize: '0.7rem', color: matchColor, textAlign: 'center' }}>
                        {getMatchLabel(matchScore)}
                      </div>
                    </div>
                  )}
                </div>

                {/* Task Description */}
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1rem' }}>
                  {task.description}
                </p>

                {/* Task Details */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
                  <span className="badge badge-blue">
                    <Briefcase size={12} style={{ marginRight: '0.25rem' }} />
                    {task.cause}
                  </span>
                  <span className={`badge badge-${task.urgency === 'High' ? 'red' : task.urgency === 'Medium' ? 'yellow' : 'green'}`}>
                    <Clock size={12} style={{ marginRight: '0.25rem' }} />
                    {t(`urgency${task.urgency}`)}
                  </span>
                  <span className="badge badge-gray">
                    <Users size={12} style={{ marginRight: '0.25rem' }} />
                    {task.spots_available} {t('spotsLabel')}
                  </span>
                  <span className="badge badge-gray">
                    <Calendar size={12} style={{ marginRight: '0.25rem' }} />
                    {t('deadlineLabel')} {new Date(task.deadline).toLocaleDateString()}
                  </span>
                </div>

                {/* Required Skills */}
                {task.required_skills && task.required_skills.length > 0 && (
                  <div style={{ marginBottom: '1rem' }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                      {t('requiredSkillsLabel')}:
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
                      {task.required_skills.map(skill => (
                        <span key={skill} className="skill-tag">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Apply Button */}
                <button 
                  className="btn btn-primary" 
                  style={{ width: '100%', justifyContent: 'center' }}
                  onClick={() => {
                    // Handle application logic here
                    toast.success(t('applied'));
                  }}
                >
                  {t('applyNowBtn')}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TaskBoard;
