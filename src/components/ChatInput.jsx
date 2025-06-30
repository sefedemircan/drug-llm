'use client'

import { useState, useEffect } from 'react';
import { ActionIcon, Group, Paper, Flex, Textarea, Tooltip } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { 
  IconPlus,
  IconMicrophone,
  IconArrowUp,
  IconMicrophoneOff
} from '@tabler/icons-react';
import useSpeechRecognition from '../hooks/useSpeechRecognition';

export default function ChatInput({ onSendMessage, isMobile }) {
  const [message, setMessage] = useState('');
  // Eğer isMobile prop olarak geçilmezse, hook ile kontrol ediyoruz
  const isSmallScreen = useMediaQuery('(max-width: 768px)');
  const isActuallyMobile = isMobile !== undefined ? isMobile : isSmallScreen;
  
  // Konuşma tanıma özelliği için hook'u kullan
  const { 
    transcript, 
    isListening, 
    error, 
    toggleListening,
    resetTranscript 
  } = useSpeechRecognition();

  // Transcript değiştiğinde mesaj alanını güncelle
  useEffect(() => {
    if (transcript) {
      setMessage(transcript);
    }
  }, [transcript]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      // Eğer konuşma tanıma aktifse, gönderirken durdur
      if (isListening) {
        toggleListening();
      }
      onSendMessage(message);
      setMessage('');
      resetTranscript();
    }
  };

  const handleKeyDown = (e) => {
    // Shift+Enter ile yeni satıra geçme
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
    // Shift+Enter basıldığında otomatik olarak yeni satır eklenecek
    // bunu Textarea bileşeni otomatik olarak yapacak
  };

  // Mikrofon ikonuna tıklama işleyicisi
  const handleMicrophoneClick = () => {
    toggleListening();
  };

  return (
    <Paper
      radius={isActuallyMobile ? "16" : "20"}
      className="chat-input"
      style={{ 
        backgroundColor: 'white',
        position: 'relative',
        width: '100%',
        padding: isActuallyMobile ? '12px 16px' : '16px 20px',
        border: '1px solid rgba(25, 118, 210, 0.1)',
        boxShadow: '0 8px 24px rgba(25, 118, 210, 0.08)',
        transition: 'all 0.2s ease',
      }}
      sx={{
        '&:hover': {
          borderColor: 'rgba(25, 118, 210, 0.2)',
          boxShadow: '0 12px 32px rgba(25, 118, 210, 0.12)',
        },
        '&:focus-within': {
          borderColor: 'rgba(25, 118, 210, 0.3)',
          boxShadow: '0 16px 40px rgba(25, 118, 210, 0.15)',
        }
      }}
    >
      <form onSubmit={handleSubmit} style={{ height: '100%' }}>
        <Flex align="center" gap={isActuallyMobile ? "sm" : "md"} style={{ width: '100%' }}>
          {/* Plus Button */}
          <ActionIcon 
            variant="subtle"
            radius="xl"
            size={isActuallyMobile ? "md" : "lg"}
            style={{
              color: '#1976D2',
              backgroundColor: 'rgba(25, 118, 210, 0.08)',
              border: 'none',
              transition: 'all 0.2s ease',
              flexShrink: 0,
            }}
            sx={{
              '&:hover': {
                backgroundColor: 'rgba(25, 118, 210, 0.12)',
                transform: 'scale(1.05)',
              }
            }}
          >
            <IconPlus size={isActuallyMobile ? 18 : 20} stroke={1.5} />
          </ActionIcon>
          
          {/* Text Input */}
          <Textarea
            placeholder="Herhangi bir soru sorun..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            autosize
            maxRows={6}
            minRows={1}
            style={{ 
              flex: 1,
            }}
            styles={{
              input: { 
                border: 'none',
                backgroundColor: 'transparent',
                fontSize: isActuallyMobile ? '15px' : '16px',
                color: '#374151',
                resize: 'none',
                overflow: 'auto',
                fontWeight: 400,
                padding: isActuallyMobile ? '8px 0' : '10px 0',
                lineHeight: 1.5,
                '&::placeholder': {
                  color: '#9CA3AF',
                  fontWeight: 400,
                },
                '&:focus': {
                  outline: 'none',
                  boxShadow: 'none',
                }
              },
              wrapper: {
                backgroundColor: 'transparent',
              },
              root: {
                width: '100%'
              }
            }}
          />

          {/* Action Buttons */}
          <Group spacing={isActuallyMobile ? 6 : 8} style={{ flexShrink: 0 }}>
            {/* Microphone Button */}
            <Tooltip label={isListening ? "Dinlemeyi durdur" : "Sesli giriş yap"} withArrow position="top">
              <ActionIcon
                radius="xl"
                variant="subtle"
                onClick={handleMicrophoneClick}
                size={isActuallyMobile ? "md" : "lg"}
                style={{
                  color: isListening ? '#EF4444' : '#6B7280',
                  backgroundColor: isListening ? 'rgba(239, 68, 68, 0.1)' : 'rgba(107, 114, 128, 0.08)',
                  transition: 'all 0.2s ease',
                }}
                sx={{
                  '&:hover': {
                    backgroundColor: isListening ? 'rgba(239, 68, 68, 0.15)' : 'rgba(107, 114, 128, 0.12)',
                    transform: 'scale(1.05)',
                  }
                }}
              >
                {isListening ? (
                  <IconMicrophoneOff size={isActuallyMobile ? 16 : 18} stroke={1.5} />
                ) : (
                  <IconMicrophone size={isActuallyMobile ? 16 : 18} stroke={1.5} />
                )}
              </ActionIcon>
            </Tooltip>

            {/* Send Button */}
            <ActionIcon
              radius="xl"
              variant="filled"
              onClick={handleSubmit}
              disabled={!message.trim()}
              size={isActuallyMobile ? "md" : "lg"}
              style={{
                background: message.trim() ? 'linear-gradient(135deg, #1976D2, #1565C0)' : '#E5E7EB',
                color: message.trim() ? 'white' : '#9CA3AF',
                border: 'none',
                boxShadow: message.trim() ? '0 4px 12px rgba(25, 118, 210, 0.3)' : 'none',
                transition: 'all 0.2s ease',
                cursor: message.trim() ? 'pointer' : 'not-allowed',
              }}
              sx={{
                '&:hover': {
                  transform: message.trim() ? 'scale(1.05)' : 'none',
                  boxShadow: message.trim() ? '0 6px 16px rgba(25, 118, 210, 0.4)' : 'none',
                },
                '&:active': {
                  transform: message.trim() ? 'scale(0.95)' : 'none',
                }
              }}
            >
              <IconArrowUp size={isActuallyMobile ? 16 : 18} stroke={2} />
            </ActionIcon>
          </Group>
        </Flex>
        
        {/* Status Messages */}
        {error && (
          <div style={{ 
            position: 'absolute', 
            top: '-30px', 
            right: '0',
            fontSize: '12px',
            color: '#EF4444',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            padding: '4px 8px',
            borderRadius: '6px',
            animation: 'fadeIn 0.3s ease'
          }}>
            {error}
          </div>
        )}
        
        {isListening && (
          <div style={{ 
            position: 'absolute', 
            top: '-30px', 
            right: '0',
            fontSize: '12px',
            color: '#1976D2',
            backgroundColor: 'rgba(25, 118, 210, 0.1)',
            padding: '4px 8px',
            borderRadius: '6px',
            animation: 'fadeIn 0.3s ease'
          }}>
            Konuşmanız dinleniyor...
          </div>
        )}
      </form>
    </Paper>
  );
} 