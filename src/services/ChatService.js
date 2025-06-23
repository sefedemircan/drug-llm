import { supabase } from '../utils/supabase';

/**
 * Professional Chat Service Class
 * Manages all chat operations with database consistency
 */
class ChatService {
  constructor() {
    this.currentUser = null;
  }

  setCurrentUser(user) {
    this.currentUser = user;
  }

  /**
   * Get all chat sessions for current user
   * @returns {Promise<Array>} Array of chat sessions with message counts
   */
  async getChatSessions() {
    if (!this.currentUser) throw new Error('User not authenticated');

    try {
      const { data: sessions, error } = await supabase
        .from('chat_sessions')
        .select(`
          id,
          title,
          category,
          created_at,
          updated_at,
          chat_messages!inner(id)
        `)
        .eq('user_id', this.currentUser.id)
        .order('updated_at', { ascending: false });

      if (error) throw error;

      // Transform and add message counts
      return sessions.map(session => ({
        ...session,
        messageCount: session.chat_messages?.length || 0,
        chat_messages: undefined // Remove the join data
      }));
    } catch (error) {
      console.error('❌ Error fetching chat sessions:', error);
      throw error;
    }
  }

  /**
   * Get messages for a specific chat session
   * @param {string} sessionId - Chat session ID
   * @returns {Promise<Array>} Array of messages
   */
  async getChatMessages(sessionId) {
    if (!sessionId) throw new Error('Session ID is required');

    try {
      const { data: messages, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      return messages || [];
    } catch (error) {
      console.error('❌ Error fetching chat messages:', error);
      throw error;
    }
  }

  /**
   * Create a new chat session
   * @param {string} title - Chat session title
   * @param {string} category - Chat category (default: 'general')
   * @returns {Promise<Object>} New session object
   */
  async createChatSession(title, category = 'general') {
    if (!this.currentUser) throw new Error('User not authenticated');
    if (!title?.trim()) throw new Error('Title is required');

    try {
      // Clean and format title
      let cleanTitle = title.trim();
      if (cleanTitle.length > 50) {
        cleanTitle = cleanTitle.substring(0, 47) + '...';
      }

      const { data: session, error } = await supabase
        .from('chat_sessions')
        .insert([{
          user_id: this.currentUser.id,
          title: cleanTitle,
          category: category
        }])
        .select()
        .single();

      if (error) throw error;

      //console.log('✅ New chat session created:', session.id);
      return session;
    } catch (error) {
      console.error('❌ Error creating chat session:', error);
      throw error;
    }
  }

  /**
   * Add message to chat session with atomic operation
   * @param {string} sessionId - Chat session ID
   * @param {string} role - Message role ('user' or 'assistant')
   * @param {string} content - Message content
   * @returns {Promise<Object>} Saved message object
   */
  async addMessage(sessionId, role, content) {
    if (!this.currentUser) throw new Error('User not authenticated');
    if (!sessionId) throw new Error('Session ID is required');
    if (!role || !content?.trim()) throw new Error('Role and content are required');

    try {
      // Start transaction
      const { data: message, error: messageError } = await supabase
        .from('chat_messages')
        .insert([{
          session_id: sessionId,
          user_id: this.currentUser.id,
          role: role,
          content: content.trim(),
          message_type: 'normal'
        }])
        .select()
        .single();

      if (messageError) {
        console.error('❌ Supabase insert error:', messageError);
        throw messageError;
      }

      

      // Update session timestamp
      const { error: updateError } = await supabase
        .from('chat_sessions')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', sessionId);

      if (updateError) {
        console.warn('⚠️ Failed to update session timestamp:', updateError);
      }

      //console.log(`✅ Message added: ${role} message to session ${sessionId}`);
      return message;
    } catch (error) {
      console.error('❌ Error adding message:', error);
      console.error('❌ Full error object:', {
        name: error.name,
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint
      });
      throw error;
    }
  }

  /**
   * Complete chat transaction: User message + Bot response
   * @param {string} sessionId - Chat session ID (null for new session)
   * @param {string} userMessage - User's message
   * @param {string} botResponse - Bot's response
   * @param {string} sessionTitle - Title for new session (if sessionId is null)
   * @returns {Promise<Object>} Complete transaction result
   */
  async completeChatTransaction(sessionId, userMessage, botResponse, sessionTitle) {
    if (!this.currentUser) throw new Error('User not authenticated');
    if (!userMessage?.trim() || !botResponse?.trim()) {
      throw new Error('Both user message and bot response are required');
    }

    try {
      

      let currentSessionId = sessionId;

      // Create new session if needed
      if (!currentSessionId) {
        if (!sessionTitle?.trim()) {
          throw new Error('Session title is required for new sessions');
        }
        //console.log('🆕 Creating new session...');
        const newSession = await this.createChatSession(sessionTitle);
        currentSessionId = newSession.id;
        //console.log('✅ New session created:', currentSessionId);
      }

      // Add user message
      //console.log('👤 Adding user message...');
      const userMsg = await this.addMessage(currentSessionId, 'user', userMessage);
      //console.log('✅ User message added:', userMsg.id);
      
      // Add bot response
      //console.log('🤖 Adding bot response...');
      const botMsg = await this.addMessage(currentSessionId, 'assistant', botResponse);
      //console.log('✅ Bot message added:', botMsg.id);

      //console.log(`✅ Chat transaction completed for session: ${currentSessionId}`);
      
      return {
        sessionId: currentSessionId,
        userMessage: userMsg,
        botMessage: botMsg,
        isNewSession: !sessionId
      };
    } catch (error) {
      console.error('❌ Error in chat transaction:', error);
      console.error('❌ Error details:', {
        message: error.message,
        stack: error.stack
      });
      throw error;
    }
  }

  /**
   * Delete chat session and all its messages
   * @param {string} sessionId - Chat session ID
   * @returns {Promise<boolean>} Success status
   */
  async deleteChatSession(sessionId) {
    if (!this.currentUser) throw new Error('User not authenticated');
    if (!sessionId) throw new Error('Session ID is required');

    try {
      // First delete all messages
      await supabase
        .from('chat_messages')
        .delete()
        .eq('session_id', sessionId);

      // Then delete the session
      const { error } = await supabase
        .from('chat_sessions')
        .delete()
        .eq('id', sessionId)
        .eq('user_id', this.currentUser.id); // Security check

      if (error) throw error;

      //console.log(`✅ Chat session deleted: ${sessionId}`);
      return true;
    } catch (error) {
      console.error('❌ Error deleting chat session:', error);
      throw error;
    }
  }

  /**
   * Generate title from user message
   * @param {string} message - User message
   * @returns {string} Generated title
   */
  generateTitle(message) {
    if (!message?.trim()) return 'Yeni Sohbet';

    let title = message.trim();
    
    // Remove newlines and extra spaces
    title = title.replace(/\s+/g, ' ');
    
    // Truncate if too long
    if (title.length > 50) {
      title = title.substring(0, 47) + '...';
    }
    
    // Add context if it's a short question
    if (title.length < 30 && !title.includes('?') && !title.includes('.') && !title.includes('!')) {
      title = title + ' hakkında';
    }

    return title;
  }
}

// Create singleton instance
const chatService = new ChatService();

export default chatService; 