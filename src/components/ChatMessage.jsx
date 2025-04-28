'use client'

import { Paper, Text, Avatar, Group, Box } from '@mantine/core';
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
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
        border: isBot ? '1px solid rgba(25, 118, 210, 0.2)' : '1px solid rgba(0, 200, 83, 0.2)',
        position: 'relative',
        overflow: 'visible',
      }}
    >
      <Group gap="xs" mb="xs" align="center">
        <Avatar 
          color={isBot ? "primary" : "secondary"} 
          radius="xl" 
          size="sm"
          style={{ 
            backgroundColor: isBot ? 'var(--primary)' : 'var(--secondary)',
            color: 'white',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          }}
        >
          {isBot ? <IconRobot size={14} /> : <IconUser size={14} />}
        </Avatar>
        <Text fw={600} size="xs" style={{ color: isBot ? 'var(--primary)' : 'var(--secondary)' }}>
          {isBot ? 'İlaç Asistanı' : 'Siz'}
        </Text>
      </Group>
      
      <Text size="sm" style={{ 
        lineHeight: 1.6, 
        color: 'var(--text-body)',
      }}>
        {message.content}
      </Text>
      
      {/* Konuşma balonu efekti için ok */}
      <Box 
        style={{
          position: 'absolute',
          width: '10px',
          height: '10px',
          backgroundColor: isBot ? 'var(--chat-bot-message)' : 'var(--chat-user-message)',
          transform: 'rotate(45deg)',
          top: '15px',
          left: isBot ? '-5px' : 'auto',
          right: isBot ? 'auto' : '-5px',
          borderLeft: isBot ? '1px solid rgba(25, 118, 210, 0.2)' : 'none',
          borderBottom: isBot ? '1px solid rgba(25, 118, 210, 0.2)' : 'none',
          borderRight: !isBot ? '1px solid rgba(0, 200, 83, 0.2)' : 'none',
          borderTop: !isBot ? '1px solid rgba(0, 200, 83, 0.2)' : 'none',
          zIndex: -1,
        }}
      />
    </Paper>
  );
} 