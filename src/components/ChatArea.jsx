'use client'

import { useState, useEffect, useRef } from 'react';
import { Stack, Paper, ScrollArea, Box, Text } from '@mantine/core';
import ChatInput from './ChatInput';
import ChatMessage from './ChatMessage';

// Örnek mesajlar - gerçek uygulamada API'den gelecektir
const initialMessages = [
  {
    id: 1,
    role: 'system',
    content: 'Merhaba! Size ilaçlar hakkında nasıl yardımcı olabilirim?'
  },
  {
    id: 2,
    role: 'user',
    content: 'Aspirin nedir ve ne için kullanılır?'
  },
  {
    id: 3,
    role: 'system',
    content: 'Aspirin (Asetilsalisilik asit), ağrı kesici, ateş düşürücü ve iltihap giderici özelliklere sahip bir ilaçtır. Genellikle hafif ve orta şiddetli ağrıların tedavisinde, ateş düşürmede ve iltihaplı durumların tedavisinde kullanılır. Ayrıca, düşük dozlarda kan pıhtılaşmasını önlemek için kalp krizi ve inme riskini azaltmak amacıyla da kullanılabilir.'
  }
];

export default function ChatArea({ isMobile, navbarOpened, sidebarWidth = 0 }) {
  const [messages, setMessages] = useState(initialMessages);
  const scrollAreaRef = useRef(null);
  const messagesEndRef = useRef(null);
  
  // Scroll işlemini yöneten fonksiyon
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  // Yeni mesaj geldiğinde otomatik scroll
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const addMessage = (newMessage) => {
    setMessages((prev) => [...prev, {
      id: Date.now(),
      role: 'user',
      content: newMessage
    }]);
    
    // Simule edilen bot cevabı - gerçek uygulamada API'ye istek atılacaktır
    setTimeout(() => {
      setMessages((prev) => [...prev, {
        id: Date.now() + 1,
        role: 'system',
        content: `"${newMessage}" sorunuza cevap veriyorum. Bu bir örnek cevaptır.`
      }]);
    }, 1000);
  };

  return (
    <Stack
      h="100%"
      style={{ 
        backgroundColor: 'var(--chat-bg)',
        position: 'relative',
        backgroundImage: 'linear-gradient(to bottom, rgba(225, 245, 254, 0.3), rgba(224, 247, 234, 0.2))',
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
          zIndex: 10,
        }}
      >
        <Text fw={600} c="white" style={{ fontSize: '16px' }}>DrugLLM Sohbet</Text>
      </Box>

      <Box
        style={{ 
          height: 'calc(100% - 80px)',
          overflowY: 'auto',
          padding: '16px',
          paddingTop: '60px', // Başlık için ekstra üst boşluk
          paddingBottom: '100px', // Input yüksekliğini hesaba katan padding
          backgroundPosition: 'center',
          backgroundSize: 'cover',
        }}
      >
        <Stack gap="lg" style={{ maxWidth: '900px', margin: '0 auto' }}>
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
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
          padding: '20px',
          paddingTop: '40px',
          zIndex: 1000,
        }}
      >
        <Box style={{ 
          maxWidth: '900px', 
          margin: '0 auto',
          boxShadow: '0 -2px 10px rgba(0,0,0,0.05)',
          borderRadius: '12px',
          overflow: 'hidden',
          border: '1px solid var(--border-color)',
          backgroundColor: 'white',
        }}>
          <ChatInput onSendMessage={addMessage} />
        </Box>
      </Box>
    </Stack>
  );
} 