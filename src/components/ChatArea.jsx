'use client'

import { useEffect, useRef, useState } from 'react';
import { Stack, Box, Text, ActionIcon, Tooltip } from '@mantine/core';
import { IconInfoCircle, IconChevronLeft, IconRobot } from '@tabler/icons-react';
import ChatInput from './ChatInput';
import ChatMessage from './ChatMessage';
import StreamingChatMessage from './StreamingChatMessage';
import { useChat } from '../context/ChatContext';
import { useAuth } from '../context/AuthContext';
import useUserData from '../hooks/useUserData';

export default function ChatArea({ isMobile, navbarOpened, sidebarWidth = 0, onOpenSidebar }) {
  const { currentChat, addUserMessage, addBotMessage, addBotMessageWithSessionId, isBotReplying, setIsBotReplying } = useChat();
  const { user } = useAuth();
  const { profileData, healthData } = useUserData();
  const messagesEndRef = useRef(null);
  const containerRef = useRef(null);
  
  // Streaming state
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingContent, setStreamingContent] = useState('');
  
  // Scroll işlemini yöneten fonksiyon
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  // Yeni mesaj geldiğinde otomatik scroll
  useEffect(() => {
    scrollToBottom();
  }, [currentChat?.messages, isBotReplying]);

  // Auto-scroll when messages change
  useEffect(() => {
    scrollToBottom();
  }, [currentChat?.messages, isBotReplying]);

  const handleSendMessage = async (message) => {
    if (!message?.trim()) return;
    
    try {
      setIsBotReplying(true);
      setIsStreaming(true);
      setStreamingContent('');
      
      console.log('🚀 handleSendMessage başladı:', message.substring(0, 50) + '...');
      
      // Add user message and get the updated chat with session ID
      const updatedChat = await addUserMessage(message);
      console.log('✅ User message added, updated chat:', updatedChat?.id);
      
      // Get the session ID from the updated chat
      const sessionId = updatedChat?.id || currentChat?.id;
      
      // DB commit işleminin tamamlanması için uzun bir delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('🔍 Session ID for streaming API call:', sessionId);
      console.log('💬 Current chat messages count:', currentChat?.messages?.length || 0);
      console.log('📋 Current chat info:', { 
        id: currentChat?.id, 
        title: currentChat?.title,
        messagesCount: currentChat?.messages?.length 
      });
      
      // Frontend'deki mevcut mesajları da logla
      console.log('🗨️ Current chat messages in frontend:', currentChat?.messages?.map((m, i) => ({
        index: i,
        role: m.role,
        content: m.content?.substring(0, 50) + '...'
      })));
      
      // Call streaming API
      const response = await fetch('/api/chat/stream', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: message,
          userId: user?.id,
          sessionId: sessionId,
          profileData: profileData,
          healthData: healthData
        }),
      });

      console.log('📡 Streaming response status:', response.status, response.statusText);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Read streaming response
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullResponse = '';

      while (true) {
        const { done, value } = await reader.read();
        
        if (done) break;
        
        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              
              if (data.type === 'chunk') {
                fullResponse += data.content;
                setStreamingContent(fullResponse);
              } else if (data.type === 'complete') {
                fullResponse = data.fullContent;
                setStreamingContent(fullResponse);
                
                // Save final message to database
                console.log('💾 Saving final streaming message to database');
                await addBotMessageWithSessionId(fullResponse, sessionId);
                
                setIsStreaming(false);
                console.log('✅ Streaming bot yanıtı tamamlandı');
              } else if (data.type === 'error') {
                console.error('❌ Streaming error:', data.error);
                setIsStreaming(false);
                await addBotMessage('Üzgünüm, bir hata oluştu. Lütfen tekrar deneyin.');
              }
            } catch (parseError) {
              console.error('❌ JSON parse error:', parseError);
            }
          }
        }
      }

    } catch (error) {
      console.error('❌ handleSendMessage hatası:', error);
      
      setIsStreaming(false);
      // Hata durumunda kullanıcıya bilgi ver
      try {
        await addBotMessage('Üzgünüm, bir hata oluştu. Lütfen tekrar deneyin.');
      } catch (addError) {
        console.error('❌ Hata mesajı eklenirken sorun:', addError);
      }
    } finally {
      setIsBotReplying(false);
    }
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
            {currentChat?.title || 'Yeni Sohbet'}
          </Text>
        </div>
        
        <div style={{ display: 'flex', gap: '8px' }}>
          <Tooltip label="DrugLLM, ilaç bilgilerini sağlayan bir yapay zeka asistanıdır" position="bottom" withArrow>
            <ActionIcon variant="subtle" color="white">
              <IconInfoCircle size={18} />
            </ActionIcon>
          </Tooltip>
        </div>
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
          {!currentChat || currentChat.messages.length === 0 ? (
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
            <>
              {currentChat.messages.map((message) => (
                <ChatMessage 
                  key={message.id}
                  message={message}
                  isMobile={isMobile}
                />
              ))}
              {isStreaming && (
                <StreamingChatMessage
                  key="streaming_message"
                  message={{ id: 'streaming_message', role: 'assistant', content: '' }}
                  isMobile={isMobile}
                  isStreaming={true}
                  streamingContent={streamingContent}
                />
              )}
              {isBotReplying && !isStreaming && (
                <ChatMessage
                  key="typing_indicator"
                  message={{ id: 'typing_indicator', role: 'system', content: '✍️ Yanıt hazırlanıyor...' }}
                  isMobile={isMobile}
                />
              )}
            </>
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