import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext(null);

const CITY_COORDS = {
  'Mumbai': { lat: 19.076, lng: 72.877 },
  'Delhi': { lat: 28.613, lng: 77.209 },
  'Bangalore': { lat: 12.971, lng: 77.594 },
  'Bengaluru': { lat: 12.971, lng: 77.594 },
  'Hyderabad': { lat: 17.385, lng: 78.486 },
  'Chennai': { lat: 13.082, lng: 80.270 },
  'Kolkata': { lat: 22.572, lng: 88.363 },
  'Pune': { lat: 18.520, lng: 73.856 },
  'Ahmedabad': { lat: 23.022, lng: 72.571 },
  'Jaipur': { lat: 26.912, lng: 75.787 },
  'Kochi': { lat: 9.931, lng: 76.267 },
  'Patna': { lat: 25.594, lng: 85.137 },
  'Nagpur': { lat: 21.145, lng: 79.088 },
  'Surat': { lat: 21.170, lng: 72.831 },
  'Lucknow': { lat: 26.846, lng: 80.946 },
  'Indore': { lat: 22.718, lng: 75.857 },
  'Bhopal': { lat: 23.259, lng: 77.413 },
  'Chandigarh': { lat: 30.733, lng: 76.779 },
  'Guwahati': { lat: 26.144, lng: 91.736 },
  'Coimbatore': { lat: 11.017, lng: 76.955 },
};

const STATE_COORDS = {
  'Andhra Pradesh': { lat: 15.9129, lng: 79.740 },
  'Arunachal Pradesh': { lat: 28.218, lng: 94.728 },
  'Assam': { lat: 26.200, lng: 92.938 },
  'Bihar': { lat: 25.096, lng: 85.313 },
  'Chhattisgarh': { lat: 21.279, lng: 81.866 },
  'Goa': { lat: 15.299, lng: 74.124 },
  'Gujarat': { lat: 22.259, lng: 71.192 },
  'Haryana': { lat: 29.059, lng: 76.086 },
  'Himachal Pradesh': { lat: 31.105, lng: 77.173 },
  'Jharkhand': { lat: 23.610, lng: 85.280 },
  'Karnataka': { lat: 15.317, lng: 75.714 },
  'Kerala': { lat: 10.851, lng: 76.271 },
  'Madhya Pradesh': { lat: 22.973, lng: 78.657 },
  'Maharashtra': { lat: 19.663, lng: 75.300 },
  'Manipur': { lat: 24.663, lng: 93.904 },
  'Meghalaya': { lat: 25.467, lng: 91.367 },
  'Mizoram': { lat: 23.165, lng: 92.948 },
  'Nagaland': { lat: 26.158, lng: 94.562 },
  'Odisha': { lat: 20.940, lng: 84.803 },
  'Punjab': { lat: 31.147, lng: 75.341 },
  'Rajasthan': { lat: 27.024, lng: 74.218 },
  'Sikkim': { lat: 27.533, lng: 88.512 },
  'Tamil Nadu': { lat: 11.127, lng: 78.657 },
  'Telangana': { lat: 18.112, lng: 79.019 },
  'Tripura': { lat: 23.941, lng: 91.988 },
  'Uttar Pradesh': { lat: 26.846, lng: 80.946 },
  'Uttarakhand': { lat: 30.066, lng: 79.019 },
  'West Bengal': { lat: 22.985, lng: 87.855 },
  'Delhi': { lat: 28.613, lng: 77.209 },
  'Jammu and Kashmir': { lat: 33.778, lng: 76.576 },
  'Ladakh': { lat: 34.152, lng: 77.577 },
};

export { STATE_COORDS };

