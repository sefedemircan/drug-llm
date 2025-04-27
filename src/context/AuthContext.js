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
      
      // Sadece email ve password ile kayıt olma işlemi
      const { data: authData, error: authError } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/login`
        }
      });
      
      if (authError) {
        console.error('Supabase Auth signup hatası:', authError);
        throw authError;
      }
      
      console.log('Signup başarılı:', authData);
      
      // Kayıt işlemi başarılı, e-posta onayı gerekiyorsa bildir
      if (authData?.user?.identities?.length === 0) {
        return { error: 'Bu e-posta adresi zaten kullanılıyor.' };
      }

      // Profil ve sağlık bilgilerini kaydet
      if (profileData && healthData && authData?.user?.id) {
        try {
          // Önce profil bilgilerini kaydet
          const { error: profileError } = await supabase
            .from('user_profile')
            .insert({
              user_id: authData.user.id,
              full_name: profileData.full_name,
              birth_date: profileData.birth_date,
              gender: profileData.gender,
              height: profileData.height,
              weight: profileData.weight,
              phone: profileData.phone,
              address: profileData.address,
              emergency_contact: profileData.emergency_contact,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            });

          if (profileError) {
            console.error('Profil bilgileri kaydedilirken hata:', profileError);
            // Hata olsa bile devam et, kullanıcı daha sonra profil bilgilerini güncelleyebilir
          }

          // Sonra sağlık bilgilerini kaydet
          const { error: healthError } = await supabase
            .from('health_info')
            .insert({
              user_id: authData.user.id,
              blood_type: healthData.blood_type,
              chronic_diseases: healthData.chronic_diseases,
              current_medications: healthData.current_medications,
              drug_allergies: healthData.drug_allergies,
              food_allergies: healthData.food_allergies,
              medical_history: healthData.medical_history,
              family_history: healthData.family_history,
              lifestyle_info: healthData.lifestyle_info,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            });

          if (healthError) {
            console.error('Sağlık bilgileri kaydedilirken hata:', healthError);
            // Hata olsa bile devam et, kullanıcı daha sonra sağlık bilgilerini güncelleyebilir
          }

          console.log('Profil ve sağlık bilgileri başarıyla kaydedildi');
        } catch (error) {
          console.error('Veri kaydetme hatası:', error);
          // Hata olsa bile devam et, kullanıcı daha sonra bilgilerini güncelleyebilir
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