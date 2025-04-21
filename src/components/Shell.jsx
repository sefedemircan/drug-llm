'use client'

import { useState, useEffect } from 'react';
import { Box, Burger, Group, Title, Flex, ActionIcon } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';
import ChatSidebar from './ChatSidebar';
import ChatArea from './ChatArea';

export default function Shell() {
  const [opened, { toggle, close, open }] = useDisclosure(true);
  const [isMobile, setIsMobile] = useState(false);

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

  return (
    <Flex h="100vh" style={{ overflow: 'hidden' }}>
      {/* Sidebar */}
      <Box
        style={{
          width: opened ? '300px' : '0px',
          height: '100vh',
          backgroundColor: 'var(--sidebar-bg)',
          borderRight: opened ? '1px solid var(--border-color)' : 'none',
          overflow: 'hidden',
          transition: 'width 0.3s ease',
          position: 'relative',
          zIndex: 1001,
        }}
      >
        {opened && <ChatSidebar />}
      </Box>

      {/* Main Content */}
      <Box style={{ flex: 1, height: '100vh', display: 'flex', flexDirection: 'column', position: 'relative' }}>
        {/* Header */}
        <Box
          style={{
            height: '60px',
            borderBottom: '1px solid var(--border-color)',
            backgroundColor: 'var(--background-white)',
            padding: '0 16px',
            display: 'flex',
            alignItems: 'center',
            position: 'sticky',
            top: 0,
            zIndex: 1000,
          }}
        >
          <Group>
            <ActionIcon 
              variant="subtle" 
              color="primary"
              onClick={toggle} 
              aria-label={opened ? "Kenar çubuğunu kapat" : "Kenar çubuğunu aç"}
            >
              {opened ? <IconChevronLeft size={18} /> : <IconChevronRight size={18} />}
            </ActionIcon>
            <Title order={3} style={{ fontSize: "20px", color: "var(--text-title)" }}>İlaç Bilgi Chatbotu</Title>
          </Group>
        </Box>

        {/* Chat Area */}
        <Box style={{ flex: 1, overflow: 'hidden' }}>
          <ChatArea isMobile={isMobile} navbarOpened={opened} sidebarWidth={opened ? 300 : 0} />
        </Box>
      </Box>
    </Flex>
  );
} 