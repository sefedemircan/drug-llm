import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { IconArrowUp } from '@tabler/icons-react';

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Client-side rendering kontrolü
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Scroll pozisyonunu izle
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    // Başlangıç durumu kontrolü
    toggleVisibility();
    
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  // Yukarı çık fonksiyonu
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  // Stil tanımları
  const buttonStyle = {
    position: 'fixed',
    bottom: '30px',
    right: '30px',
    zIndex: 9999,
    width: '50px',
    height: '50px',
    borderRadius: '50%',
    backgroundColor: '#1976d2', // var(--primary)
    color: 'white',
    border: 'none',
    boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.3s ease',
    transform: isVisible ? 'scale(1)' : 'scale(0)',
    opacity: isVisible ? 1 : 0,
  };

  // Client-side'da portal ile direkt body'e ekleyelim
  if (!mounted) return null;

  return createPortal(
    <button
      onClick={scrollToTop}
      style={buttonStyle}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-5px) scale(1.05)';
        e.currentTarget.style.boxShadow = '0 6px 15px rgba(0,0,0,0.25)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = isVisible ? 'scale(1)' : 'scale(0)';
        e.currentTarget.style.boxShadow = '0 4px 10px rgba(0,0,0,0.2)';
      }}
      aria-label="Sayfanın başına dön"
    >
      <IconArrowUp size={24} stroke={2} />
    </button>,
    document.body
  );
};

export default ScrollToTop; 