'use client'

import { useState, useEffect } from 'react';
import { Box, Burger, Group, Title, Flex, ActionIcon, Portal, Overlay, Button } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconChevronLeft, IconChevronRight, IconX, IconLogout, IconUser } from '@tabler/icons-react';
import ChatSidebar from './ChatSidebar';
import ChatArea from './ChatArea';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';

export default function Shell() {
  const [opened, { toggle, close, open }] = useDisclosure(true);
  const [isMobile, setIsMobile] = useState(false);
  const { logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
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
      <Box
        style={{
          width: opened ? (isMobile ? '100%' : '300px') : '0px',
          height: '100vh',
          backgroundColor: 'var(--sidebar-bg)',
          borderRight: opened ? '1px solid var(--border-color)' : 'none',
          overflow: 'hidden',
          transition: isMobile ? 'all 0.3s ease' : 'width 0.3s ease',
          position: isMobile && opened ? 'fixed' : 'relative',
          zIndex: 1001,
          boxShadow: opened ? '2px 0 5px rgba(0,0,0,0.03)' : 'none',
          left: 0,
          top: 0,
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
            <ChatSidebar />
          </>
        )}
      </Box>

      {/* Main Content */}
      <Box style={{ flex: 1, height: '100vh', display: 'flex', flexDirection: 'column', position: 'relative' }}>
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
            >
              {opened && !isMobile ? <IconChevronLeft size={18} /> : <IconChevronRight size={18} />}
            </ActionIcon>
            <Title order={3} style={{ fontSize: "20px", color: "var(--text-title)" }}>DrugLLM</Title>
          </Group>
          
          <Group spacing="sm">
            <Button 
              variant="subtle" 
              color="blue" 
              leftSection={<IconUser size={16} />}
              onClick={handleProfileClick}
            >
              Profil
            </Button>
            
            <Button 
              variant="subtle" 
              color="gray" 
              leftSection={<IconLogout size={16} />}
              onClick={logout}
            >
              Çıkış Yap
            </Button>
          </Group>
        </Box>

        {/* Chat Area */}
        <Box style={{ flex: 1, overflow: 'hidden' }}>
          <ChatArea isMobile={isMobile} navbarOpened={opened} sidebarWidth={opened && !isMobile ? 300 : 0} />
        </Box>
      </Box>
    </Flex>
  );
} 