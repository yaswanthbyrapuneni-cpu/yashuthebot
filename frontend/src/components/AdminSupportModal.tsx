import React, { useState, useRef, useEffect } from 'react';
import { X, Database, Send, Loader2 } from 'lucide-react';
import { sendRetailChatMessage, RetailChatbotResponse } from '../utils/retail-chatbot-service';

interface Message {
  text: string;
  isBot: boolean;
  timestamp: string;
}

interface AdminSupportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AdminSupportModal({ isOpen, onClose }: AdminSupportModalProps) {
  const [messages, setMessages] = useState<Message[]>([
    { 
      text: "Hi! I'm your Retail Analytics Assistant. Ask me questions about your sales, customer behavior, product performance, and more!", 
      isBot: true,
      timestamp: new Date().toISOString()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  const handleSendMessage = async () => {
    const trimmedMessage = inputText.trim();
    
    if (!trimmedMessage || isLoading) return;

    setError(null);

    const userMessage: Message = {
      text: trimmedMessage,
      isBot: false,
      timestamp: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      const response: RetailChatbotResponse = await sendRetailChatMessage(trimmedMessage);
      
      const botMessage: Message = {
        text: response.answer,
        isBot: true,
        timestamp: response.timestamp
      };
      
      setMessages(prev => [...prev, botMessage]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get response');
      
      const errorMessage: Message = {
        text: "Sorry, I couldn't process that analytics query. Please try rephrasing your question.",
        isBot: true,
        timestamp: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const suggestedQuestions = [
    "How many visitors did we have today?",
    "Show me total try-ons this week",
    "What are the trending products?",
    "Show emotion analytics summary"
  ];

  const handleSuggestedQuestion = (question: string) => {
    setInputText(question);
    inputRef.current?.focus();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full h-[600px] flex flex-col overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-[#7C563D] to-[#9A6D4F]">
          <div className="flex items-center gap-3">
            <Database className="w-6 h-6 text-white" />
            <h2 className="text-xl font-semibold text-white">Analytics Assistant</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
          {messages.map((message, index) => (
            <div key={index} className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}>
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                  message.isBot
                    ? 'bg-white text-gray-800 shadow-sm'
                    : 'bg-[#7C563D] text-white'
                }`}
              >
                <p className="text-sm leading-relaxed">{message.text}</p>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white text-gray-800 shadow-sm rounded-2xl px-4 py-3 flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-[#7C563D]" />
                <p className="text-sm text-gray-600">Analyzing data...</p>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {messages.length === 1 && !isLoading && (
          <div className="px-4 py-2 border-t border-gray-200 bg-white">
            <p className="text-xs text-gray-500 mb-2">Quick questions:</p>
            <div className="flex flex-wrap gap-2">
              {suggestedQuestions.map((question, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestedQuestion(question)}
                  className="text-xs px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full transition-colors"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="p-4 border-t border-gray-200 bg-white">
          {error && (
            <div className="mb-2 text-xs text-red-600 bg-red-50 px-3 py-2 rounded-lg">
              {error}
            </div>
          )}
          
          <div className="flex gap-2">
            <textarea
              ref={inputRef}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about sales, visitors, emotions, products..."
              disabled={isLoading}
              rows={2}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-[#7C563D] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed text-sm"
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputText.trim() || isLoading}
              className="px-4 py-2 bg-[#7C563D] hover:bg-[#6A4A33] text-white rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[60px]"
              aria-label="Send message"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </button>
          </div>
          
          <p className="text-xs text-gray-500 mt-2 text-center">
            Press Enter to send
          </p>
        </div>
      </div>
    </div>
  );
}