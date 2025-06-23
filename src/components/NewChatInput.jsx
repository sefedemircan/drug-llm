'use client'

import React, { useState, useRef, useEffect } from 'react';
import { useNewChat } from '../context/NewChatContext';

/**
 * Professional Chat Input Component
 * Clean message input with proper state management
 */
function NewChatInput() {
  const { sendMessage, isGenerating } = useNewChat();
  const [inputMessage, setInputMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const textareaRef = useRef(null);

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
    }
  }, [inputMessage]);

  // Focus on textarea when component mounts
  useEffect(() => {
    if (textareaRef.current && !isGenerating) {
      textareaRef.current.focus();
    }
  }, [isGenerating]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const message = inputMessage.trim();
    if (!message || isSubmitting || isGenerating) return;

    try {
      setIsSubmitting(true);
      setInputMessage(''); // Clear input immediately
      
      await sendMessage(message);
      
    } catch (error) {
      console.error('❌ Failed to send message:', error);
      // Error handling is done in context
    } finally {
      setIsSubmitting(false);
      // Focus back to input
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.focus();
        }
      }, 100);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleInputChange = (e) => {
    setInputMessage(e.target.value);
  };

  const isDisabled = isSubmitting || isGenerating;
  const placeholder = isGenerating 
    ? 'Bot yanıt veriyor...' 
    : 'Mesajınızı yazın... (Enter ile gönder, Shift+Enter ile yeni satır)';

  return (
    <div className="border-t border-gray-200 bg-white">
      <div className="max-w-4xl mx-auto p-4">
        <form onSubmit={handleSubmit} className="relative">
          <div className="flex items-end space-x-3">
            {/* Text Input */}
            <div className="flex-1 relative">
              <textarea
                ref={textareaRef}
                value={inputMessage}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                disabled={isDisabled}
                rows={1}
                className={`
                  w-full px-4 py-3 pr-12 rounded-lg border resize-none
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                  ${isDisabled 
                    ? 'bg-gray-100 border-gray-200 text-gray-500 cursor-not-allowed' 
                    : 'bg-white border-gray-300 text-gray-900'
                  }
                `}
                style={{
                  minHeight: '48px',
                  maxHeight: '120px'
                }}
              />
              
              {/* Character Count */}
              {inputMessage.length > 0 && (
                <div className="absolute right-3 bottom-1 text-xs text-gray-400">
                  {inputMessage.length}/2000
                </div>
              )}
            </div>

            {/* Send Button */}
            <button
              type="submit"
              disabled={isDisabled || !inputMessage.trim()}
              className={`
                p-3 rounded-lg transition-all duration-200
                flex items-center justify-center
                ${isDisabled || !inputMessage.trim()
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800'
                }
              `}
            >
              {isSubmitting || isGenerating ? (
                <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              )}
            </button>
          </div>

          {/* Helper Text */}
          <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
            <span>
              Sağlık bilgileriniz gizli tutulur. Acil durumlarda doktorunuza başvurun.
            </span>
            {!isDisabled && (
              <span>
                Enter: Gönder • Shift+Enter: Yeni satır
              </span>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

export default NewChatInput; 