import React, { useState, useEffect } from 'react';
import { ActionIcon } from '@mantine/core';
import { IconArrowUp } from '@tabler/icons-react';

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(true); // Test için başlangıçta görünür

  // Debug için
  console.log('ScrollToTop rendered, isVisible:', isVisible);

  // Scroll olayını izle
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const newIsVisible = scrollTop > 100; // Daha düşük threshold
      console.log('Scroll position:', scrollTop, 'Will be visible:', newIsVisible);
      setIsVisible(newIsVisible);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // İlk yüklemede kontrol et

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Smooth scroll animasyonu
  const scrollToTop = () => {
    const scrollToTopSmoothly = () => {
      const currentScroll = document.documentElement.scrollTop || document.body.scrollTop;
      
      if (currentScroll > 0) {
        // Easing fonksiyonu - ease-out-cubic
        const progress = 1 - Math.pow(currentScroll / (currentScroll + 100), 3);
        const newScroll = currentScroll * (1 - progress * 0.1);
        
        window.scrollTo(0, newScroll);
        requestAnimationFrame(scrollToTopSmoothly);
      }
    };

    // Browser native smooth scroll'ü dene, çalışmazsa custom animasyon
    try {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth'
      });
      
      // Native smooth scroll çalışmazsa custom animasyonu başlat
      setTimeout(() => {
        const currentScroll = document.documentElement.scrollTop || document.body.scrollTop;
        if (currentScroll > 50) {
          scrollToTopSmoothly();
        }
      }, 100);
    } catch (error) {
      // Fallback: Custom smooth scroll
      scrollToTopSmoothly();
    }
  };

  if (!isVisible) return null;

  return (
    <ActionIcon
      size="xl"
      radius="xl"
      variant="filled"
      color="blue"
      onClick={scrollToTop}
      aria-label="Sayfanın başına dön"
      style={{
        position: 'fixed',
        bottom: '30px',
        right: '30px',
        zIndex: 1000,
        boxShadow: '0 4px 15px rgba(25, 118, 210, 0.3)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        animation: 'fadeInSlideUp 0.3s ease-out',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-3px) scale(1.05)';
        e.currentTarget.style.boxShadow = '0 8px 25px rgba(25, 118, 210, 0.4)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0px) scale(1)';
        e.currentTarget.style.boxShadow = '0 4px 15px rgba(25, 118, 210, 0.3)';
      }}
    >
      <IconArrowUp size={20} stroke={1.5} />
    </ActionIcon>
  );
};

export default ScrollToTop; 