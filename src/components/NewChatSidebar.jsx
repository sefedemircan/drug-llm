'use client'

import React, { useState } from 'react';
import { useNewChat } from '../context/NewChatContext';

/**
 * Professional Chat Sidebar Component
 * Clean session list with proper actions
 */
function NewChatSidebar() {
  const {
    sessions,
    currentSession,
    loading,
    startNewChat,
    selectSession,
    deleteSession
  } = useNewChat();

  const [deletingId, setDeletingId] = useState(null);

  const handleDeleteSession = async (sessionId, e) => {
    e.stopPropagation(); // Prevent session selection
    
    if (deletingId) return; // Prevent multiple deletions
    
    if (!confirm('Bu sohbeti silmek istediğinizden emin misiniz?')) {
      return;
    }

    try {
      setDeletingId(sessionId);
      await deleteSession(sessionId);
    } catch (error) {
      console.error('❌ Failed to delete session:', error);
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return 'Bugün';
    if (days === 1) return 'Dün';
    if (days < 7) return `${days} gün önce`;
    if (days < 30) return `${Math.floor(days / 7)} hafta önce`;
    return date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' });
  };

  const groupSessionsByDate = () => {
    const groups = {
      today: [],
      yesterday: [],
      thisWeek: [],
      thisMonth: [],
      older: []
    };

    sessions.forEach(session => {
      const date = new Date(session.updated_at || session.created_at);
      const now = new Date();
      const diff = now.getTime() - date.getTime();
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));

      if (days === 0) groups.today.push(session);
      else if (days === 1) groups.yesterday.push(session);
      else if (days < 7) groups.thisWeek.push(session);
      else if (days < 30) groups.thisMonth.push(session);
      else groups.older.push(session);
    });

    return groups;
  };

  const renderSessionGroup = (title, sessions) => {
    if (sessions.length === 0) return null;

    return (
      <div key={title} className="mb-6">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 px-3">
          {title}
        </h3>
        <div className="space-y-1">
          {sessions.map(session => (
            <div
              key={session.id}
              onClick={() => selectSession(session.id)}
              className={`
                group relative flex items-center px-3 py-2 rounded-lg cursor-pointer
                transition-all duration-150
                ${currentSession?.id === session.id
                  ? 'bg-blue-100 border-l-4 border-blue-500'
                  : 'hover:bg-gray-100'
                }
              `}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0" />
                  <p className={`
                    text-sm truncate
                    ${currentSession?.id === session.id
                      ? 'text-blue-900 font-medium'
                      : 'text-gray-700'
                    }
                  `}>
                    {session.title}
                  </p>
                </div>
                <div className="flex items-center mt-1 space-x-2">
                  <span className="text-xs text-gray-500">
                    {formatDate(session.updated_at || session.created_at)}
                  </span>
                  {session.messageCount > 0 && (
                    <span className="text-xs text-gray-400">
                      • {session.messageCount} mesaj
                    </span>
                  )}
                </div>
              </div>

              {/* Delete Button */}
              <button
                onClick={(e) => handleDeleteSession(session.id, e)}
                disabled={deletingId === session.id}
                className={`
                  ml-2 p-1 rounded opacity-0 group-hover:opacity-100
                  transition-all duration-150
                  ${deletingId === session.id
                    ? 'opacity-100 text-gray-400 cursor-not-allowed'
                    : 'text-gray-500 hover:text-red-600 hover:bg-red-50'
                  }
                `}
                title="Sohbeti sil"
              >
                {deletingId === session.id ? (
                  <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                )}
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="w-80 bg-white border-r border-gray-200 flex items-center justify-center">
        <div className="text-center">
          <svg className="w-8 h-8 text-gray-400 animate-spin mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <p className="text-sm text-gray-500">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  const groupedSessions = groupSessionsByDate();

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <button
          onClick={startNewChat}
          className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-150"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Yeni Sohbet
        </button>
      </div>

      {/* Sessions List */}
      <div className="flex-1 overflow-y-auto py-4">
        {sessions.length === 0 ? (
          <div className="text-center py-8 px-4">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a8.955 8.955 0 01-3.36-.652l-2.64 1.322V17c-1.105 0-2-.895-2-2V7c0-4.418 3.582-8 8-8s8 3.582 8 5z" />
              </svg>
            </div>
            <p className="text-sm text-gray-500 mb-2">Henüz sohbet yok</p>
            <p className="text-xs text-gray-400">İlk mesajınızı göndererek başlayın</p>
          </div>
        ) : (
          <>
            {renderSessionGroup('Bugün', groupedSessions.today)}
            {renderSessionGroup('Dün', groupedSessions.yesterday)}
            {renderSessionGroup('Bu hafta', groupedSessions.thisWeek)}
            {renderSessionGroup('Bu ay', groupedSessions.thisMonth)}
            {renderSessionGroup('Daha eski', groupedSessions.older)}
          </>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <div className="text-xs text-gray-500 text-center">
          <p>💊 İlaç Danışman Asistanı</p>
          <p className="mt-1">Sohbetleriniz güvenli bir şekilde saklanır</p>
        </div>
      </div>
    </div>
  );
}

export default NewChatSidebar; 