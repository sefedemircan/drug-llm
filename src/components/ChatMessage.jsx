'use client'

import { Paper, Text, Avatar, Group, Box, ActionIcon, Tooltip } from '@mantine/core';
import { IconRobot, IconUser, IconCopy, IconCheck } from '@tabler/icons-react';
import { useState } from 'react';

export default function ChatMessage({ message, isMobile, showTimestamp = false }) {
  const isBot = message.role === 'assistant' || message.role === 'system';
  const [copied, setCopied] = useState(false);
  
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Copy failed:', err);
    }
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    
    if (diffMins < 1) return 'Şimdi';
    if (diffMins < 60) return `${diffMins}dk önce`;
    if (diffHours < 24) return `${diffHours}sa önce`;
    return date.toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit' });
  };
  
  return (
    <Paper
      p={isMobile ? "xs" : "md"}
      radius="lg"
      withBorder={false}
      className="chat-message"
      style={{
        backgroundColor: isBot ? 'var(--chat-bot-message)' : 'var(--chat-user-message)',
        maxWidth: isMobile ? '95%' : '85%',
        marginLeft: isBot ? 0 : 'auto',
        marginRight: isBot ? 'auto' : 0,
        marginBottom: isMobile ? '8px' : '16px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
        border: isBot ? '1px solid var(--primary-light)' : '1px solid var(--secondary-light)',
        position: 'relative',
        overflow: 'visible',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
      }}
      onMouseEnter={(e) => {
        if (!isMobile) {
          e.currentTarget.style.transform = 'translateY(-1px)';
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
        }
      }}
      onMouseLeave={(e) => {
        if (!isMobile) {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.05)';
        }
      }}
    >
      <Group gap={isMobile ? "8px" : "xs"} mb={isMobile ? "4px" : "xs"} align="center" justify="space-between">
        <Group gap={isMobile ? "8px" : "xs"} align="center">
          <Avatar 
            color={isBot ? "primary" : "secondary"} 
            radius="xl" 
            size={isMobile ? "xs" : "sm"}
            style={{ 
              backgroundColor: isBot ? 'var(--primary)' : 'var(--secondary)',
              color: 'white',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            }}
          >
            {isBot ? <IconRobot size={isMobile ? 12 : 14} color="white" /> : <IconUser size={isMobile ? 12 : 14} color="white" />}
          </Avatar>
          
          <Box>
            <Text fw={600} size={isMobile ? "xs" : "sm"} style={{ color: isBot ? 'var(--primary)' : 'var(--secondary)' }}>
              {isBot ? 'İlaç Asistanı' : 'Siz'}
            </Text>
            
            {showTimestamp && message.created_at && (
              <Text size="xs" style={{ color: 'var(--text-muted)', fontSize: '10px' }}>
                {formatTimestamp(message.created_at)}
              </Text>
            )}
          </Box>
        </Group>
        
        {/* Copy button for bot messages */}
        {isBot && !isMobile && (
          <Tooltip label={copied ? 'Kopyalandı!' : 'Kopyala'} position="left" withArrow>
            <ActionIcon
              variant="subtle"
              size="sm"
              color={copied ? "green" : "gray"}
              onClick={handleCopy}
              className="copy-button"
              style={{ 
                opacity: 0.6,
                transition: 'opacity 0.2s ease',
              }}
              onMouseEnter={(e) => e.target.style.opacity = 1}
              onMouseLeave={(e) => e.target.style.opacity = 0.6}
            >
              {copied ? <IconCheck size={14} /> : <IconCopy size={14} />}
            </ActionIcon>
          </Tooltip>
        )}
      </Group>
      
      <Text size={isMobile ? "xs" : "sm"} style={{ 
        lineHeight: isMobile ? 1.4 : 1.6, 
        color: 'var(--text-body)',
        wordBreak: 'break-word',
        fontSize: isMobile ? '13px' : '14px',
        whiteSpace: 'pre-wrap',
      }}>
        {message.content}
      </Text>
      
      {/* Konuşma balonu efekti için ok */}
      <Box 
        style={{
          position: 'absolute',
          width: isMobile ? '8px' : '10px',
          height: isMobile ? '8px' : '10px',
          backgroundColor: isBot ? 'var(--chat-bot-message)' : 'var(--chat-user-message)',
          transform: 'rotate(45deg)',
          top: '15px',
          left: isBot ? '-4px' : 'auto',
          right: isBot ? 'auto' : '-4px',
          borderLeft: isBot ? '1px solid var(--primary-light)' : 'none',
          borderBottom: isBot ? '1px solid var(--primary-light)' : 'none',
          borderRight: !isBot ? '1px solid var(--secondary-light)' : 'none',
          borderTop: !isBot ? '1px solid var(--secondary-light)' : 'none',
          zIndex: -1,
          display: isMobile && isBot ? 'none' : 'block',
        }}
      />
    </Paper>
  );
} 