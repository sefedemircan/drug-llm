'use client'

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import chatService from '../services/ChatService';

/**
 * Professional Chat Context with clean architecture
 */
const ChatContext = createContext();

export function NewChatProvider({ children }) {
  const { user } = useAuth();
  
  // Core State
  const [sessions, setSessions] = useState([]);
  const [currentSession, setCurrentSession] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);

  // Error state
  const [error, setError] = useState(null);

  /**
   * Initialize chat service and load data
   */
  useEffect(() => {
    if (user) {
      initializeChat();
    } else {
      resetChatState();
    }
  }, [user]);

  const initializeChat = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Set user in chat service
      chatService.setCurrentUser(user);
      
      // Load chat sessions
      await loadChatSessions();
      
    } catch (error) {
      console.error('❌ Chat initialization failed:', error);
      setError('Chat yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const resetChatState = () => {
    setSessions([]);
    setCurrentSession(null);
    setMessages([]);
    setLoading(false);
    setError(null);
  };

  /**
   * Load all chat sessions from database
   */
  const loadChatSessions = async () => {
    try {
      const sessionList = await chatService.getChatSessions();
      setSessions(sessionList);
      
      console.log(`✅ Loaded ${sessionList.length} chat sessions`);
    } catch (error) {
      console.error('❌ Failed to load chat sessions:', error);
      setError('Sohbet geçmişi yüklenemedi');
      setSessions([]);
    }
  };

  /**
   * Load messages for a specific session
   */
  const loadSessionMessages = async (sessionId) => {
    if (!sessionId) {
      setMessages([]);
      return;
    }

    try {
      console.log(`🔄 Loading messages for session: ${sessionId}`);
      const messageList = await chatService.getChatMessages(sessionId);
      console.log(`📋 Raw messages from DB:`, messageList);
      console.log(`🔍 Message roles:`, messageList.map(m => ({ id: m.id, role: m.role, content: m.content?.substring(0, 50) + '...' })));
      
      setMessages(messageList);
      
      console.log(`✅ Loaded ${messageList.length} messages for session ${sessionId}`);
    } catch (error) {
      console.error('❌ Failed to load messages:', error);
      setError('Mesajlar yüklenemedi');
      setMessages([]);
    }
  };

  /**
   * Start a new chat session
   */
  const startNewChat = () => {
    console.log('🆕 Starting new chat session');
    setCurrentSession(null);
    setMessages([]);
    setError(null);
  };

  /**
   * Select and load an existing chat session
   */
  const selectSession = async (sessionId) => {
    try {
      console.log(`📂 Selecting session: ${sessionId}`);
      console.log(`🔍 Available sessions:`, sessions.map(s => ({ id: s.id, title: s.title })));
      
      // Find session in loaded sessions
      const session = sessions.find(s => s.id === sessionId);
      if (!session) {
        console.error(`❌ Session not found: ${sessionId}`);
        console.error(`❌ Available session IDs:`, sessions.map(s => s.id));
        throw new Error('Session not found');
      }

      console.log(`✅ Session found:`, { id: session.id, title: session.title });
      
      setCurrentSession(session);
      await loadSessionMessages(sessionId);
      
      console.log(`✅ Session selected successfully: ${sessionId}`);
      
    } catch (error) {
      console.error('❌ Failed to select session:', error);
      setError('Sohbet seçilemedi');
    }
  };

  /**
   * Send user message and get bot response
   */
  const sendMessage = async (userMessage) => {
    if (!userMessage?.trim()) {
      throw new Error('Message cannot be empty');
    }

    if (!user) {
      throw new Error('User not authenticated');
    }

    try {
      setIsGenerating(true);
      setError(null);

      const messageText = userMessage.trim();
      
      console.log('🚀 sendMessage başladı:', {
        messageText: messageText.substring(0, 50) + '...',
        currentSessionId: currentSession?.id,
        isNewSession: !currentSession,
        userId: user.id
      });
      
      // Add user message to UI immediately
      const tempUserMessage = {
        id: 'temp-user-' + Date.now(),
        role: 'user',
        content: messageText,
        created_at: new Date().toISOString(),
        isTemporary: true
      };
      
      setMessages(prev => [...prev, tempUserMessage]);

      // Call AI API to get bot response
      const botResponse = await callAIAPI(messageText, user.id);

      if (!botResponse?.trim()) {
        throw new Error('Bot response is empty');
      }

      // Determine session info
      const sessionId = currentSession?.id || null;
      const sessionTitle = sessionId ? null : chatService.generateTitle(messageText);

      console.log('🔄 Transaction hazırlığı:', {
        sessionId,
        sessionTitle,
        messageLength: messageText.length,
        botResponseLength: botResponse.length
      });

      // Complete the transaction (save both messages)
      console.log('🔄 Starting completeChatTransaction:', {
        sessionId,
        messageText: messageText.substring(0, 50) + '...',
        botResponse: botResponse.substring(0, 50) + '...',
        sessionTitle
      });
      
      const transaction = await chatService.completeChatTransaction(
        sessionId,
        messageText, 
        botResponse,
        sessionTitle
      );
      
      console.log('✅ completeChatTransaction completed:', {
        sessionId: transaction.sessionId,
        userMessageId: transaction.userMessage?.id,
        botMessageId: transaction.botMessage?.id,
        isNewSession: transaction.isNewSession
      });

      // Update UI with real messages
      const realUserMessage = {
        ...transaction.userMessage,
        role: 'user' // Ensure consistent role naming
      };

      const realBotMessage = {
        ...transaction.botMessage,
        role: 'assistant' // Ensure consistent role naming
      };

      console.log('🔄 UI mesajları güncelleniyor:', {
        userMsgId: realUserMessage.id,
        botMsgId: realBotMessage.id,
        userRole: realUserMessage.role,
        botRole: realBotMessage.role
      });

      // Update messages (remove temp and add real ones)
      setMessages(prev => {
        const filteredPrev = prev.filter(msg => !msg.isTemporary);
        const newMessages = [...filteredPrev, realUserMessage, realBotMessage];
        console.log('📝 Final messages array:', newMessages.map(m => ({ id: m.id, role: m.role, content: m.content?.substring(0, 30) + '...' })));
        return newMessages;
      });

      // Update session state if this was a new session
      if (transaction.isNewSession) {
        console.log('🆕 New session created, updating current session');
        setCurrentSession({
          id: transaction.sessionId,
          title: sessionTitle,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
        
        // Reload sessions to get the new one
        await loadChatSessions();
      }

      console.log(`✅ Message sent successfully to session: ${transaction.sessionId}`);
      
    } catch (error) {
      console.error('❌ Failed to send message:', error);
      setError(error.message || 'Mesaj gönderilemedi');
      
      // Remove temporary message on error
      setMessages(prev => prev.filter(msg => !msg.isTemporary));
      
      throw error;
    } finally {
      setIsGenerating(false);
    }
  };

  /**
   * Call AI API to get bot response
   */
  const callAIAPI = async (message, userId) => {
    try {
      console.log('🌐 Calling AI API:', {
        messageLength: message.length,
        userId,
        endpoint: '/api/chat/hf'
      });

      const response = await fetch('/api/chat/hf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: message,
          userId: userId
        }),
      });

      console.log('📡 AI API response received:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      console.log('📝 AI API data parsed:', {
        hasReply: !!data.reply,
        replyLength: data.reply?.length || 0
      });
      
      if (!data.reply) {
        throw new Error('No reply from AI');
      }

      console.log('✅ AI API call successful');
      return data.reply;
    } catch (error) {
      console.error('❌ AI API call failed:', error);
      throw new Error('AI yanıtı alınamadı: ' + error.message);
    }
  };

  /**
   * Delete a chat session
   */
  const deleteSession = async (sessionId) => {
    if (!sessionId) return false;

    try {
      await chatService.deleteChatSession(sessionId);
      
      // Update local state
      setSessions(prev => prev.filter(s => s.id !== sessionId));
      
      // If deleted session was current, start new chat
      if (currentSession?.id === sessionId) {
        startNewChat();
      }
      
      console.log(`✅ Session deleted: ${sessionId}`);
      return true;
    } catch (error) {
      console.error('❌ Failed to delete session:', error);
      setError('Sohbet silinemedi');
      return false;
    }
  };

  /**
   * Refresh current session (reload messages)
   */
  const refreshCurrentSession = async () => {
    if (currentSession?.id) {
      await loadSessionMessages(currentSession.id);
    }
  };

  /**
   * Clear error state
   */
  const clearError = () => {
    setError(null);
  };

  // Context value
  const contextValue = {
    // State
    sessions,
    currentSession,
    messages,
    loading,
    isGenerating,
    error,
    
    // Actions
    startNewChat,
    selectSession,
    sendMessage,
    deleteSession,
    refreshCurrentSession,
    clearError,
    
    // Derived state
    hasMessages: messages.length > 0,
    isNewSession: !currentSession,
  };

  return (
    <ChatContext.Provider value={contextValue}>
      {children}
    </ChatContext.Provider>
  );
}

export const useNewChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useNewChat must be used within a NewChatProvider');
  }
  return context;
};

export default ChatContext; 