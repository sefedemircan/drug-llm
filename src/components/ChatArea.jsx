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
  
  // Transition state for centered input
  const [isInputCentered, setIsInputCentered] = useState(true);
  
  // Check if chat is empty
  const isEmpty = !currentChat || currentChat.messages.length === 0;
  
  // Update centered state based on messages
  useEffect(() => {
    setIsInputCentered(isEmpty);
  }, [isEmpty]);
  
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
    
    // Input'u ilk mesaj öncesi ortalı konumdan çıkar
    if (isInputCentered) {
      setIsInputCentered(false);
    }
    
    try {
      setIsBotReplying(true);
      setIsStreaming(true);
      setStreamingContent('');
      
      //console.log('🚀 handleSendMessage başladı:', message.substring(0, 50) + '...');
      
      // Add user message and get the updated chat with session ID
      const updatedChat = await addUserMessage(message);
      //console.log('✅ User message added, updated chat:', updatedChat?.id);
      
      // Get the session ID from the updated chat
      const sessionId = updatedChat?.id || currentChat?.id;
      
      // DB commit işleminin tamamlanması için uzun bir delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      //console.log('🔍 Session ID for streaming API call:', sessionId);
      //console.log('💬 Current chat messages count:', currentChat?.messages?.length || 0);
      
      
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

      //console.log('📡 Streaming response status:', response.status, response.statusText);

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
                //console.log('💾 Saving final streaming message to database');
                await addBotMessageWithSessionId(fullResponse, sessionId);
                
                setIsStreaming(false);
                //console.log('✅ Streaming bot yanıtı tamamlandı');
              } else if (data.type === 'error') {
                //console.error('❌ Streaming error:', data.error);
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
        backgroundImage: 'var(--chat-bg-gradient)',
        width: '100%',
        minHeight: isMobile ? 'calc(100vh - 60px)' : '100vh',
        transition: 'all 0.3s ease',
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
        className="chat-scroll-area"
        style={{ 
          height: 'calc(100% - 60px)',
          overflowY: isEmpty ? 'hidden' : 'auto',
          paddingLeft: isMobile ? '12px' : '16px',
          paddingRight: isMobile ? '12px' : '16px',
          paddingTop: isEmpty ? '0' : (isMobile ? '80px' : '90px'),
          paddingBottom: isInputCentered ? '0' : (isMobile ? '140px' : '120px'),
          backgroundPosition: 'center',
          backgroundSize: 'cover',
          width: '100%',
          maxWidth: '100%',
          position: 'relative',
          transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        <Stack gap={isEmpty ? 0 : (isMobile ? "md" : "lg")} style={{ 
          maxWidth: '900px', 
          margin: '0 auto',
          width: '100%',
          paddingTop: isEmpty ? '0' : (isMobile ? '16px' : '24px'),
          height: isEmpty ? '100%' : 'auto'
        }}>
          {isEmpty ? (
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column',
              alignItems: 'center', 
              justifyContent: 'center',
              height: '100%',
              padding: isMobile ? '20px 16px' : '20px 20px',
              color: 'var(--text-muted)',
              textAlign: 'center',
              transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
              minHeight: isMobile ? 'calc(100vh - 120px)' : 'calc(100vh - 140px)',
              boxSizing: 'border-box'
            }}>
              <div style={{
                background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                borderRadius: '50%',
                padding: isMobile ? '18px' : '24px',
                marginBottom: isMobile ? '20px' : '32px',
                boxShadow: 'var(--shadow-xl)',
                animation: 'float 3s ease-in-out infinite',
                position: 'relative',
              }}>
                <IconRobot size={isMobile ? 40 : 56} stroke={1.5} style={{ color: 'white' }} />
                <div style={{
                  position: 'absolute',
                  top: '-2px',
                  right: '-2px',
                  width: '12px',
                  height: '12px',
                  background: 'var(--secondary)',
                  borderRadius: '50%',
                  border: '2px solid white',
                  animation: 'pulse 2s infinite'
                }} />
              </div>
              
              <Text size={isMobile ? "xl" : "32px"} fw={700} style={{ 
                color: 'var(--primary)',
                marginBottom: isMobile ? '12px' : '16px',
                fontSize: isMobile ? '24px' : '32px',
                fontWeight: 700,
                letterSpacing: '-0.5px',
              }}>
                İlaç Bilgi Asistanına Hoş Geldiniz
              </Text>
              
              <Text size={isMobile ? "md" : "lg"} style={{ 
                maxWidth: isMobile ? '100%' : '650px', 
                lineHeight: 1.6,
                marginBottom: isMobile ? '24px' : '32px',
                color: 'var(--text-body)',
                fontSize: isMobile ? '15px' : '17px',
                transition: 'margin-bottom 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                fontWeight: 400,
              }}>
                İlaçlar, etkileri, yan etkileri ve etkileşimleri hakkında güvenilir bilgi alın. 
                Profesyonel sağlık danışmanlığı için size yardımcı olmaya hazırım.
              </Text>

              {/* Centered Input for Empty State */}
              {isInputCentered && (
                <Box 
                  className="chat-input-centered"
                  style={{ 
                    maxWidth: isMobile ? '100%' : '750px', 
                    width: '100%',
                    boxShadow: 'var(--shadow-xl)',
                    borderRadius: isMobile ? '16px' : '20px',
                    overflow: 'hidden',
                    backgroundColor: 'var(--background-white)',
                    border: '1px solid var(--border-color-light)',
                    transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                    transform: 'translateY(0)',
                    opacity: 1,
                    position: 'relative',
                  }}
                >

                  <ChatInput onSendMessage={handleSendMessage} isMobile={isMobile} />
                </Box>
              )}


            </div>
          ) : (
            <>
              {currentChat.messages.map((message, index) => (
                <ChatMessage 
                  key={message.id}
                  message={message}
                  isMobile={isMobile}
                  showTimestamp={index === currentChat.messages.length - 1 || index % 3 === 0}
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
                <StreamingChatMessage
                  key="typing_indicator"
                  message={{ id: 'typing_indicator', role: 'assistant', content: '' }}
                  isMobile={isMobile}
                  isStreaming={true}
                  streamingContent=""
                />
              )}
            </>
          )}
          {/* Scroll için referans noktası */}
          <div ref={messagesEndRef} style={{ height: 20 }} />
        </Stack>
      </Box>
      
      {/* Bottom Input Container - Only visible when not centered */}
      {!isInputCentered && (
        <Box 
          style={{ 
            background: 'var(--chat-bg-gradient)',
            position: 'absolute',
            bottom: isMobile ? '12px' : '20px',
            left: 0,
            right: 0,
            paddingLeft: isMobile ? '15px' : '20px',
            paddingRight: isMobile ? '15px' : '20px',
            paddingBottom: isMobile ? '8px' : '12px',
            paddingTop: '30px',
            zIndex: 1000,
            width: '100%',
            opacity: isInputCentered ? 0 : 1,
            transform: isInputCentered ? 'translateY(20px)' : 'translateY(0)',
            transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          <Box 
            className="chat-input-container chat-input-bottom"
            style={{ 
              maxWidth: '900px', 
              margin: '0 auto',
              boxShadow: 'var(--shadow-lg)',
              borderRadius: isMobile ? '12px' : '16px',
              overflow: 'hidden',
              backgroundColor: 'var(--background-white)',
              border: '1px solid var(--border-color-light)',
              width: '100%',
              transition: 'box-shadow 0.2s ease, border-color 0.2s ease',
            }}>
            <ChatInput onSendMessage={handleSendMessage} isMobile={isMobile} />
          </Box>
        </Box>
      )}
    </Stack>
  );
} 