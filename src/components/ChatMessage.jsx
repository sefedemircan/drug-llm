'use client'

import { Paper, Text, Avatar, Group } from '@mantine/core';
import { IconRobot, IconUser } from '@tabler/icons-react';

export default function ChatMessage({ message }) {
  const isBot = message.role === 'system';
  
  return (
    <Paper
      p="md"
      radius="lg"
      withBorder={false}
      style={{
        backgroundColor: isBot ? 'var(--chat-bot-message)' : 'var(--chat-user-message)',
        maxWidth: '85%',
        marginLeft: isBot ? 0 : 'auto',
        marginRight: isBot ? 'auto' : 0,
        border: '1px solid var(--border-color)',
      }}
    >
      <Group gap="xs" mb="xs" align="center">
        <Avatar 
          color={isBot ? "primary" : "secondary"} 
          radius="xl" 
          size="sm"
          style={{ 
            backgroundColor: isBot ? 'var(--primary-light)' : '#D1ECE1',
            color: isBot ? 'var(--primary)' : 'var(--secondary)',
          }}
        >
          {isBot ? <IconRobot size={14} /> : <IconUser size={14} />}
        </Avatar>
        <Text size="xs" fw={500} style={{ color: 'var(--text-muted)' }}>
          {isBot ? 'İlaç Asistanı' : 'Siz'}
        </Text>
      </Group>
      
      <Text size="sm" style={{ lineHeight: 1.5, color: 'var(--text-body)' }}>{message.content}</Text>
    </Paper>
  );
} 