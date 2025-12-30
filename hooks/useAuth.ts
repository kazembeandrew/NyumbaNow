
import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { User } from '@supabase/supabase-js';

/**
 * A custom hook to manage Supabase authentication state.
 * Handles initial session check, real-time auth changes, and sign-out logic.
 */
export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Initial check: Verify if a session already exists on component mount
    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user ?? null);
      } catch (error) {
        console.error('Error initializing auth session:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // 2. Real-time Subscription: Listen for auth state changes (SIGN_IN, SIGN_OUT, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  /**
   * Signs the user out of the current session.
   */
  const signOut = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error('Error during sign out:', error);
    } finally {
      setUser(null);
      setLoading(false);
    }
  };

  return {
    user,
    loading,
    isAuthenticated: !!user,
    signOut,
  };
};
