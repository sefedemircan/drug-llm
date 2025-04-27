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
      console.log('Login başlatılıyor:', { email });
      
      const { data, error } = await supabase.auth.signInWithPassword({ 
        email, 
        password 
      });
      
      if (error) {
        console.error('Login hatası:', error);
        return { error: error.message };
      }
      
      console.log('Login başarılı:', data);
      router.push('/chat');
      return { success: 'Giriş başarılı!' };
    } catch (error) {
      console.error('Login error detayları:', error);
      return { error: error.message };
    }
  };

  const signup = async (email, password, profileData, healthData) => {
    try {
      console.log('Signup başlatılıyor:', { email });
      
      // Mevcut URL'i al
      const currentUrl = window.location.origin;
      
      // Sadece email ve password ile kayıt olma işlemi
      const { data, error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          emailRedirectTo: `${currentUrl}/login`,
          data: {
            profileData,
            healthData
          }
        }
      });
      
      if (error) {
        console.error('Supabase Auth signup hatası:', error);
        throw error;
      }
      
      console.log('Signup başarılı:', data);
      
      // Kayıt işlemi başarılı, e-posta onayı gerekiyorsa bildir
      if (data?.user?.identities?.length === 0) {
        return { error: 'Bu e-posta adresi zaten kullanılıyor.' };
      }

      // Profil ve sağlık bilgilerini kaydet
      if (profileData && healthData) {
        try {
          // Önce profil bilgilerini kaydet
          const { error: profileError } = await supabase
            .from('user_profile')
            .insert({
              user_id: data.user.id,
              ...profileData,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            });

          if (profileError) {
            console.error('Profil bilgileri kaydedilirken hata:', profileError);
            return { error: 'Profil bilgileri kaydedilirken bir hata oluştu.' };
          }

          // Sonra sağlık bilgilerini kaydet
          const { error: healthError } = await supabase
            .from('health_info')
            .insert({
              user_id: data.user.id,
              ...healthData,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            });

          if (healthError) {
            console.error('Sağlık bilgileri kaydedilirken hata:', healthError);
            return { error: 'Sağlık bilgileri kaydedilirken bir hata oluştu.' };
          }
        } catch (error) {
          console.error('Veri kaydetme hatası:', error);
          return { error: 'Veriler kaydedilirken bir hata oluştu.' };
        }
      }
      
      return { success: 'Kayıt başarılı! E-posta adresinizi kontrol edin.' };
    } catch (error) {
      console.error('Signup error detayları:', error);
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