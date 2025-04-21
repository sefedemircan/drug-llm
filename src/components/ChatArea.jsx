'use client'

import { useState, useEffect, useRef } from 'react';
import { Stack, Paper, ScrollArea, Box } from '@mantine/core';
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
      }}
    >
      <Box
        style={{ 
          height: 'calc(100% - 80px)',
          overflowY: 'auto',
          padding: '16px',
          paddingTop: '8px',
          paddingBottom: '100px', // Input yüksekliğini hesaba katan padding
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
          backgroundColor: 'var(--chat-bg)',
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          padding: '20px',
          zIndex: 1000,
        }}
      >
        <Box style={{ maxWidth: '900px', margin: '0 auto' }}>
          <ChatInput onSendMessage={addMessage} />
        </Box>
      </Box>
    </Stack>
  );
} 