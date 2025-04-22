'use client'

import { useState } from 'react';
import { TextInput, ActionIcon, Group, Paper, Button, Flex, useMantineTheme, Textarea } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { 
  IconPlus,
  IconMicrophone,
  IconArrowUp,
  IconWorld,
  IconBulb,
  IconDotsCircleHorizontal
} from '@tabler/icons-react';

export default function ChatInput({ onSendMessage }) {
  const [message, setMessage] = useState('');
  const [activeMode, setActiveMode] = useState(null);
  const theme = useMantineTheme();
  const isMobile = useMediaQuery('(max-width: 768px)');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
    }
  };

  const handleKeyDown = (e) => {
    // Shift+Enter ile yeni satıra geçme
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
    // Shift+Enter basıldığında otomatik olarak yeni satır eklenecek
    // bunu Textarea bileşeni otomatik olarak yapacak
  };

  const handleModeSelect = (mode) => {
    setActiveMode(activeMode === mode ? null : mode);
  };

  return (
    <Paper
      p="sm"
      radius="xl"
      withBorder
      style={{ 
        backgroundColor: 'var(--background-white)',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        marginBottom: '20px',
        border: '1px solid var(--border-color)',
        position: 'relative',
        minHeight: '70px',
        width: '100%'
      }}
    >
      <form onSubmit={handleSubmit} style={{ height: '100%' }}>
        <Flex direction="column" style={{ height: '100%', position: 'relative' }}>
          <Group align="center" wrap="nowrap" spacing="xs" style={{ marginBottom: isMobile ? '40px' : '32px' }}>
            <ActionIcon 
              variant="filled"
              color="blue.4"
              size={isMobile ? "md" : "lg"}
              radius="xl"
              style={{
                border: '1px solid var(--primary-light)',
                background: 'var(--primary-light)',
                transition: 'all 0.2s ease',
                boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              sx={(theme) => ({
                '&:hover': {
                  background: 'var(--primary)',
                  transform: 'scale(1.05)'
                }
              })}
            >
              <IconPlus size={isMobile ? 20 : 22} stroke={2} color="var(--primary)" />
            </ActionIcon>
            
            <Textarea
              placeholder="İlaçlar hakkında bir soru sorun... (Shift+Enter ile yeni satır)"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              size="md"
              autosize
              maxRows={6}
              minRows={isMobile ? 1 : 2}
              style={{ 
                flex: 1,
              }}
              styles={{
                input: { 
                  border: 'none',
                  padding: isMobile ? '12px 0' : '15px 0',
                  backgroundColor: 'transparent',
                  fontSize: isMobile ? '14px' : '16px',
                  color: 'var(--text-body)',
                  resize: 'none',
                  overflow: 'auto',
                },
                wrapper: {
                  backgroundColor: 'transparent',
                },
                root: {
                  width: '100%'
                }
              }}
            />

            <Group spacing={isMobile ? 4 : 8} mt="lg" mr={isMobile ? "xs" : "md"}>
              <ActionIcon
                radius="xl"
                variant="transparent"
                color="gray.5"
              >
                <IconMicrophone size={isMobile ? 18 : 20} stroke={1.5} color="var(--text-muted)" />
              </ActionIcon>

              <ActionIcon
                radius="xl"
                variant="transparent"
                color="gray.5"
                onClick={handleSubmit}
                disabled={!message.trim()}
                style={{
                  border: message.trim() ? '1px solid var(--border-color)' : '1px solid transparent'
                }}
              >
                <IconArrowUp size={isMobile ? 18 : 20} stroke={1.5} color={message.trim() ? "var(--primary)" : "var(--border-color)"} />
              </ActionIcon>
            </Group>
          </Group>
          
          <Group 
            spacing={isMobile ? 4 : 8} 
            style={{ 
              position: 'absolute', 
              bottom: '8px', 
              left: isMobile ? '8px' : '16px',
              maxWidth: '100%',
              overflow: 'auto',
              flexWrap: isMobile ? 'nowrap' : 'wrap'
            }}
          >
            <Button
              variant="subtle"
              radius="xl"
              compact="true"
              styles={{
                root: {
                  backgroundColor: activeMode === 'search' ? 'var(--primary-light)' : 'var(--chat-bg)',
                  color: activeMode === 'search' ? 'var(--primary)' : 'var(--text-body)',
                  border: '1px solid var(--border-color)',
                  padding: isMobile ? '2px 8px' : '4px 12px',
                  height: isMobile ? '26px' : '30px',
                  minWidth: isMobile ? 'auto' : undefined,
                  '&:hover': {
                    backgroundColor: 'var(--primary-light)'
                  }
                },
                inner: {
                  display: 'flex',
                  alignItems: 'center',
                  gap: isMobile ? '2px' : '4px',
                  fontSize: isMobile ? '12px' : '14px'
                }
              }}
              onClick={() => handleModeSelect('search')}
            >
              <IconWorld size={isMobile ? 14 : 16} stroke={1.5} /> 
              {isMobile ? '' : 'Search'}
            </Button>

            <Button
              variant="subtle"
              radius="xl"
              compact="true"
              styles={{
                root: {
                  backgroundColor: activeMode === 'reason' ? 'var(--primary-light)' : 'var(--chat-bg)',
                  color: activeMode === 'reason' ? 'var(--primary)' : 'var(--text-body)',
                  border: '1px solid var(--border-color)',
                  padding: isMobile ? '2px 8px' : '4px 12px',
                  height: isMobile ? '26px' : '30px',
                  minWidth: isMobile ? 'auto' : undefined,
                  '&:hover': {
                    backgroundColor: 'var(--primary-light)'
                  }
                },
                inner: {
                  display: 'flex',
                  alignItems: 'center',
                  gap: isMobile ? '2px' : '4px',
                  fontSize: isMobile ? '12px' : '14px'
                }
              }}
              onClick={() => handleModeSelect('reason')}
            >
              <IconBulb size={isMobile ? 14 : 16} stroke={1.5} /> 
              {isMobile ? '' : 'Reason'}
            </Button>

            <ActionIcon
              radius="xl"
              variant="subtle"
              style={{ 
                backgroundColor: 'var(--chat-bg)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-muted)',
                height: isMobile ? '26px' : '30px',
                width: isMobile ? '26px' : '30px'
              }}
            >
              <IconDotsCircleHorizontal size={isMobile ? 14 : 16} stroke={1.5} />
            </ActionIcon>
          </Group>
        </Flex>
      </form>
    </Paper>
  );
} 