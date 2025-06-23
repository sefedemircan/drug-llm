'use client'

import React, { useRef, useEffect } from 'react';
import { useNewChat } from '../context/NewChatContext';
import SimpleChatMessage from './SimpleChatMessage';
import LoadingSpinner from './LoadingSpinner';

/**
 * Professional Chat Area Component
 * Clean and efficient message display
 */
function NewChatArea() {
  const {
    messages,
    isGenerating,
    error,
    hasMessages,
    isNewSession,
    clearError
  } = useNewChat();

  const messagesEndRef = useRef(null);

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isGenerating]);

  // Clear error after some time
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        clearError();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, clearError]);

  if (!hasMessages && !isGenerating) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="mb-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a8.955 8.955 0 01-3.36-.652l-2.64 1.322V17c-1.105 0-2-.895-2-2V7c0-4.418 3.582-8 8-8s8 3.582 8 5z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Yeni Sohbet Başlat
            </h3>
            <p className="text-gray-600 mb-4">
              İlaç danışmanınız ile konuşmaya başlayın. Sağlık sorunlarınız, ilaçlarınız veya tedavileriniz hakkında soru sorabilirsiniz.
            </p>
          </div>
          
          <div className="grid grid-cols-1 gap-3 text-sm">
            <div className="p-3 bg-white rounded-lg border border-gray-200">
              <span className="text-gray-700">💊 "Aspirin ne için kullanılır?"</span>
            </div>
            <div className="p-3 bg-white rounded-lg border border-gray-200">
              <span className="text-gray-700">🩺 "Kan basıncı ilacım ile etkileşim yapar mı?"</span>
            </div>
            <div className="p-3 bg-white rounded-lg border border-gray-200">
              <span className="text-gray-700">⚠️ "Bu ilacın yan etkileri nelerdir?"</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50">
      {/* Error Banner */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 m-4 rounded-r-lg">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
            <div className="ml-auto pl-3">
              <button
                onClick={clearError}
                className="text-red-400 hover:text-red-600"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="px-4 py-6 space-y-6">
        {messages.map((message) => (
          <SimpleChatMessage
            key={message.id}
            message={message}
            isTemporary={message.isTemporary}
          />
        ))}

        {/* Bot is generating response */}
        {isGenerating && (
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
            </div>
            <div className="flex-1">
              <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                <div className="flex items-center space-x-2">
                  <LoadingSpinner size="sm" />
                  <span className="text-gray-600 text-sm">Yanıt hazırlanıyor...</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Scroll anchor */}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}

export default NewChatArea; 