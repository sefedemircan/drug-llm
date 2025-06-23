'use client'

import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import chatService from '../services/ChatService';

// Boş bir sohbet şablonu
const emptyChat = {
  id: 'new',
  title: 'Yeni Sohbet',
  messages: []
};

const ChatContext = createContext(null);

export function ChatProvider({ children }) {
  const [chatHistory, setChatHistory] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [isNewChat, setIsNewChat] = useState(false);
  const [isBotReplying, setIsBotReplying] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentSessionId, setCurrentSessionId] = useState(null); // Track active session ID
  const { user } = useAuth();

  // Initialize chat service when user changes
  useEffect(() => {
    if (user) {
      chatService.setCurrentUser(user);
      loadChatHistory();
    } else {
      resetChatState();
    }
  }, [user]);

  const resetChatState = () => {
    setChatHistory([]);
    setCurrentChat(null);
    setCurrentSessionId(null);
    setLoading(false);
  };

  // Supabase'den chat geçmişini yükle
  const loadChatHistory = async () => {
    //console.log('🔄 loadChatHistory çalışıyor - user:', user?.id);
    
    if (!user) {
      //console.log('❌ User yok, chat history temizleniyor');
      resetChatState();
      return;
    }

    try {
      setLoading(true);
      
      // Get sessions using new ChatService
      const sessions = await chatService.getChatSessions();
      //onsole.log('📥 Sessions yüklendi:', sessions?.length || 0);

      if (!sessions || sessions.length === 0) {
        //console.log('⭕ Hiç session yok');
        setChatHistory([]);
        setCurrentChat(null);
        return;
      }

      // Get messages for each session
      const sessionsWithMessages = await Promise.all(
        sessions.map(async (session) => {
          const messages = await chatService.getChatMessages(session.id);
          //console.log(`📨 Session ${session.id} için ${messages?.length || 0} mesaj yüklendi`);

          return {
            id: session.id,
            title: session.title,
            messages: messages || [],
            createdAt: session.created_at,
            updatedAt: session.updated_at
          };
        })
      );

      // Group by date for UI compatibility
      const groupedHistory = groupChatsByDate(sessionsWithMessages);
      setChatHistory(groupedHistory);
      //console.log('✅ Chat history set edildi:', groupedHistory);

      // Set most recent chat as current
      if (sessionsWithMessages.length > 0) {
        const currentChatExists = currentChat && sessionsWithMessages.find(s => s.id === currentChat.id);
        
        if (!currentChat || !currentChatExists || !currentChat.messages || currentChat.messages.length <= 1) {
          const mostRecentChat = sessionsWithMessages[0];
          //console.log('🎯 En son chat set ediliyor:', mostRecentChat.id, mostRecentChat.title);
          setCurrentChat(mostRecentChat);
          setIsNewChat(false);
        } else {
          const updatedCurrentChat = sessionsWithMessages.find(s => s.id === currentChat.id);
          if (updatedCurrentChat && updatedCurrentChat.messages.length !== currentChat.messages.length) {
            //console.log('🔄 Mevcut chat\'in mesajları güncelleniyor:', updatedCurrentChat.messages.length);
            setCurrentChat(updatedCurrentChat);
          }
        }
      } else {
        //console.log('🆕 Hiç session yok, otomatik yeni chat başlatılıyor');
        startNewChat();
      }

    } catch (error) {
      console.error('❌ Chat history yüklenirken hata:', error);
      setChatHistory([]);
      setCurrentChat(null);
    } finally {
      setLoading(false);
    }
  };

  // Group chats by date (UI compatibility)
  const groupChatsByDate = (chats) => {
    const groups = {
      today: [],
      yesterday: [],
      thisWeek: [],
      older: []
    };

    chats.forEach(chat => {
      const date = new Date(chat.updatedAt || chat.createdAt);
      const now = new Date();
      const diffTime = Math.abs(now - date);
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 0) {
        groups.today.push(chat);
      } else if (diffDays === 1) {
        groups.yesterday.push(chat);
      } else if (diffDays < 7) {
        groups.thisWeek.push(chat);
      } else {
        groups.older.push(chat);
      }
    });

    return [
      { title: 'Bugün', chats: groups.today },
      { title: 'Dün', chats: groups.yesterday },
      { title: 'Bu Hafta', chats: groups.thisWeek },
      { title: 'Daha Eski', chats: groups.older }
    ].filter(group => group.chats.length > 0);
  };

  // Chat seçme fonksiyonu
  const selectChat = async (chatId) => {
    if (!user) return;

    try {
      //console.log(`📂 Selecting chat: ${chatId}`);
      
      // Find in loaded history first
      let foundChat = null;
      for (const group of chatHistory) {
        const chat = group.chats.find(c => c.id === chatId);
        if (chat) {
          foundChat = chat;
          break;
        }
      }

      if (foundChat) {
        setCurrentChat(foundChat);
        setCurrentSessionId(foundChat.id);
        setIsNewChat(false);
        //console.log(`✅ Chat selected: ${foundChat.title}`);
      } else {
        console.error(`❌ Chat not found: ${chatId}`);
      }
    } catch (error) {
      console.error('❌ Chat seçilirken hata:', error);
    }
  };

  // Yeni sohbet başlat
  const startNewChat = () => {
    //console.log('🆕 Starting new chat');
    setCurrentChat({...emptyChat, id: 'new-' + Date.now()});
    setCurrentSessionId(null);
    setIsNewChat(true);
  };

  // Ana mesaj ekleme fonksiyonu
  const addMessageToCurrentChat = async (message) => {
    if (!message?.content?.trim() || !user?.id) {
      //console.log('❌ Invalid message or user!');
      return null;
    }

    try {
      // UI'ya mesajı hemen ekle
      const tempMessage = {
        id: 'temp-' + Date.now(),
        ...message,
        created_at: new Date().toISOString(),
        isTemporary: true
      };

      let chatToUpdate = currentChat;
      let sessionId = currentSessionId;

      // User mesajı için session kontrolü
      if (message.role === 'user') {
        if (!sessionId || !currentChat?.id || currentChat.id.startsWith('new')) {
          //console.log('🆕 Creating new session for user message');
          
          const title = chatService.generateTitle(message.content);
          const newSession = await chatService.createChatSession(title);
          sessionId = newSession.id;
          setCurrentSessionId(sessionId);
          
          chatToUpdate = {
            id: sessionId,
            title: message.content.substring(0, 50) + '...',
            created_at: newSession.created_at,
            messages: []
          };
          
          //console.log('✅ New session created:', sessionId);
        }
      } 
      // Bot mesajı için session kontrolü
      else if (message.role === 'assistant') {
        if (!sessionId && currentChat?.id && !currentChat.id.startsWith('new')) {
          sessionId = currentChat.id;
          //console.log('🔄 Using currentChat.id for bot message:', sessionId);
        }
        
        if (!sessionId) {
          //console.error('❌ No valid session ID for bot message!');
          return null;
        }
      }

      // UI güncelle
      setCurrentChat(prev => ({
        ...chatToUpdate,
        messages: [...(chatToUpdate.messages || []), tempMessage]
      }));

      // Veritabanına kaydet
      //console.log('💾 Saving message to database with session ID:', sessionId);
      const savedMessage = await chatService.addMessage(sessionId, message.role, message.content);
      
      // UI'daki temp mesajı gerçek mesajla değiştir
      const updatedChat = {
        ...chatToUpdate,
        id: sessionId,
        messages: [...(chatToUpdate.messages || []), savedMessage]
      };
      
      setCurrentChat(prev => ({
        ...updatedChat,
        messages: prev.messages.map(msg => 
          msg.isTemporary && msg.content === message.content && msg.role === message.role
            ? savedMessage 
            : msg
        ).filter(msg => !msg.isTemporary || msg.id !== tempMessage.id)
      }));

      // Sidebar güncelle
      await loadChatHistory();
      
      //console.log('✅ Message saved and UI updated:', savedMessage.id);
      return updatedChat;
      
    } catch (error) {
      console.error('❌ addMessageToCurrentChat hatası:', error);
      return null;
    }
  };

  // Chat silme fonksiyonu
  const deleteChat = async (chatId) => {
    if (!user || !chatId) return false;

    try {
      //console.log(`🗑️ Deleting chat: ${chatId}`);
      await chatService.deleteChatSession(chatId);
      
      // Update local state
      await loadChatHistory();
      
      // If deleted chat was current, start new chat
      if (currentChat?.id === chatId) {
        startNewChat();
      }
      
      //console.log(`✅ Chat deleted: ${chatId}`);
      return true;
    } catch (error) {
      console.error('❌ Chat silinirken hata:', error);
      return false;
    }
  };

  // Bot yanıtını ekle
  const addBotMessage = async (botResponse) => {
    if (!botResponse?.trim()) return;

    const botMessage = {
      role: 'assistant',
      content: botResponse.trim()
    };

    return await addMessageToCurrentChat(botMessage);
  };

  // Bot yanıtını ekle - Session ID ile
  const addBotMessageWithSessionId = async (botResponse, sessionId) => {
    if (!botResponse?.trim() || !sessionId) return;

    try {
      // Add message to UI immediately
      const newMessage = {
        id: 'temp-' + Date.now(),
        role: 'assistant',
        content: botResponse.trim(),
        created_at: new Date().toISOString(),
        isTemporary: true
      };

      setCurrentChat(prev => ({
        ...prev,
        id: sessionId, // Ensure the chat has the correct session ID
        messages: [...(prev?.messages || []), newMessage]
      }));

      // Save to database directly with session ID
      //console.log('💾 Saving bot message to database with session ID:', sessionId);
      const savedMessage = await chatService.addMessage(sessionId, 'assistant', botResponse.trim());
      
      // Replace temporary message with saved one
      setCurrentChat(prev => ({
        ...prev,
        messages: prev.messages.map(msg => 
          msg.isTemporary && msg.role === 'assistant' && msg.content === botResponse.trim()
            ? { ...savedMessage, role: 'assistant' }
            : msg
        ).filter(msg => !msg.isTemporary || msg.id !== newMessage.id)
      }));

      //console.log('✅ Bot message saved to database:', savedMessage.id);
      return currentChat;
    } catch (error) {
      console.error('❌ addBotMessageWithSessionId hatası:', error);
      return null;
    }
  };

  // User mesajını ekle
  const addUserMessage = async (userMessage) => {
    if (!userMessage?.trim()) return null;

    const message = {
      role: 'user',
      content: userMessage.trim()
    };

    const updatedChat = await addMessageToCurrentChat(message);
    return updatedChat;
  };

  const contextValue = {
    chatHistory,
    currentChat,
    isNewChat,
    isBotReplying,
    loading,
    selectChat,
    startNewChat,
    deleteChat,
    addMessageToCurrentChat,
    addBotMessage,
    addUserMessage,
    setIsBotReplying,
    loadChatHistory,
    addBotMessageWithSessionId
  };

  return (
    <ChatContext.Provider value={contextValue}>
      {children}
    </ChatContext.Provider>
  );
}

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
}; 