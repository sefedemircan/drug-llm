'use client'

import { Stack, Text, NavLink, Divider, Box } from '@mantine/core';
import { IconMessage } from '@tabler/icons-react';

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

export default function ChatSidebar() {
  return (
    <Box style={{ height: '100%', backgroundColor: 'var(--sidebar-bg)' }}>
      <Box 
        style={{ 
          height: '60px', 
          display: 'flex', 
          alignItems: 'center',
          borderBottom: '1px solid var(--border-color)',
          padding: '0 16px',
          backgroundColor: 'var(--sidebar-header-bg)',
        }}
      >
        <Text 
          style={{ 
            fontSize: '20px', 
            fontWeight: 500,
            color: 'var(--primary)',
          }}
        >
          DrugLLM
        </Text>
      </Box>
      
      <Stack h="calc(100% - 60px)" py="md" px="md" style={{ overflowY: 'auto' }}>
        <Text size="sm" fw={600} mb="xs" style={{ color: 'var(--text-muted)' }}>Sohbet Geçmişi</Text>
        
        {chatHistory.map((group) => (
          <div key={group.date}>
            <Text size="sm" fw={500} mb="xs" style={{ color: 'var(--text-muted)' }}>{group.date}</Text>
            
            {group.chats.map((chat) => (
              <NavLink
                key={chat.id}
                label={chat.title}
                leftSection={<IconMessage size={14} style={{ opacity: 0.7 }} />}
                style={{ 
                  fontSize: '0.9rem',
                  borderRadius: '4px',
                  padding: '6px 8px',
                  marginBottom: '4px',
                  color: 'var(--text-body)'
                }}
                active={chat.id === 1}
                color="primary"
              />
            ))}
            
            {group.date !== 'Önceki 7 Gün' && <Divider my="sm" color="var(--border-color-light)" />}
          </div>
        ))}
      </Stack>
    </Box>
  );
} 