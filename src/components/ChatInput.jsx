'use client'

import { useState } from 'react';
import { TextInput, ActionIcon, Group, Paper, Button, Flex } from '@mantine/core';
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
    }
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
        minHeight: '70px'
      }}
    >
      <form onSubmit={handleSubmit} style={{ height: '100%' }}>
        <Flex direction="column" style={{ height: '100%', position: 'relative' }}>
          <Group align="center" wrap="nowrap" spacing="xs" style={{ marginBottom: '32px' }}>
            <ActionIcon 
              variant="transparent" 
              color="gray" 
              size="md"
              pl="md"
            >
              <IconPlus size={20} stroke={1.5} color="var(--text-muted)" />
            </ActionIcon>
            
            <TextInput
              placeholder="İlaçlar hakkında bir soru sorun..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              size="md"
              style={{ 
                flex: 1,
              }}
              styles={{
                input: { 
                  border: 'none',
                  padding: '15px 0',
                  backgroundColor: 'transparent',
                  fontSize: '16px',
                  minHeight: '56px',
                  color: 'var(--text-body)',
                },
                wrapper: {
                  backgroundColor: 'transparent',
                },
                root: {
                  width: '100%'
                }
              }}
            />

            <Group spacing={8} mr="xs">
              <ActionIcon
                radius="xl"
                variant="transparent"
                color="gray.5"
              >
                <IconMicrophone size={20} stroke={1.5} color="var(--text-muted)" />
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
                <IconArrowUp size={20} stroke={1.5} color={message.trim() ? "var(--primary)" : "var(--border-color)"} />
              </ActionIcon>
            </Group>
          </Group>
          
          <Group spacing={8} style={{ position: 'absolute', bottom: '8px', left: '16px' }}>
            <Button
              variant="subtle"
              radius="xl"
              compact
              styles={{
                root: {
                  backgroundColor: activeMode === 'search' ? 'var(--primary-light)' : 'var(--chat-bg)',
                  color: activeMode === 'search' ? 'var(--primary)' : 'var(--text-body)',
                  border: '1px solid var(--border-color)',
                  padding: '4px 12px',
                  height: '30px',
                  '&:hover': {
                    backgroundColor: 'var(--primary-light)'
                  }
                },
                inner: {
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }
              }}
              onClick={() => handleModeSelect('search')}
            >
              <IconWorld size={16} stroke={1.5} /> Search
            </Button>

            <Button
              variant="subtle"
              radius="xl"
              compact
              styles={{
                root: {
                  backgroundColor: activeMode === 'reason' ? 'var(--primary-light)' : 'var(--chat-bg)',
                  color: activeMode === 'reason' ? 'var(--primary)' : 'var(--text-body)',
                  border: '1px solid var(--border-color)',
                  padding: '4px 12px',
                  height: '30px',
                  '&:hover': {
                    backgroundColor: 'var(--primary-light)'
                  }
                },
                inner: {
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }
              }}
              onClick={() => handleModeSelect('reason')}
            >
              <IconBulb size={16} stroke={1.5} /> Reason
            </Button>

            <ActionIcon
              radius="xl"
              variant="subtle"
              style={{ 
                backgroundColor: 'var(--chat-bg)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-muted)'
              }}
            >
              <IconDotsCircleHorizontal size={16} stroke={1.5} />
            </ActionIcon>
          </Group>
        </Flex>
      </form>
    </Paper>
  );
} 