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
    { label: 'Ana Sayfa', path: '/docs' },
    { label: 'Blog', path: '/blog' },
    { label: 'İletişim', path: '/contact' },
    { label: 'Erken Erişim', path: '/access' },
  ];

  // Sayfanın arka plan rengi - görsele göre ayarlandı
  const pageBackgroundColor = '#f4f4f4';

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
    background: '#f5f5f5', // Görseldeki gibi hafif gri tonu
    borderRadius: '9999px',
    overflow: 'hidden',
    display: 'inline-flex',
    margin: '0 auto',
    border: '1px solid #d1d1d1', // Daha belirgin border
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)', // Hafif gölge ekledim
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
    padding: isTablet ? '12px 18px' : '15px 25px',
    fontWeight: 500,
    fontSize: isTablet ? '14px' : '15px',
    color: 'var(--primary)',
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    transition: 'background-color 0.2s',
    borderRight: '1px solid #d1d1d1', // Daha belirgin ayraç
    background: '#ebebeb', // Görseldeki gibi ilk link daha koyu
  };

  // Orta linkler stili
  const middleLinkStyle = {
    padding: isTablet ? '12px 18px' : '15px 25px',
    fontWeight: 500,
    fontSize: isTablet ? '14px' : '15px',
    color: '#333',
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
    transition: 'background-color 0.2s',
    borderRight: '1px solid #d1d1d1', // Daha belirgin ayraç
  };

  // Son link stili (Erken Erişim)
  const lastLinkStyle = {
    padding: isTablet ? '12px 18px' : '15px 25px',
    fontWeight: 500,
    fontSize: isTablet ? '14px' : '15px',
    color: '#333',
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
    borderLeft: '1px solid #d1d1d1',
  };

  // Mobil logo stili
  const mobileLogoStyle = {
    ...firstLinkStyle,
    borderRight: 'none',
    fontSize: isSmallMobile ? '13px' : '15px',
    padding: isSmallMobile ? '12px 15px' : '15px 25px',
  };

  return (
    <>
      {/* Sayfa arkaplanını ayarlamak için global stil */}
      <style jsx global>{`
        body {
          background-color: ${pageBackgroundColor};
          margin: 0;
          padding: 0;
        }

        @media (max-width: 992px) {
          .navbar-link {
            padding: 12px 18px !important;
            font-size: 14px !important;
          }
        }

        @media (max-width: 480px) {
          .mobile-logo {
            font-size: 13px !important;
            padding: 12px 15px !important;
          }
          .mobile-toggle {
            padding: 12px 15px !important;
          }
        }
      `}</style>

      {/* Ana navbar */}
      <Box style={navbarContainerStyle}>
        {/* Masaüstü için normal oval navbar */}
        {!isMobile && (
          <div style={navbarBackgroundStyle}>
            {navItems.map((item, index) => (
              <Link
                key={item.path}
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
            
            {/* Toggle butonu */}
            <button 
              onClick={toggle} 
              className="mobile-toggle"
              style={mobileToggleStyle}
              aria-label="Toggle menu"
            >
              <IconMenu2 size={isSmallMobile ? 18 : 20} stroke={1.5} />
            </button>
          </div>
        )}
      </Box>

      {/* Sayfanın geri kalanı için boşluk - arka plan rengi sayfayla aynı */}
      <div style={{ height: '90px', background: pageBackgroundColor }} />

      {/* Drawer - Mobil Menü */}
      <Drawer
        opened={opened}
        onClose={close}
        padding={isSmallMobile ? "md" : "xl"}
        size="100%"
        position="right"
        styles={{
          body: { padding: isSmallMobile ? '15px' : '20px' },
          inner: { height: '100vh' },
          root: { zIndex: 2000 }
        }}
        closeButtonProps={{ display: 'none' }}
      >
        <Stack gap={isSmallMobile ? "md" : "xl"}>
          {/* Logo ve Kapat */}
          <Group position="apart">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <IconPill size={isSmallMobile ? 20 : 24} />
              <Text fw={600} size={isSmallMobile ? "md" : "lg"}>DrugLLM</Text>
            </div>
            <ActionIcon 
              variant="subtle" 
              onClick={close} 
              radius="xl"
              size={isSmallMobile ? "md" : "lg"}
            >
              <IconX size={isSmallMobile ? 18 : 20} />
            </ActionIcon>
          </Group>

          <Stack gap={isSmallMobile ? "xs" : "md"}>
            {navItems.map((item, index) => (
              index > 0 && (
                <Link
                  key={item.path}
                  href={item.path}
                  onClick={close}
                  style={{
                    display: 'block',
                    padding: isSmallMobile ? '12px' : '16px',
                    color: isActive(item.path) ? theme.colors.primary[7] : theme.colors.dark[7],
                    fontWeight: isActive(item.path) ? 600 : 500,
                    textDecoration: 'none',
                    transition: 'all 0.2s ease',
                    backgroundColor: isActive(item.path) ? 'rgba(0, 0, 0, 0.05)' : 'transparent',
                    borderRadius: theme.radius.md,
                    fontSize: isSmallMobile ? '14px' : '16px',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.05)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = isActive(item.path) 
                      ? 'rgba(0, 0, 0, 0.05)' 
                      : 'transparent';
                  }}
                >
                  {item.icon && item.icon} {item.label}
                </Link>
              )
            ))}
          </Stack>
        </Stack>
      </Drawer>
    </>
  );
};

export default Navbar; 