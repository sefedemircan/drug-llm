'use client'

import { useState } from 'react';
import { Stack, Text, NavLink, Divider, Box, Button, Group, Badge, ActionIcon, Menu, Loader } from '@mantine/core';
import { IconMessage, IconPlus, IconArrowLeft, IconDots, IconTrash, IconEdit } from '@tabler/icons-react';
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
  const { chatHistory, currentChat, selectChat, startNewChat, deleteChat, loading } = useChat();
  const [deletingChatId, setDeletingChatId] = useState(null);

  const handleChatSelect = (chatId) => {
    selectChat(chatId);
    if (isMobile && onClose) {
      onClose();
    }
  };

  const handleDeleteChat = async (chatId, event) => {
    event.stopPropagation();
    setDeletingChatId(chatId);
    
    try {
      const success = await deleteChat(chatId);
      if (!success) {
        console.error('Chat silinemedi');
      }
    } catch (error) {
      console.error('Chat silinirken hata:', error);
    } finally {
      setDeletingChatId(null);
    }
  };

  const handleNewChat = () => {
    startNewChat();
    if (isMobile && onClose) {
      onClose();
    }
  };

  const handleEditChat = (chatId) => {
    console.log('Chat düzenle:', chatId);
    // TODO: İsim düzenleme modal'ı açılabilir
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
          borderBottom: 'none',
          padding: '0 16px',
          backgroundColor: 'transparent',
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
            leftSection={<IconArrowLeft size={16} />}
            onClick={onClose}
            size="xs"
            styles={{
              root: {
                padding: '4px 8px',
                height: 'auto',
                minHeight: '28px'
              }
            }}
          >
            Geri
          </Button>
        )}
      </Box>
      
      <Group p="md">
        <Button 
          fullWidth 
          leftSection={<IconPlus size={16} />}
          onClick={handleNewChat}
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
        
        {loading ? (
          <Box style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '200px' 
          }}>
            <Loader size="sm" />
          </Box>
        ) : chatHistory.length === 0 ? (
          <Box style={{ 
            textAlign: 'center', 
            padding: '20px', 
            color: 'var(--text-muted)' 
          }}>
            <Text size="sm">
              Henüz sohbet geçmişiniz yok.
            </Text>
          </Box>
        ) : (
          chatHistory.map((group) => (
            <div key={`group-${group.title || group.date || 'unknown'}`}>
              <Text size="sm" fw={500} mb="xs" style={{ color: 'var(--text-muted)' }}>{group.title || group.date}</Text>
              
              {group.chats.map((chat) => (
                <Box key={`chat-${group.title || group.date || 'unknown'}-${chat.id}`} style={{ position: 'relative' }}>
                  <NavLink
                    label={
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                        <Text 
                          size="sm" 
                          style={{
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            maxWidth: isMobile ? '120px' : '150px'
                          }}
                        >
                          {chat.title}
                        </Text>
                        <Group gap={4} style={{ flexShrink: 0 }}>
                          {currentChat?.id === chat.id && !isMobile && (
                            <Badge size="xs" variant="filled" color="primary">Aktif</Badge>
                          )}
                          <Menu
                            withArrow
                            width={200}
                            position="bottom-end"
                            transitionProps={{ transition: 'pop' }}
                            withinPortal={false}
                            shadow="md"
                          >
                            <Menu.Target>
                              <ActionIcon
                                size="sm"
                                variant="subtle"
                                disabled={deletingChatId === chat.id}
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                }}
                                style={{
                                  opacity: 0.7,
                                  cursor: 'pointer',
                                  transition: 'opacity 0.2s ease'
                                }}
                                onMouseEnter={(e) => {
                                  e.target.style.opacity = '1';
                                }}
                                onMouseLeave={(e) => {
                                  e.target.style.opacity = '0.7';
                                }}
                              >
                                {deletingChatId === chat.id ? (
                                  <Loader size={12} />
                                ) : (
                                  <IconDots size={12} stroke={1.5} />
                                )}
                              </ActionIcon>
                            </Menu.Target>
                            <Menu.Dropdown>
                              <Menu.Item
                                leftSection={<IconEdit size={16} stroke={1.5} />}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEditChat(chat.id);
                                }}
                              >
                                İsmi Düzenle
                              </Menu.Item>
                              <Menu.Divider />
                              <Menu.Item
                                color="red"
                                leftSection={<IconTrash size={16} stroke={1.5} />}
                                onClick={(e) => {
                                  handleDeleteChat(chat.id, e);
                                }}
                                disabled={deletingChatId === chat.id}
                              >
                                Sohbeti Sil
                              </Menu.Item>
                            </Menu.Dropdown>
                          </Menu>
                        </Group>
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
                    active={currentChat?.id === chat.id}
                    color="primary"
                    onClick={() => handleChatSelect(chat.id)}
                  />
                </Box>
              ))}
              
              {(group.title || group.date) !== (chatHistory[chatHistory.length - 1]?.title || chatHistory[chatHistory.length - 1]?.date) && (
                <Divider my="sm" color="var(--border-color-light)" />
              )}
            </div>
          ))
        )}
      </Stack>
    </Box>
  );
} 