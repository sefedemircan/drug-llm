'use client'

import { useState, useEffect } from 'react';
import { Paper, Text, Avatar, Group, Box } from '@mantine/core';
import { IconRobot, IconUser } from '@tabler/icons-react';

export default function StreamingChatMessage({ message, isMobile, isStreaming = false, streamingContent = '' }) {
  const isBot = message.role === 'assistant' || message.role === 'system';
  const [displayedContent, setDisplayedContent] = useState('');
  const [showCursor, setShowCursor] = useState(true);

  // Typewriter efekti için content'i güncelle
  useEffect(() => {
    if (isStreaming && streamingContent) {
      setDisplayedContent(streamingContent);
    } else {
      setDisplayedContent(message.content || '');
    }
  }, [isStreaming, streamingContent, message.content]);

  // Cursor animasyonu için
  useEffect(() => {
    if (isStreaming) {
      const interval = setInterval(() => {
        setShowCursor(prev => !prev);
      }, 500);
      return () => clearInterval(interval);
    } else {
      setShowCursor(false);
    }
  }, [isStreaming]);

  return (
    <Paper
      p={isMobile ? "xs" : "md"}
      radius="lg"
      withBorder={false}
      style={{
        backgroundColor: isBot ? 'var(--chat-bot-message)' : 'var(--chat-user-message)',
        maxWidth: isMobile ? '95%' : '85%',
        marginLeft: isBot ? 0 : 'auto',
        marginRight: isBot ? 'auto' : 0,
        marginBottom: isMobile ? '8px' : '16px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
        border: isBot ? '1px solid rgba(25, 118, 210, 0.2)' : '1px solid rgba(0, 200, 83, 0.2)',
        position: 'relative',
        overflow: 'visible',
        opacity: isStreaming ? 0.95 : 1,
        transition: 'opacity 0.3s ease',
      }}
    >
      <Group gap={isMobile ? "8px" : "xs"} mb={isMobile ? "4px" : "xs"} align="center">
        <Avatar 
          color={isBot ? "primary" : "secondary"} 
          radius="xl" 
          size={isMobile ? "xs" : "sm"}
          style={{ 
            backgroundColor: isBot ? 'var(--primary)' : 'var(--secondary)',
            color: 'white',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            animation: isStreaming && isBot ? 'pulse 2s infinite' : 'none',
          }}
        >
          {isBot ? <IconRobot size={isMobile ? 12 : 14} color="white" /> : <IconUser size={isMobile ? 12 : 14} color="white" />}
        </Avatar>
        <Text fw={600} size={isMobile ? "xs" : "sm"} style={{ color: isBot ? 'var(--primary)' : 'var(--secondary)' }}>
          {isBot ? (isStreaming ? 'İlaç Asistanı yazıyor...' : 'İlaç Asistanı') : 'Siz'}
        </Text>
      </Group>
      
      <Text size={isMobile ? "xs" : "sm"} style={{ 
        lineHeight: isMobile ? 1.4 : 1.6, 
        color: 'var(--text-body)',
        wordBreak: 'break-word',
        fontSize: isMobile ? '13px' : '14px',
        whiteSpace: 'pre-wrap',
      }}>
        {displayedContent}
        {isStreaming && showCursor && (
          <span style={{ 
            animation: 'blink 1s infinite',
            fontSize: '1.2em',
            color: 'var(--primary)',
            marginLeft: '2px'
          }}>|</span>
        )}
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
          borderLeft: isBot ? '1px solid rgba(25, 118, 210, 0.2)' : 'none',
          borderBottom: isBot ? '1px solid rgba(25, 118, 210, 0.2)' : 'none',
          borderRight: !isBot ? '1px solid rgba(0, 200, 83, 0.2)' : 'none',
          borderTop: !isBot ? '1px solid rgba(0, 200, 83, 0.2)' : 'none',
          zIndex: -1,
          display: isMobile && isBot ? 'none' : 'block',
        }}
      />

      {/* CSS animasyonları için style tag */}
      <style jsx>{`
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
        
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }
      `}</style>
    </Paper>
  );
} 