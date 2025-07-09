"use client";

import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Group,
  Text,
  useMantineTheme,
  Drawer,
  Stack,
  Button,
  Burger,
  Container,
  ActionIcon,
} from '@mantine/core';
import { 
  IconPill,
  IconMenu2,
  IconX,
} from '@tabler/icons-react';
import ThemeToggle from './ThemeToggle';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useDisclosure } from '@mantine/hooks';
import { useMediaQuery } from '@mantine/hooks';

const Navbar = () => {
  const theme = useMantineTheme();
  const pathname = usePathname();
  const [opened, { toggle, close }] = useDisclosure(false);
  const [scrolled, setScrolled] = useState(false);
  const isMobile = useMediaQuery('(max-width: 768px)');
  const isTablet = useMediaQuery('(max-width: 992px) and (min-width: 769px)');
  const isSmallMobile = useMediaQuery('(max-width: 480px)');

  // Scroll olayını takip et
  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const isActive = (path) => pathname === path;

  // Görseldeki navbar öğeleri
  const navItems = [
    { label: 'DrugLLM', path: '/', icon: <IconPill size={16} /> },
    { label: 'Ana Sayfa', path: '/' },
    { label: 'Blog', path: '/blog' },
    { label: 'İletişim', path: '/contact' },
    { label: 'Erken Erişim', path: '/access' },
  ];

  // Sayfanın arka plan rengi - tema değişkenlerinden alınıyor
  const pageBackgroundColor = 'var(--chat-bg)';

  // Oval navbar container stili - sadece konumlandırma için
  const navbarContainerStyle = {
    position: 'fixed',
    width: '100%',
    top: scrolled ? '10px' : (isSmallMobile ? '15px' : '30px'),
    left: 0,
    zIndex: 1000,
    display: 'flex',
    justifyContent: 'center',
    transition: 'all 0.3s ease',
    background: "transparent", // Sayfa rengi ile aynı
    padding: isSmallMobile ? '0 10px' : '0',
  };

  // Navbar arka planının olduğu div - gri oval kısım
  const navbarBackgroundStyle = {
    background: 'var(--sidebar-bg)', // Tema değişkeninden alınıyor
    borderRadius: '9999px',
    overflow: 'hidden',
    display: 'inline-flex',
    margin: '0 auto',
    border: '1px solid var(--border-color)', // Tema değişkeninden border
    boxShadow: 'var(--shadow-sm)', // Tema değişkeninden gölge
    ...(isTablet && { maxWidth: '95%' }), // Tablet'te boyut ayarı
  };

  // Mobil navbar - sadece logo ve toggle içeren versiyon
  const mobileNavbarStyle = {
    ...navbarBackgroundStyle,
    width: 'auto',
    maxWidth: isSmallMobile ? '100%' : '90%',
    padding: '0',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  };

  // İlk link stili (DrugLLM) - ilk link biraz daha koyu gri
  const firstLinkStyle = {
    padding: isTablet ? '14px 18px' : '18px 25px', // Padding artırıldı
    fontWeight: 500,
    fontSize: isTablet ? '14px' : '15px',
    color: 'var(--primary)',
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    transition: 'background-color 0.2s',
    borderRight: '1px solid var(--border-color)', // Tema değişkeninden border
    background: 'var(--border-color-light)', // Tema değişkeninden background
    height: '100%', // Tam yükseklik
  };

  // Orta linkler stili
  const middleLinkStyle = {
    padding: isTablet ? '14px 18px' : '18px 25px', // Padding artırıldı
    fontWeight: 500,
    fontSize: isTablet ? '14px' : '15px',
    color: 'var(--text-body)',
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
    transition: 'background-color 0.2s',
    borderRight: '1px solid var(--border-color)', // Tema değişkeninden border
  };

  // Son link stili (Erken Erişim)
  const lastLinkStyle = {
    padding: isTablet ? '14px 18px' : '18px 25px', // Padding artırıldı
    fontWeight: 500,
    fontSize: isTablet ? '14px' : '15px',
    color: 'var(--text-body)',
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
    transition: 'background-color 0.2s',
  };

  // Stil seçimi fonksiyonu
  const getLinkStyle = (index) => {
    if (index === 0) return firstLinkStyle;
    if (index === navItems.length - 1) return lastLinkStyle;
    return middleLinkStyle;
  };

  // Mobil toggle butonu stil
  const mobileToggleStyle = {
    background: 'transparent',
    border: 'none',
    padding: isSmallMobile ? '12px 15px' : '15px 20px',
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    outline: 'none',
    borderLeft: '1px solid var(--border-color)',
    color: 'var(--text-body)',
    transition: 'all 0.2s ease',
  };

  // Mobil logo stili
  const mobileLogoStyle = {
    ...firstLinkStyle,
    borderRight: 'none',
    fontSize: isSmallMobile ? '13px' : '15px',
    padding: isSmallMobile ? '16px 15px' : '20px 25px', // Padding daha da artırıldı
    height: 'auto', // Mobilde auto yükseklik
    minHeight: isSmallMobile ? '48px' : '54px', // Minimum yükseklik artırıldı
  };

  return (
    <>
      {/* Sayfa arkaplanını ayarlamak için global stil */}
      <style jsx global>{`
        body {
          background-color: ${pageBackgroundColor};
          margin: 0;
          padding: 0;
          transition: background-color 0.3s ease;
        }

        @media (max-width: 992px) {
          .navbar-link {
            padding: 14px 18px !important;
            font-size: 14px !important;
          }
        }

        @media (max-width: 480px) {
          .mobile-logo {
            font-size: 13px !important;
            padding: 16px 15px !important;
          }
          .mobile-toggle {
            padding: 16px 15px !important;
          }
        }
      `}</style>

      {/* Ana navbar */}
      <Box style={{
        ...navbarContainerStyle,
        opacity: opened && isMobile ? 0 : 1, // Drawer açıkken navbar'ı tamamen gizle
        visibility: opened && isMobile ? 'hidden' : 'visible', // Tamamen gizle
        transition: 'all 0.3s ease',
        pointerEvents: opened && isMobile ? 'none' : 'auto',
      }}>
        {/* Masaüstü için normal oval navbar */}
        {!isMobile && (
          <div style={navbarBackgroundStyle}>
            {navItems.map((item, index) => (
              <Link
                key={`${item.label}-${index}`}
                href={item.path}
                className="navbar-link"
                style={{
                  ...getLinkStyle(index),
                  backgroundColor: isActive(item.path) ? 'rgba(0, 0, 0, 0.05)' : undefined,
                }}
              >
                {item.icon && item.icon}
                {item.label}
              </Link>
            ))}
            {/* Tema toggle butonu */}
            <div style={{
              padding: isTablet ? '8px 12px' : '8px 15px',
              borderLeft: '1px solid var(--border-color)',
              display: 'flex',
              alignItems: 'center',
            }}>
              <ThemeToggle size={16} />
            </div>
          </div>
        )}

        {/* Mobil için DrugLLM + Toggle yapısı */}
        {isMobile && (
          <div style={mobileNavbarStyle}>
            {/* DrugLLM kısmı */}
            <Link
              href="/"
              className="mobile-logo"
              style={mobileLogoStyle}
            >
              <IconPill size={isSmallMobile ? 14 : 16} />
              DrugLLM
            </Link>
            
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {/* Tema toggle butonu */}
              <div style={{
                padding: isSmallMobile ? '8px 12px' : '8px 15px',
                borderRight: '1px solid var(--border-color)',
                display: 'flex',
                alignItems: 'center',
              }}>
                <ThemeToggle size={isSmallMobile ? 14 : 16} />
              </div>
              
              {/* Menu toggle butonu - sadece drawer kapalıyken görünür */}
              <button 
                onClick={toggle} 
                className="mobile-toggle"
                style={mobileToggleStyle}
                aria-label="Menüyü aç"
              >
                <IconMenu2 size={isSmallMobile ? 18 : 20} stroke={1.5} />
              </button>
            </div>
          </div>
        )}
      </Box>

      {/* Sayfanın geri kalanı için boşluk - arka plan rengi sayfayla aynı */}
      <div style={{ height: '90px', background: pageBackgroundColor }} />

      {/* Drawer - Mobil Menü */}
      <Drawer
        opened={opened}
        onClose={close}
        padding={0}
        size="100%"
        position="right"
        withCloseButton={false}
        styles={(theme) => ({
          body: { 
            padding: 0,
            backgroundColor: 'var(--sidebar-bg)',
            margin: 0,
          },
          inner: { 
            height: '100vh',
            backgroundColor: 'var(--sidebar-bg)',
          },
          root: { 
            zIndex: 2000,
            backgroundColor: 'var(--sidebar-bg)',
          },
          content: {
            backgroundColor: 'var(--sidebar-bg)',
            border: 'none',
            boxShadow: 'none',
          },
          overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
          },
          header: {
            backgroundColor: 'var(--sidebar-bg)',
            border: 'none',
            margin: 0,
            padding: 0,
            height: 0,
          }
        })}
        closeButtonProps={{ display: 'none' }}
      >
        <div style={{
          padding: isSmallMobile ? '15px' : '20px',
          backgroundColor: 'var(--sidebar-bg)',
          height: '100vh',
          width: '100%',
          margin: 0,
          border: 'none',
          boxSizing: 'border-box',
          position: 'relative',
        }}>
          {/* Sağ üst köşedeki X butonu */}
          <button
            onClick={close}
            style={{
              position: 'absolute',
              top: isSmallMobile ? '15px' : '20px',
              right: isSmallMobile ? '15px' : '20px',
              background: 'var(--border-color-light)',
              border: '1px solid var(--border-color)',
              borderRadius: '50%',
              width: isSmallMobile ? '40px' : '44px',
              height: isSmallMobile ? '40px' : '44px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: 'var(--text-body)',
              transition: 'all 0.2s ease',
              zIndex: 10,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--border-color)';
              e.currentTarget.style.color = 'var(--primary)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--border-color-light)';
              e.currentTarget.style.color = 'var(--text-body)';
            }}
            aria-label="Menüyü kapat"
          >
            <IconX size={isSmallMobile ? 18 : 20} stroke={1.5} />
          </button>

          <Stack gap={isSmallMobile ? "md" : "xl"} style={{ backgroundColor: 'var(--sidebar-bg)', marginTop: isSmallMobile ? '60px' : '70px' }}>
            {/* Logo */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
              <IconPill size={isSmallMobile ? 20 : 24} style={{ color: 'var(--primary)' }} />
              <Text fw={600} size={isSmallMobile ? "md" : "lg"} style={{ color: 'var(--text-title)' }}>
                DrugLLM
              </Text>
            </div>

            <Stack gap={isSmallMobile ? "xs" : "md"} style={{ backgroundColor: 'var(--sidebar-bg)' }}>
              {navItems.map((item, index) => (
                index > 0 && (
                  <Link
                    key={`mobile-${item.label}-${index}`}
                    href={item.path}
                    onClick={close}
                    style={{
                      display: 'block',
                      padding: isSmallMobile ? '12px' : '16px',
                      color: isActive(item.path) ? 'var(--primary)' : 'var(--text-body)',
                      fontWeight: isActive(item.path) ? 600 : 500,
                      textDecoration: 'none',
                      transition: 'all 0.2s ease',
                      backgroundColor: isActive(item.path) ? 'var(--primary-light)' : 'transparent',
                      borderRadius: '8px',
                      fontSize: isSmallMobile ? '14px' : '16px',
                      border: '1px solid transparent',
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive(item.path)) {
                        e.currentTarget.style.backgroundColor = 'var(--border-color-light)';
                        e.currentTarget.style.borderColor = 'var(--border-color)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive(item.path)) {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.borderColor = 'transparent';
                      }
                    }}
                  >
                    {item.icon && item.icon} {item.label}
                  </Link>
                )
              ))}
              
              {/* Mobil drawer'da tema toggle */}
              <Group justify="center" mt="lg" style={{
                padding: '16px',
                backgroundColor: 'var(--border-color-light)',
                borderRadius: '8px',
                border: '1px solid var(--border-color)',
              }}>
                <Text size="sm" style={{ color: 'var(--text-muted)' }}>Tema Seçimi</Text>
                <ThemeToggle size={20} />
              </Group>
            </Stack>
          </Stack>
        </div>
      </Drawer>
    </>
  );
};

export default Navbar; 