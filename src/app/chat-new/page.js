'use client'

import React from 'react';
import { NewChatProvider } from '../../context/NewChatContext';
import NewChatSidebar from '../../components/NewChatSidebar';
import NewChatArea from '../../components/NewChatArea';
import NewChatInput from '../../components/NewChatInput';
import Navbar from '../../components/Navbar';

/**
 * New Professional Chat Page
 * Clean architecture with proper separation of concerns
 */
export default function NewChatPage() {
  return (
    <NewChatProvider>
      <div className="h-screen flex flex-col bg-gray-50">
        {/* Navbar */}
        <Navbar />
        
        {/* Main Chat Interface */}
        <div className="flex-1 flex overflow-hidden">
          {/* Sidebar */}
          <NewChatSidebar />
          
          {/* Main Chat Area */}
          <div className="flex-1 flex flex-col">
            {/* Messages Area */}
            <NewChatArea />
            
            {/* Input Area */}
            <NewChatInput />
          </div>
        </div>
      </div>
    </NewChatProvider>
  );
} 