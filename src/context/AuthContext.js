"use client";

import { createContext, useContext, useState, useEffect } from 'react';
import { supabaseWithRetry } from '../utils/supabase';
import { useRouter } from 'next/navigation';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    let mounted = true;

    const getUser = async () => {
      try {
        const { data: { session } } = await supabaseWithRetry.auth.getSession();
        if (mounted) {
          setUser(session?.user ?? null);
          setLoading(false);
        }
      } catch (error) {
        console.error('Oturum bilgisi alınamadı:', error);
        if (mounted) {
          setError('Oturum bilgisi alınamadı. Lütfen sayfayı yenileyin.');
          setLoading(false);
        }
      }
    };

    getUser();

    const { data: { subscription } } = supabaseWithRetry.auth.onAuthStateChange(async (event, session) => {
      if (mounted) {
        setUser(session?.user ?? null);
        setLoading(false);

        if (event === 'SIGNED_IN' && session?.user) {
          try {
            const { profileData, healthData } = session.user.user_metadata;

            if (profileData) {
              const { error: profileError } = await supabaseWithRetry
                .from('user_profile')
                .upsert({
                  user_id: session.user.id,
                  ...profileData,
                  updated_at: new Date().toISOString()
                }, {
                  onConflict: 'user_id'
                });

              if (profileError) {
                console.error('Profil bilgileri kaydedilirken hata:', profileError);
                setError('Profil bilgileri kaydedilemedi. Lütfen daha sonra tekrar deneyin.');
              }
            }

            if (healthData) {
              const { error: healthError } = await supabaseWithRetry
                .from('health_info')
                .upsert({
                  user_id: session.user.id,
                  ...healthData,
                  updated_at: new Date().toISOString()
                }, {
                  onConflict: 'user_id'
                });

              if (healthError) {
                console.error('Sağlık bilgileri kaydedilirken hata:', healthError);
                setError('Sağlık bilgileri kaydedilemedi. Lütfen daha sonra tekrar deneyin.');
              }
            }
          } catch (error) {
            console.error('Veri kaydetme hatası:', error);
            setError('Veriler kaydedilemedi. Lütfen daha sonra tekrar deneyin.');
          }
        }
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabaseWithRetry.auth.signInWithPassword({ 
        email, 
        password 
      });
      
      if (error) {
        console.error('Login hatası:', error);
        setError(error.message);
        return { error: error.message };
      }
      
      router.push('/chat');
      return { success: 'Giriş başarılı!' };
    } catch (error) {
      console.error('Login error detayları:', error);
      setError(error.message);
      return { error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const signup = async (email, password, profileData, healthData) => {
    try {
      setLoading(true);
      setError(null);
      
      const { data: authData, error: authError } = await supabaseWithRetry.auth.signUp({ 
        email, 
        password,
        options: {
          emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/login`,
          data: {
            profileData,
            healthData
          }
        }
      });
      
      if (authError) {
        console.error('Supabase Auth signup hatası:', authError);
        setError(authError.message);
        throw authError;
      }
      
      if (authData?.user?.identities?.length === 0) {
        setError('Bu e-posta adresi zaten kullanılıyor.');
        return { error: 'Bu e-posta adresi zaten kullanılıyor.' };
      }
      
      return { success: 'Kayıt başarılı! E-posta adresinizi kontrol edin.' };
    } catch (error) {
      console.error('Signup error detayları:', error);
      setError(error.message);
      return { error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { error } = await supabaseWithRetry.auth.signOut();
      if (error) {
        setError(error.message);
        return;
      }
      
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    error,
    login,
    signup,
    logout,
    isAuthenticated: !!user
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 