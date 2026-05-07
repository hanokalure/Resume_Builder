import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const ensureProfileExists = async (currentUser) => {
    if (!currentUser) return;
    
    // Check if profile exists
    const { error } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', currentUser.id)
      .single();

    // PGRST116 means zero rows returned
    if (error && error.code === 'PGRST116') {
      const { error: insertError } = await supabase.from('profiles').insert([{ 
        id: currentUser.id, 
        skills: [], 
        certificates: [], 
        basic_info: { 
          name: currentUser.user_metadata?.full_name || '',
          email: currentUser.email || ''
        }, 
        education: [], 
        experience: [], 
        projects: [] 
      }]);
      
      if (insertError) {
        console.error('Error creating profile for new user:', insertError);
      }
    }
  };

  useEffect(() => {
    // Check active sessions and sets the user
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        ensureProfileExists(session.user);
      }
      setLoading(false);
    });

    // Listen for changes on auth state (login, signout, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (_event === 'SIGNED_IN' && session?.user) {
        ensureProfileExists(session.user);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const value = {
    user,
    loading,
    signUp: (email, password) => supabase.auth.signUp({ email, password }),
    signIn: (email, password) => supabase.auth.signInWithPassword({ email, password }),
    signInWithGoogle: () => supabase.auth.signInWithOAuth({ 
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/`
      }
    }),
    signInWithGithub: () => supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        scopes: 'read:user user:email',
        redirectTo: `${window.location.origin}/`
      }
    }),
    signOut: () => supabase.auth.signOut(),
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
