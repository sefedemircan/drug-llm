"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');
  const [isLoading, setIsLoading] = useState(true);

  // Tema yükleme fonksiyonu
  const loadTheme = () => {
    try {
      // Local storage'dan tema tercihi al
      const savedTheme = localStorage.getItem('drugllm-theme');
      
      if (savedTheme) {
        setTheme(savedTheme);
      } else {
        // Sistem temasını kontrol et
        const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        setTheme(systemTheme);
      }
    } catch (error) {
      console.error('Tema yüklenirken hata:', error);
      setTheme('light'); // Varsayılan tema
    } finally {
      setIsLoading(false);
    }
  };

  // Component mount olduğunda tema yükle
  useEffect(() => {
    loadTheme();
  }, []);

  // Tema değişikliklerini dinle
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleSystemThemeChange = (e) => {
      // Sadece kullanıcı özel tema seçmemişse sistem temasını takip et
      const savedTheme = localStorage.getItem('drugllm-theme');
      if (!savedTheme) {
        setTheme(e.matches ? 'dark' : 'light');
      }
    };

    mediaQuery.addListener(handleSystemThemeChange);
    
    return () => {
      mediaQuery.removeListener(handleSystemThemeChange);
    };
  }, []);

  // Tema ve CSS sınıflarını uygula
  useEffect(() => {
    if (isLoading) return;
    
    const root = document.documentElement;
    
    // Tema sınıflarını kaldır
    root.classList.remove('light-theme', 'dark-theme');
    
    // Yeni tema sınıfını ekle
    root.classList.add(`${theme}-theme`);
    
    // Data attribute ekle (CSS'de kullanım için)
    root.setAttribute('data-theme', theme);
    
    // Meta theme-color güncelle
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', theme === 'dark' ? '#1a1b1e' : '#ffffff');
    } else {
      const meta = document.createElement('meta');
      meta.name = 'theme-color';
      meta.content = theme === 'dark' ? '#1a1b1e' : '#ffffff';
      document.getElementsByTagName('head')[0].appendChild(meta);
    }
  }, [theme, isLoading]);

  // Tema değiştirme fonksiyonu
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('drugllm-theme', newTheme);
  };

  // Belirli tema seçme fonksiyonu
  const setThemeMode = (mode) => {
    if (mode === 'system') {
      // Sistem temasını kullan ve local storage'dan kaldır
      localStorage.removeItem('drugllm-theme');
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      setTheme(systemTheme);
    } else {
      setTheme(mode);
      localStorage.setItem('drugllm-theme', mode);
    }
  };

  // Mevcut tema modu (sistem, light, dark)
  const getThemeMode = () => {
    const savedTheme = localStorage.getItem('drugllm-theme');
    return savedTheme || 'system';
  };

  const value = {
    theme,
    isLoading,
    toggleTheme,
    setThemeMode,
    getThemeMode,
    isDark: theme === 'dark',
    isLight: theme === 'light'
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}; 