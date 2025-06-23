'use client'

import React from 'react';

/**
 * Simple Chat Message Component
 * Compatible with new chat system (assistant/user roles)
 */
function SimpleChatMessage({ message, isTemporary = false }) {
  const isBot = message.role === 'assistant' || message.role === 'system';
  const isUser = message.role === 'user';

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleTimeString('tr-TR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`flex items-start space-x-3 max-w-xs md:max-w-md lg:max-w-lg ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
        {/* Avatar */}
        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
          isBot ? 'bg-blue-600' : 'bg-green-600'
        }`}>
          {isBot ? (
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          ) : (
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          )}
        </div>

        {/* Message Content */}
        <div className={`relative ${isUser ? 'bg-blue-600 text-white' : 'bg-white border border-gray-200'} rounded-lg px-4 py-3 shadow-sm ${
          isTemporary ? 'opacity-70' : ''
        }`}>
          {/* Sender Name */}
          <div className={`text-xs font-medium mb-1 ${
            isUser ? 'text-blue-100' : 'text-gray-600'
          }`}>
            {isBot ? 'İlaç Asistanı' : 'Siz'}
          </div>

          {/* Message Text */}
          <div className={`text-sm leading-relaxed ${
            isUser ? 'text-white' : 'text-gray-800'
          }`}>
            {message.content}
          </div>

          {/* Timestamp */}
          {message.created_at && (
            <div className={`text-xs mt-2 ${
              isUser ? 'text-blue-200' : 'text-gray-400'
            }`}>
              {formatTime(message.created_at)}
              {isTemporary && (
                <span className="ml-1 italic">• Gönderiliyor...</span>
              )}
            </div>
          )}

          {/* Message Tail */}
          <div className={`absolute top-3 w-3 h-3 transform rotate-45 ${
            isUser 
              ? 'bg-blue-600 -right-1.5' 
              : 'bg-white border-l border-b border-gray-200 -left-1.5'
          }`} />
        </div>
      </div>
    </div>
  );
}

export default SimpleChatMessage; 