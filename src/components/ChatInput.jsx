'use client'

import { useState } from 'react';
import { TextInput, ActionIcon, Group, Paper, Tooltip } from '@mantine/core';
import { 
  IconArrowUp, 
  IconPlus, 
  IconWorld, 
  IconBulb, 
  IconMicrophone 
} from '@tabler/icons-react';

export default function ChatInput({ onSendMessage }) {
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
    }
  };

  return (
    <Paper
      p="xs"
      radius="lg"
      withBorder
      style={{ 
        backgroundColor: 'var(--background-white)',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
      }}
    >
      <form onSubmit={handleSubmit}>
        <Group align="center" wrap="nowrap">
          <ActionIcon 
            variant="subtle" 
            color="gray" 
            size="md"
            radius="xl"
            style={{ opacity: 0.7 }}
          >
            <IconPlus size={18} />
          </ActionIcon>
          
          <TextInput
            placeholder="İlaçlar hakkında bir soru sorun..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            radius="xl"
            size="md"
            style={{ 
              flex: 1,
            }}
            styles={{
              input: { 
                border: 'none',
                padding: '10px 12px',
                backgroundColor: 'transparent',
                fontSize: '15px',
                minHeight: '48px',
                color: 'var(--text-body)',
              },
              wrapper: {
                backgroundColor: 'transparent',
              }
            }}
            rightSectionWidth={90}
            rightSection={
              <Group gap={4} pr={8}>
                <ActionIcon variant="subtle" color="primary" size="sm" radius="xl">
                  <IconWorld size={16} style={{ opacity: 0.7 }} />
                </ActionIcon>
                
                <ActionIcon variant="subtle" color="accent" size="sm" radius="xl">
                  <IconBulb size={16} style={{ opacity: 0.7 }} />
                </ActionIcon>
                
                <ActionIcon variant="subtle" color="gray" size="sm" radius="xl">
                  <IconMicrophone size={16} style={{ opacity: 0.7 }} />
                </ActionIcon>
              </Group>
            }
          />
          
          <ActionIcon
            variant="filled"
            color="accent"
            size="md"
            radius="xl"
            onClick={handleSubmit}
            disabled={!message.trim()}
          >
            <IconArrowUp size={18} />
          </ActionIcon>
        </Group>
      </form>
    </Paper>
  );
} 