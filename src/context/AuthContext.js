"use client";

import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';
import { useRouter } from 'next/navigation';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Mevcut kullanıcıyı kontrol et
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setLoading(false);
    };

    getUser();

    // Auth değişikliklerini dinle
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email, password) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      router.push('/chat');
    } catch (error) {
      return { error: error.message };
    }
  };

  const signup = async (email, password) => {
    try {
      // Sadece kullanıcı kaydı oluştur, profiles tablosuna ekleme trigger ile otomatik olarak yapılacak
      const { data, error } = await supabase.auth.signUp({ email, password });
      
      if (error) throw error;
      
      // Kaydın başarılı olduğunu bildir
      return { success: 'Kayıt başarılı! E-posta adresinizi kontrol edin.' };
    } catch (error) {
      console.error('Signup error:', error);
      return { error: error.message };
    }
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      router.push('/');
    }
  };

  const value = {
    user,
    loading,
    login,
    signup,
    logout,
    isAuthenticated: !!user
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  return useContext(AuthContext);
}; 