function getCoordsForLocation(location, state) {
  if (!location && !state) return { lat: 20.5937, lng: 78.9629 };
  if (location) {
    const cityKey = Object.keys(CITY_COORDS).find(c =>
      location.toLowerCase().includes(c.toLowerCase()) || c.toLowerCase().includes(location.toLowerCase())
    );
    if (cityKey) return CITY_COORDS[cityKey];
  }
  if (state && STATE_COORDS[state]) return STATE_COORDS[state];
  return { lat: 20.5937, lng: 78.9629 };
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (uid) => {
    const { data, error } = await supabase.from('profiles').select('*').eq('id', uid).single();
    if (error) {
      if (error.code === 'PGRST116') {
        // Profile row doesn't exist - try to create it from auth metadata (Self-healing)
        const { data: { user: authUser } } = await supabase.auth.getUser();
        if (authUser) {
          const { data: newProfile, error: createError } = await supabase.from('profiles').insert({
            id: authUser.id,
            email: authUser.email,
            name: authUser.user_metadata?.name || '',
            role: authUser.user_metadata?.role || 'volunteer'
          }).select().single();
          
          if (!createError && newProfile) {
            const mapped = {
              ...newProfile,
              name: newProfile.name || '',
              tasksCompleted: newProfile.tasks_completed || 0,
            };
            setProfile(mapped);
            setRole(mapped.role);
            setLoading(false);
            return;
          }
        }
      }
      console.error('fetchProfile error:', error);
    } else if (data) {
        const mapped = {
          ...data,
          tasksCompleted: data.tasks_completed ?? 0,
        };
        setProfile(mapped);
        setRole(mapped.role || 'volunteer');
    }
    setLoading(false);
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
        fetchProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user);
        fetchProfile(session.user.id);
      } else {
        setUser(null);
        setProfile(null);
        setRole(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signInWithEmail = async (email, password) => {
    if (!email || !password) return { success: false, error: 'Email and password required' };

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      if (error.message.includes('Invalid login credentials')) {
        return { success: false, error: 'Wrong email or password. Please check and try again.' };
      }
      if (error.message.includes('Email not confirmed')) {
        return { success: false, error: 'Please verify your email inbox first.' };
      }
      return { success: false, error: error.message };
    }

    return { success: true, user: data.user };
  };

  const signUpWithEmail = async (email, password, name, userRole = 'volunteer') => {
    if (!email || !password || !name) return { success: false, error: 'All fields are required' };
    if (password.length < 6) return { success: false, error: 'Password must be at least 6 characters' };

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name, role: userRole },
      },
    });

    if (error) {
      if (error.message.toLowerCase().includes('already registered')) {
        return { success: false, error: 'An account with this email already exists. Please sign in.' };
      }
      return { success: false, error: error.message };
    }

    if (!data.user) return { success: false, error: 'Signup failed. Please try again.' };

    // If session is null, it means email confirmation is required
    const needsConfirmation = !data.session;

    return { 
      success: true, 
      user: data.user, 
      needsConfirmation 
    };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    setRole(null);
  };

  const updateProfile = async (updates) => {
    if (!user) return;

    const coords = (updates.location !== undefined || updates.state !== undefined)
      ? getCoordsForLocation(
          updates.location !== undefined ? updates.location : profile?.location,
          updates.state !== undefined ? updates.state : profile?.state
        )
      : {};

    // Map camelCase back to snake_case for DB
    const dbUpdates = { ...updates };
    if ('tasksCompleted' in dbUpdates) {
      dbUpdates.tasks_completed = dbUpdates.tasksCompleted;
      delete dbUpdates.tasksCompleted;
    }

    const merged = { ...profile, ...updates, ...coords };
    setProfile(merged);
    if (merged.role) setRole(merged.role);

    const { error } = await supabase
      .from('profiles')
      .update({ ...dbUpdates, ...coords, updated_at: new Date().toISOString() })
      .eq('id', user.id);

    if (error) {
      console.error('updateProfile error:', error);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      profile,
      role,
      loading,
      signInWithEmail,
      signUpWithEmail,
      signOut,
      updateProfile,
      setRole,
      fetchProfile,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
