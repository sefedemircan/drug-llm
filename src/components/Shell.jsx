'use client'

import { useState, useEffect } from 'react';
import { Box, Burger, Group, Title, Flex, ActionIcon, Portal, Overlay, Button, Transition, Menu } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconChevronLeft, IconChevronRight, IconX, IconLogout, IconUser, IconHome, IconSettings } from '@tabler/icons-react';
import ThemeToggle from './ThemeToggle';
import ChatSidebar from './ChatSidebar';
import ChatArea from './ChatArea';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';

export default function Shell() {
  const [opened, { toggle, close, open }] = useDisclosure(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isSmallMobile, setIsSmallMobile] = useState(false);
  const { logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      const smallMobile = window.innerWidth < 480;
      setIsMobile(mobile);
      setIsSmallMobile(smallMobile);
      if (mobile) close();
      else open();
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, [close, open]);

  // Mobilde sidebar açıldığında body scroll'unu engelle
  useEffect(() => {
    if (isMobile && opened) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isMobile, opened]);

  const handleProfileClick = () => {
    router.push('/profile');
  };

  const handleHomeClick = () => {
    router.push('/');
  };

  // Mobilde chat area'dan sidebar'ı açmak için
  const handleOpenSidebar = () => {
    if (isMobile) {
      open();
    }
  };

  return (
    <Flex h="100vh" style={{ overflow: 'hidden' }}>
      {/* Mobile Sidebar Overlay */}
      {isMobile && opened && (
        <Portal>
          <Overlay 
            color="#000" 
            opacity={0.5} 
            zIndex={1000}
            onClick={close}
          />
        </Portal>
      )}
      
      {/* Sidebar */}
      <Transition
        mounted={opened}
        transition="slide-right"
        duration={300}
        timingFunction="ease"
      >
        {(styles) => (
          <Box
            style={{
              width: opened ? (isMobile ? '100%' : '300px') : '0px',
              height: '100vh',
              backgroundColor: 'var(--sidebar-bg)',
              borderRight: opened ? '1px solid var(--border-color)' : 'none',
              overflow: 'hidden',
              position: isMobile && opened ? 'fixed' : 'relative',
              zIndex: 1001,
              boxShadow: opened ? '2px 0 5px rgba(0,0,0,0.03)' : 'none',
              left: 0,
              top: 0,
              ...styles
            }}
          >
            {opened && (
              <>
                {isMobile && (
                  <ActionIcon 
                    style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      zIndex: 1002,
                    }}
                    radius="xl"
                    color="gray"
                    variant="subtle"
                    onClick={close}
                  >
                    <IconX size={20} />
                  </ActionIcon>
                )}
                <ChatSidebar isMobile={isMobile} onClose={close} />
              </>
            )}
          </Box>
        )}
      </Transition>

      {/* Main Content */}
      <Box style={{ 
        flex: 1, 
        height: '100vh', 
        display: 'flex', 
        flexDirection: 'column', 
        position: 'relative',
        width: isMobile ? '100%' : `calc(100% - ${opened ? '300px' : '0px'})`,
        transition: 'width 0.3s ease'
      }}>
        {/* Header */}
        <Box
          style={{
            height: '60px',
            borderBottom: '1px solid var(--border-color)',
            backgroundColor: 'var(--background-white)',
            paddingTop: 0,
            paddingBottom: 0,
            paddingLeft: '16px',
            paddingRight: '16px',
            display: 'flex',
            alignItems: 'center',
            position: 'sticky',
            top: 0,
            zIndex: 999,
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            justifyContent: 'space-between',
          }}
        >
          <Group>
            <ActionIcon 
              variant="subtle" 
              color="primary"
              onClick={toggle} 
              aria-label={opened ? "Kenar çubuğunu kapat" : "Kenar çubuğunu aç"}
              style={{ 
                display: isMobile && opened ? 'none' : 'flex' 
              }}
            >
              {opened && !isMobile ? <IconChevronLeft size={18} /> : <IconChevronRight size={18} />}
            </ActionIcon>
            <Title order={3} style={{ fontSize: isSmallMobile ? "18px" : "20px", color: "var(--text-title)" }}>DrugLLM</Title>
          </Group>
          
          <Group spacing="sm">
            <ThemeToggle size={16} />
            
            <Menu
              shadow="md"
              width={200}
              position="bottom-end"
              transitionProps={{ transition: 'pop' }}
              withinPortal={false}
            >
              <Menu.Target>
                <ActionIcon
                  variant="subtle"
                  color="gray"
                  size="lg"
                  style={{
                    backgroundColor: 'var(--background-white)',
                    border: '1px solid var(--border-color)',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--primary-light)';
                    e.currentTarget.style.borderColor = 'var(--primary)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--background-white)';
                    e.currentTarget.style.borderColor = 'var(--border-color)';
                  }}
                >
                  <IconSettings size={18} />
                </ActionIcon>
              </Menu.Target>

              <Menu.Dropdown
                style={{
                  backgroundColor: 'var(--background-white)',
                  border: '1px solid var(--border-color)',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                }}
              >
                <Menu.Item
                  leftSection={<IconHome size={16} />}
                  onClick={handleHomeClick}
                  style={{
                    color: 'var(--text-body)',
                    fontSize: '14px',
                    padding: '8px 12px',
                  }}
                >
                  Ana Sayfa
                </Menu.Item>
                
                <Menu.Item
                  leftSection={<IconUser size={16} />}
                  onClick={handleProfileClick}
                  style={{
                    color: 'var(--text-body)',
                    fontSize: '14px',
                    padding: '8px 12px',
                  }}
                >
                  Profil
                </Menu.Item>
                
                <Menu.Divider 
                  style={{ 
                    borderColor: 'var(--border-color-light)',
                    margin: '4px 0'
                  }} 
                />
                
                <Menu.Item
                  leftSection={<IconLogout size={16} />}
                  onClick={logout}
                  color="red"
                  style={{
                    fontSize: '14px',
                    padding: '8px 12px',
                  }}
                >
                  Çıkış Yap
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </Group>
        </Box>

        {/* Chat Area */}
        <Box style={{ 
          flex: 1, 
          overflow: 'hidden', 
          width: '100%',
          transition: 'width 0.3s ease, marginLeft 0.3s ease'
        }}>
          <ChatArea 
            isMobile={isMobile}
            navbarOpened={opened} 
            sidebarWidth={opened && !isMobile ? 300 : 0} 
            onOpenSidebar={handleOpenSidebar}
          />
        </Box>
      </Box>
    </Flex>
  );
} 