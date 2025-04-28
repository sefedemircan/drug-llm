'use client'

import { Stack, Text, NavLink, Divider, Box, Button, Group, Badge } from '@mantine/core';
import { IconMessage, IconPlus, IconArrowLeft } from '@tabler/icons-react';
import { useChat } from '../context/ChatContext';

// Örnek geçmiş verileri - gerçek uygulamada bu API'den gelecektir
const chatHistory = [
  {
    date: 'Bugün',
    chats: [
      { id: 1, title: 'Aspirin kullanımı hakkında bilgi' },
      { id: 2, title: 'Antibiyotik ilaçlarının yan etkileri' },
    ]
  },
  {
    date: 'Dün',
    chats: [
      { id: 3, title: 'Parol ve Novalgin karşılaştırması' },
      { id: 4, title: 'Kan sulandırıcı ilaçlar listesi' },
    ]
  },
  {
    date: 'Önceki 7 Gün',
    chats: [
      { id: 5, title: 'Grip için kullanılan ilaçlar' },
      { id: 6, title: 'Migren tedavisi' },
    ]
  }
];

export default function ChatSidebar({ isMobile, onClose }) {
  const { chatHistory, currentChat, selectChat, startNewChat } = useChat();

  const handleChatSelect = (chatId) => {
    selectChat(chatId);
    if (isMobile && onClose) {
      onClose();
    }
  };

  return (
    <Box style={{ 
      height: '100%', 
      backgroundColor: 'var(--sidebar-bg)',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <Box 
        style={{ 
          height: '60px', 
          display: 'flex', 
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid var(--border-color)',
          padding: '0 16px',
          backgroundColor: 'var(--sidebar-header-bg)',
        }}
      >
        <Text 
          style={{ 
            fontSize: '20px',
            fontFamily: 'var(--font-geist-sans, Arial, Helvetica, sans-serif)',
            fontWeight: 700,
            color: 'var(--primary)',
          }}
        >
          {isMobile ? "Sohbetler" : "DrugLLM"}
        </Text>

        {isMobile && (
          <Button
            variant="subtle"
            compact
            leftSection={<IconArrowLeft size={16} />}
            onClick={onClose}
            size="xs"
          >
            Geri
          </Button>
        )}
      </Box>
      
      <Group p="md">
        <Button 
          fullWidth 
          leftSection={<IconPlus size={16} />}
          onClick={startNewChat}
          color="var(--primary)"
          style={{
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
          }}
        >
          Yeni Sohbet
        </Button>
      </Group>
      
      <Stack 
        style={{ 
          height: '100%',
          overflowY: 'auto', 
          flexGrow: 1,
          padding: '0 1rem 1rem 1rem'
        }} 
      >
        <Text size="sm" fw={600} mb="xs" style={{ color: 'var(--text-muted)' }}>Sohbet Geçmişi</Text>
        
        {chatHistory.map((group) => (
          <div key={group.date}>
            <Text size="sm" fw={500} mb="xs" style={{ color: 'var(--text-muted)' }}>{group.date}</Text>
            
            {group.chats.map((chat) => (
              <NavLink
                key={chat.id}
                label={
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                    <Text 
                      size="sm" 
                      style={{
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        maxWidth: '200px'
                      }}
                    >
                      {chat.title}
                    </Text>
                    {chat.id === currentChat.id && !isMobile && (
                      <Badge size="xs" variant="filled" color="primary">Aktif</Badge>
                    )}
                  </div>
                }
                leftSection={<IconMessage size={14} style={{ opacity: 0.7 }} />}
                style={{ 
                  fontSize: '0.9rem',
                  borderRadius: '6px',
                  padding: '8px 10px',
                  marginBottom: '4px',
                  color: 'var(--text-body)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                active={currentChat.id === chat.id}
                color="primary"
                onClick={() => handleChatSelect(chat.id)}
              />
            ))}
            
            {group.date !== chatHistory[chatHistory.length - 1].date && (
              <Divider my="sm" color="var(--border-color-light)" />
            )}
          </div>
        ))}
      </Stack>
    </Box>
  );
} 