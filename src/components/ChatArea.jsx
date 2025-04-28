'use client'

import { useEffect, useRef } from 'react';
import { Stack, Box, Text, ActionIcon, Tooltip } from '@mantine/core';
import { IconInfoCircle, IconChevronLeft, IconRobot } from '@tabler/icons-react';
import ChatInput from './ChatInput';
import ChatMessage from './ChatMessage';
import { useChat } from '../context/ChatContext';

export default function ChatArea({ isMobile, navbarOpened, sidebarWidth = 0, onOpenSidebar }) {
  const { currentChat, addMessageToCurrentChat } = useChat();
  const messagesEndRef = useRef(null);
  const containerRef = useRef(null);
  
  // Scroll işlemini yöneten fonksiyon
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  // Yeni mesaj geldiğinde otomatik scroll
  useEffect(() => {
    scrollToBottom();
  }, [currentChat.messages]);

  const handleSendMessage = (message) => {
    addMessageToCurrentChat(message);
  };

  return (
    <Stack
      h="100%"
      ref={containerRef}
      style={{ 
        backgroundColor: 'var(--chat-bg)',
        position: 'relative',
        backgroundImage: 'linear-gradient(to bottom, rgba(225, 245, 254, 0.3), rgba(224, 247, 234, 0.2))',
        width: '100%',
        minHeight: isMobile ? 'calc(100vh - 60px)' : '100vh',
      }}
    >
      <Box
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '50px',
          backgroundColor: 'var(--primary)',
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          padding: '0 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          zIndex: 10,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {isMobile && (
            <ActionIcon 
              variant="subtle" 
              color="white" 
              onClick={onOpenSidebar}
              style={{ marginRight: '5px' }}
            >
              <IconChevronLeft size={18} />
            </ActionIcon>
          )}
          <Text fw={600} c="white" style={{ 
            fontSize: '16px', 
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            maxWidth: isMobile ? 'calc(100vw - 100px)' : '500px'
          }}>
            {currentChat.title}
          </Text>
        </div>
        
        <Tooltip label="DrugLLM, ilaç bilgilerini sağlayan bir yapay zeka asistanıdır" position="bottom" withArrow>
          <ActionIcon variant="subtle" color="white">
            <IconInfoCircle size={18} />
          </ActionIcon>
        </Tooltip>
      </Box>

      <Box
        style={{ 
          height: 'calc(100% - 80px)',
          overflowY: 'auto',
          paddingLeft: isMobile ? '12px' : '16px',
          paddingRight: isMobile ? '12px' : '16px',
          paddingTop: '60px', // Başlık için ekstra üst boşluk
          paddingBottom: isMobile ? '120px' : '100px', // Input yüksekliğini hesaba katan padding
          backgroundPosition: 'center',
          backgroundSize: 'cover',
          width: '100%',
          maxWidth: '100%',
          position: 'relative',
        }}
      >
        <Stack gap={isMobile ? "md" : "lg"} style={{ 
          maxWidth: '900px', 
          margin: '0 auto',
          width: '100%'
        }}>
          {currentChat.messages.length === 0 ? (
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column',
              alignItems: 'center', 
              justifyContent: 'center',
              height: '100%',
              padding: '20px',
              color: 'var(--text-muted)',
              textAlign: 'center'
            }}>
              <IconRobot size={isMobile ? 48 : 64} stroke={1} style={{ marginBottom: '16px', opacity: 0.7 }} />
              <Text size={isMobile ? "sm" : "md"} style={{ maxWidth: '500px', lineHeight: 1.5 }}>
                İlaç Bilgi Chatbotu'na hoş geldiniz. İlaçlar, etkileri ve yan etkileri hakkında bana sorularınızı sorabilirsiniz.
              </Text>
            </div>
          ) : (
            currentChat.messages.map((message, index) => (
              <ChatMessage 
                key={index} 
                message={message}
                isMobile={isMobile}
              />
            ))
          )}
          {/* Scroll için referans noktası */}
          <div ref={messagesEndRef} style={{ height: 20 }} />
        </Stack>
      </Box>
      
      <Box 
        style={{ 
          background: 'linear-gradient(to top, var(--chat-bg) 85%, transparent)',
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          paddingLeft: isMobile ? '15px' : '20px',
          paddingRight: isMobile ? '15px' : '20px',
          paddingBottom: isMobile ? '15px' : '20px',
          paddingTop: '40px',
          zIndex: 1000,
          width: '100%',
        }}
      >
        <Box style={{ 
          maxWidth: '900px', 
          margin: '0 auto',
          boxShadow: '0 -2px 10px rgba(0,0,0,0.05)',
          borderRadius: isMobile ? '10px' : '12px',
          overflow: 'hidden',
          border: '1px solid var(--border-color)',
          backgroundColor: 'white',
          width: '100%',
        }}>
          <ChatInput onSendMessage={handleSendMessage} isMobile={isMobile} />
        </Box>
      </Box>
    </Stack>
  );
} 