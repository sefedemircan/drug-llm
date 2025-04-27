import React, { useEffect, useState } from 'react';
import { IconArrowUp } from '@tabler/icons-react';

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Scroll pozisyonunu izle
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  // Yukarı çık fonksiyonu
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  if (!isVisible) return null;

  return (
    <button
      onClick={scrollToTop}
      className={`fixed bottom-8 right-8 z-50 flex items-center justify-center
                 bg-amber-50 hover:bg-amber-100 transition-all duration-300
                 rounded-t-full rounded-b-md shadow-lg
                 w-12 h-14 border-2 border-amber-500 group`}
      aria-label="Sayfanın başına dön"
    >
      {/* Hap şekli üzerindeki çizgi */}
      <div className="absolute top-1/2 w-8 h-[1px] bg-amber-500"></div>
      
      {/* Ok ikonu */}
      <IconArrowUp 
        size={20} 
        className="text-amber-700 relative z-10 group-hover:transform group-hover:-translate-y-1 transition-transform" 
      />
    </button>
  );
};

export default ScrollToTop; 