'use client'

import { useState, useEffect } from 'react';
import { Paper, Text, Avatar, Group, Box, Progress, Skeleton } from '@mantine/core';
import { IconRobot, IconUser, IconBrain, IconCheck } from '@tabler/icons-react';

export default function StreamingChatMessage({ message, isMobile, isStreaming = false, streamingContent = '' }) {
  const isBot = message.role === 'assistant' || message.role === 'system';
  const [displayedContent, setDisplayedContent] = useState('');
  const [showThinkingIndicator, setShowThinkingIndicator] = useState(true);

  // Content'i güncelle
  useEffect(() => {
    if (isStreaming && streamingContent) {
      setDisplayedContent(streamingContent);
      setShowThinkingIndicator(false);
    } else {
      setDisplayedContent(message.content || '');
      setShowThinkingIndicator(isStreaming && !streamingContent);
    }
  }, [isStreaming, streamingContent, message.content]);

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
        boxShadow: isStreaming 
          ? '0 4px 20px rgba(25, 118, 210, 0.15)' 
          : '0 2px 8px rgba(0,0,0,0.05)',
        border: isBot 
          ? `1px solid ${isStreaming ? 'rgba(25, 118, 210, 0.3)' : 'rgba(25, 118, 210, 0.2)'}` 
          : '1px solid rgba(0, 200, 83, 0.2)',
        position: 'relative',
        overflow: 'visible',
        transition: 'all 0.3s ease',
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
            transition: 'transform 0.2s ease',
            transform: isStreaming && isBot ? 'scale(1.05)' : 'scale(1)',
          }}
        >
          {isBot ? <IconRobot size={isMobile ? 12 : 14} color="white" /> : <IconUser size={isMobile ? 12 : 14} color="white" />}
        </Avatar>
        
        <Box style={{ flex: 1 }}>
          <Group gap="xs" align="center">
            <Text fw={600} size={isMobile ? "xs" : "sm"} style={{ color: isBot ? 'var(--primary)' : 'var(--secondary)' }}>
              {isBot ? 'İlaç Asistanı' : 'Siz'}
            </Text>
            
            {isStreaming && isBot && (
              <Group gap="4px" align="center">
                <IconBrain size={12} style={{ color: 'var(--primary)', opacity: 0.7 }} />
                <Text size="xs" style={{ color: 'var(--primary)', opacity: 0.8, fontSize: '10px' }}>
                  {showThinkingIndicator ? 'Düşünüyor' : 'Yanıtlıyor'}
                </Text>
              </Group>
            )}
          </Group>
          
          {/* Streaming progress indicator */}
          {isStreaming && isBot && (
            <Progress
              value={showThinkingIndicator ? 30 : 85}
              size="xs"
              radius="xl"
              color="primary"
              animated
              style={{ 
                marginTop: '4px',
                width: '80px',
                opacity: 0.8,
              }}
            />
          )}
        </Box>
      </Group>
      
      {/* Message content area */}
      <Box style={{ minHeight: isStreaming ? '24px' : 'auto' }}>
        {showThinkingIndicator ? (
          // Thinking phase - show skeleton loader
          <Box>
            <Skeleton height={8} radius="xl" mb="xs" width="70%" />
            <Skeleton height={8} radius="xl" mb="xs" width="90%" />
            <Skeleton height={8} radius="xl" width="60%" />
          </Box>
        ) : (
          // Content display
          <Text 
            size={isMobile ? "xs" : "sm"} 
            style={{ 
              lineHeight: isMobile ? 1.4 : 1.6, 
              color: 'var(--text-body)',
              wordBreak: 'break-word',
              fontSize: isMobile ? '13px' : '14px',
              whiteSpace: 'pre-wrap',
              opacity: isStreaming ? 0.95 : 1,
              transition: 'opacity 0.3s ease',
            }}
          >
            {displayedContent}
            
            {/* Modern streaming indicator */}
            {isStreaming && displayedContent && (
              <span style={{ 
                display: 'inline-block',
                width: '3px',
                height: '14px',
                backgroundColor: 'var(--primary)',
                marginLeft: '2px',
                borderRadius: '2px',
                animation: 'streamingPulse 1.2s ease-in-out infinite',
                verticalAlign: 'text-bottom',
              }} />
            )}
          </Text>
        )}
      </Box>
      
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
          borderLeft: isBot ? `1px solid ${isStreaming ? 'rgba(25, 118, 210, 0.3)' : 'rgba(25, 118, 210, 0.2)'}` : 'none',
          borderBottom: isBot ? `1px solid ${isStreaming ? 'rgba(25, 118, 210, 0.3)' : 'rgba(25, 118, 210, 0.2)'}` : 'none',
          borderRight: !isBot ? '1px solid rgba(0, 200, 83, 0.2)' : 'none',
          borderTop: !isBot ? '1px solid rgba(0, 200, 83, 0.2)' : 'none',
          zIndex: -1,
          display: isMobile && isBot ? 'none' : 'block',
        }}
      />

      {/* CSS animasyonları */}
      <style jsx>{`
        @keyframes streamingPulse {
          0%, 100% { 
            opacity: 1;
            transform: scaleY(1);
          }
          50% { 
            opacity: 0.4;
            transform: scaleY(0.8);
          }
        }
      `}</style>
    </Paper>
  );
} 