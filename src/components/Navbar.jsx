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
} from '@mantine/core';
import { 
  IconPill,
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
    top: scrolled ? '10px' : '30px',
    left: 0,
    zIndex: 1000,
    display: 'flex',
    justifyContent: 'center',
    transition: 'all 0.3s ease',
    background: "transparent", // Sayfa rengi ile aynı
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
  };

  // İlk link stili (eco) - ilk link biraz daha koyu gri
  const firstLinkStyle = {
    padding: '15px 25px',
    fontWeight: 500,
    fontSize: '15px',
    color: '#333',
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
    padding: '15px 25px',
    fontWeight: 500,
    fontSize: '15px',
    color: '#333',
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
    transition: 'background-color 0.2s',
    borderRight: '1px solid #d1d1d1', // Daha belirgin ayraç
  };

  // Son link stili (Early Access)
  const lastLinkStyle = {
    padding: '15px 25px',
    fontWeight: 500,
    fontSize: '15px',
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

  // Hamburger menü stili
  const burgerStyle = {
    position: 'absolute',
    right: '20px',
    top: '10px',
    background: 'white',
    borderRadius: '50%',
    padding: '5px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
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
      `}</style>

      {/* Ana navbar */}
      <Box style={navbarContainerStyle}>
        {/* Oval hap şeklindeki navbar */}
        <div style={navbarBackgroundStyle}>
          {navItems.map((item, index) => (
            <Link
              key={item.path}
              href={item.path}
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

        {/* Hamburger Menü - sadece mobil görünümde */}
        {isMobile && (
          <Burger 
            opened={opened} 
            onClick={toggle} 
            aria-label="Toggle navigation"
            style={burgerStyle}
          />
        )}
      </Box>

      {/* Sayfanın geri kalanı için boşluk - arka plan rengi sayfayla aynı */}
      <div style={{ height: '90px', background: pageBackgroundColor }} />

      {/* Drawer - Mobil Menü */}
      <Drawer
        opened={opened}
        onClose={close}
        padding="xl"
        size="100%"
        position="right"
        styles={{
          body: { padding: '20px' },
          inner: { height: '100vh' }
        }}
      >
        <Stack gap="xl">
          {/* Logo ve Kapat */}
          <Group position="apart">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <IconPill size={24} />
              <Text fw={600}>DrugLLM</Text>
            </div>
            <Button 
              variant="subtle" 
              onClick={close} 
              radius="xl"
            >
              Kapat
            </Button>
          </Group>

          <Stack gap="md">
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                onClick={close}
                style={{
                  display: 'block',
                  padding: '16px',
                  color: isActive(item.path) ? theme.colors.primary[7] : theme.colors.dark[7],
                  fontWeight: isActive(item.path) ? 600 : 500,
                  textDecoration: 'none',
                  transition: 'all 0.2s ease',
                  backgroundColor: isActive(item.path) ? 'rgba(0, 0, 0, 0.05)' : 'transparent',
                  borderRadius: theme.radius.md,
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
            ))}
          </Stack>
        </Stack>
      </Drawer>
    </>
  );
};

export default Navbar; 