'use client'

import { useState, useEffect } from 'react';
import { TextInput, ActionIcon, Group, Paper, Button, Flex, useMantineTheme, Textarea, Tooltip } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { 
  IconPlus,
  IconMicrophone,
  IconArrowUp,
  IconWorld,
  IconBulb,
  IconDotsCircleHorizontal,
  IconSend,
  IconMicrophoneOff
} from '@tabler/icons-react';
import useSpeechRecognition from '../hooks/useSpeechRecognition';

export default function ChatInput({ onSendMessage, isMobile }) {
  const [message, setMessage] = useState('');
  const [activeMode, setActiveMode] = useState(null);
  const theme = useMantineTheme();
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

  const handleModeSelect = (mode) => {
    setActiveMode(activeMode === mode ? null : mode);
  };

  // Mikrofon ikonuna tıklama işleyicisi
  const handleMicrophoneClick = () => {
    toggleListening();
  };

  return (
    <Paper
      radius="xl"
      style={{ 
        backgroundColor: 'var(--background-white)',
        marginBottom: '0px',
        position: 'relative',
        minHeight: isActuallyMobile ? '60px' : '70px',
        width: '100%',
        paddingTop: isActuallyMobile ? '8px' : '12px',
        paddingBottom: isActuallyMobile ? '8px' : '12px',
        paddingLeft: isActuallyMobile ? '12px' : '16px',
        paddingRight: isActuallyMobile ? '12px' : '16px'
      }}
    >
      <form onSubmit={handleSubmit} style={{ height: '100%' }}>
        <Flex direction="column" style={{ height: '100%', position: 'relative' }}>
          <Group align="center" wrap="nowrap" spacing="xs" style={{ 
            marginBottom: isActuallyMobile ? '35px' : '32px'
          }}>
            <ActionIcon 
              variant="filled"
              color="blue.4"
              size={isActuallyMobile ? "md" : "lg"}
              radius="xl"
              style={{
                border: 'none',
                background: 'var(--primary)',
                transition: 'all 0.2s ease',
                boxShadow: '0 2px 4px rgba(0,0,0,0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white'
              }}
              sx={(theme) => ({
                '&:hover': {
                  background: 'var(--primary)',
                  transform: 'scale(1.05)',
                  boxShadow: '0 3px 6px rgba(0,0,0,0.2)',
                }
              })}
            >
              <IconPlus size={isActuallyMobile ? 18 : 22} stroke={2} color="white" />
            </ActionIcon>
            
            <Textarea
              placeholder="Herhangi bir soru sorun..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              size={isActuallyMobile ? "sm" : "md"}
              autosize
              maxRows={6}
              minRows={isActuallyMobile ? 1 : 2}
              style={{ 
                flex: 1,
              }}
              styles={{
                input: { 
                  border: 'none',
                  paddingTop: isActuallyMobile ? '10px' : '15px',
                  paddingBottom: isActuallyMobile ? '10px' : '15px',
                  paddingLeft: 0,
                  paddingRight: 0,
                  backgroundColor: 'transparent',
                  fontSize: isActuallyMobile ? '14px' : '16px',
                  color: 'var(--text-body)',
                  resize: 'none',
                  overflow: 'auto',
                  fontWeight: 500,
                },
                wrapper: {
                  backgroundColor: 'transparent',
                },
                root: {
                  width: '100%'
                }
              }}
            />

            <Group spacing={isActuallyMobile ? 4 : 8} style={{ 
              marginTop: isActuallyMobile ? '12px' : '20px', 
              marginRight: isActuallyMobile ? '4px' : '16px' 
            }}>
              {/* Mikrofon ikonu artık her zaman görünecek */}
              <Tooltip label={isListening ? "Dinlemeyi durdur" : "Sesli giriş yap"} withArrow position="top">
                <ActionIcon
                  radius="xl"
                  variant="subtle"
                  onClick={handleMicrophoneClick}
                  className={isListening ? "mic-listening" : ""}
                  style={{
                    color: isListening ? 'var(--danger)' : 'var(--primary)',
                    backgroundColor: isListening ? 'rgba(255, 76, 81, 0.1)' : 'var(--primary-light)',
                    height: isActuallyMobile ? '36px' : '40px',
                    width: isActuallyMobile ? '36px' : '40px',
                    transition: 'all 0.2s ease',
                  }}
                  sx={(theme) => ({
                    '&:hover': {
                      backgroundColor: isListening ? 'rgba(255, 76, 81, 0.2)' : 'var(--primary-light)',
                      transform: 'scale(1.05)',
                    }
                  })}
                >
                  {isListening ? (
                    <IconMicrophoneOff size={isActuallyMobile ? 16 : 20} stroke={1.5} />
                  ) : (
                    <IconMicrophone size={isActuallyMobile ? 16 : 20} stroke={1.5} />
                  )}
                </ActionIcon>
              </Tooltip>

              <ActionIcon
                radius="xl"
                variant="filled"
                onClick={handleSubmit}
                disabled={!message.trim()}
                style={{
                  background: message.trim() ? 'var(--primary)' : 'var(--border-color)',
                  height: isActuallyMobile ? '36px' : '40px',
                  width: isActuallyMobile ? '36px' : '40px',
                  boxShadow: message.trim() ? '0 2px 4px rgba(0,0,0,0.2)' : 'none',
                  transition: 'all 0.2s ease',
                }}
                sx={(theme) => ({
                  '&:hover': {
                    background: 'var(--primary)',
                    transform: message.trim() ? 'scale(1.05)' : 'none',
                  }
                })}
              >
                <IconSend size={isActuallyMobile ? 16 : 20} stroke={1.5} color="white" />
              </ActionIcon>
            </Group>
          </Group>
          
          {/* Mobil görünümde butonları küçült ve sadece ikonları göster */}
          <Group 
            spacing={isActuallyMobile ? 4 : 8} 
            style={{ 
              position: 'absolute', 
              bottom: isActuallyMobile ? '5px' : '8px', 
              left: isActuallyMobile ? '6px' : '16px',
              maxWidth: '100%',
              overflow: 'auto',
              flexWrap: 'nowrap'
            }}
          >
            <Button
              variant="subtle"
              radius="xl"
              compact="true"
              styles={{
                root: {
                  backgroundColor: activeMode === 'search' ? 'var(--primary-light)' : '#F0F4F8',
                  color: activeMode === 'search' ? 'var(--primary)' : 'var(--text-body)',
                  border: 'none',
                  paddingTop: isActuallyMobile ? '2px' : '4px',
                  paddingBottom: isActuallyMobile ? '2px' : '4px',
                  paddingLeft: isActuallyMobile ? '6px' : '12px',
                  paddingRight: isActuallyMobile ? '6px' : '12px',
                  height: isActuallyMobile ? '28px' : '34px',
                  minWidth: isActuallyMobile ? 'auto' : undefined,
                  fontWeight: 600,
                  '&:hover': {
                    backgroundColor: 'var(--primary-light)'
                  }
                },
                inner: {
                  display: 'flex',
                  alignItems: 'center',
                  gap: isActuallyMobile ? '2px' : '4px',
                  fontSize: isActuallyMobile ? '11px' : '14px'
                }
              }}
              onClick={() => handleModeSelect('search')}
            >
              <IconWorld size={isActuallyMobile ? 14 : 16} stroke={1.5} /> 
              {isActuallyMobile ? '' : 'Search'}
            </Button>

            <Button
              variant="subtle"
              radius="xl"
              compact="true"
              styles={{
                root: {
                  backgroundColor: activeMode === 'reason' ? 'var(--primary-light)' : '#F0F4F8',
                  color: activeMode === 'reason' ? 'var(--primary)' : 'var(--text-body)',
                  border: 'none',
                  paddingTop: isActuallyMobile ? '2px' : '4px',
                  paddingBottom: isActuallyMobile ? '2px' : '4px',
                  paddingLeft: isActuallyMobile ? '6px' : '12px',
                  paddingRight: isActuallyMobile ? '6px' : '12px',
                  height: isActuallyMobile ? '28px' : '34px',
                  minWidth: isActuallyMobile ? 'auto' : undefined,
                  fontWeight: 600,
                  '&:hover': {
                    backgroundColor: 'var(--primary-light)'
                  }
                },
                inner: {
                  display: 'flex',
                  alignItems: 'center',
                  gap: isActuallyMobile ? '2px' : '4px',
                  fontSize: isActuallyMobile ? '11px' : '14px'
                }
              }}
              onClick={() => handleModeSelect('reason')}
            >
              <IconBulb size={isActuallyMobile ? 14 : 16} stroke={1.5} /> 
              {isActuallyMobile ? '' : 'Reason'}
            </Button>

            <ActionIcon
              radius="xl"
              variant="subtle"
              style={{ 
                backgroundColor: '#F0F4F8',
                border: 'none',
                color: 'var(--text-muted)',
                height: isActuallyMobile ? '28px' : '34px',
                width: isActuallyMobile ? '28px' : '34px'
              }}
            >
              <IconDotsCircleHorizontal size={isActuallyMobile ? 14 : 16} stroke={1.5} />
            </ActionIcon>
          </Group>
          
          {/* Hata mesajını göstermek için */}
          {error && (
            <div className="mic-status error" style={{ 
              position: 'absolute', 
              bottom: isActuallyMobile ? '34px' : '42px', 
              right: '16px',
            }}>
              {error}
            </div>
          )}
          
          {/* Dinleme durumu göstergesi */}
          {isListening && (
            <div className="mic-status listening" style={{ 
              position: 'absolute', 
              bottom: isActuallyMobile ? '34px' : '42px', 
              right: '16px',
            }}>
              Konuşmanız dinleniyor...
            </div>
          )}
        </Flex>
      </form>
    </Paper>
  );
} 