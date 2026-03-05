'use client';

import { useRef, useEffect, useState } from 'react';
import { useChat } from '@ai-sdk/react';

export default function ChatPage() {
  const [input, setInput] = useState('');

  // 1. Initializing useChat
  // Ensure your backend 'route.ts' is using .toUIMessageStreamResponse()
  const { messages, sendMessage, status } = useChat({
    api: '/api/chat',
    initialMessages: [
      {
        id: 'welcome',
        role: 'assistant',
        content: 'Peace be with you. I am here to help answer questions about the Oriental Orthodox faith.',
      },
    ],
  });

  const isLoading = status === 'streaming' || status === 'submitted';

  const messagesEndRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    // 2. sendMessage takes an object in v6
    await sendMessage({ text: input });
    setInput(''); 
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto max-w-4xl h-screen flex flex-col">
        
        {/* Messages Section */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] rounded-2xl px-6 py-4 ${
                message.role === 'user' 
                  ? 'bg-amber-600 text-white' 
                  : 'bg-white dark:bg-gray-800 shadow-md dark:text-gray-100'
              }`}>
                <div className="whitespace-pre-wrap">
                  {/* 3. V6.0 Safe Rendering logic */}
                  {message.parts ? (
                    message.parts.map((part, i) => {
                      if (part.type === 'text') {
                        return <span key={`${message.id}-${i}`}>{part.text}</span>;
                      }
                      return null;
                    })
                  ) : (
                    // Fallback for initialMessages or simple strings
                    <span>{message.content}</span>
                  )}
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Section */}
        <div className="p-6 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
          <form onSubmit={onSubmit} className="flex gap-4">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question..."
              className="flex-1 px-6 py-4 rounded-full border-2 border-amber-200 focus:border-amber-500 focus:outline-none dark:bg-gray-800 dark:border-gray-700"
              disabled={isLoading}
            />
            <button 
              type="submit" 
              disabled={isLoading || !input.trim()} 
              className="px-8 py-4 bg-amber-600 text-white rounded-full font-bold hover:bg-amber-700 disabled:opacity-50 transition-colors"
            >
              {isLoading ? '...' : 'Send'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
} 