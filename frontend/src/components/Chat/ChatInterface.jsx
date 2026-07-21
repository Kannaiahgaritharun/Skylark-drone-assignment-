import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Trash2, Loader2, X, AlertOctagon } from 'lucide-react';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import SuggestedQuestions from './SuggestedQuestions';
import { useData } from '../../context/DataContext';

const ChatInterface = ({ onClose }) => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  
  const { isAIOffline, offlineReason, fetchInsights } = useData();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (text) => {
    if (isAIOffline) return;
    
    const newUserMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, newUserMessage]);
    setIsLoading(true);

    try {
      const response = await axios.post('http://localhost:8000/api/chat', {
        query: text
      });
      
      if (response.data.error) {
        throw new Error(response.data.error);
      }
      
      const newAIMessage = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        content: response.data,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      
      setMessages(prev => [...prev, newAIMessage]);
    } catch (error) {
      console.error("Chat API error:", error);
      const errorMessage = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        content: 'I encountered an error connecting to the backend.',
        isError: true,
        error: error.message || 'Unknown error occurred.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearConversation = () => {
    if (window.confirm('Are you sure you want to clear the conversation?')) {
      setMessages([]);
    }
  };

  return (
    <div className="flex flex-col h-full bg-transparent overflow-hidden relative">
      {/* Header */}
      <div className="flex flex-col p-5 pb-4 border-b border-white/10 bg-bg-dark/60 backdrop-blur-xl sticky top-0 z-20 shadow-sm">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-3">
            <h2 className="text-[18px] font-bold text-white tracking-wide">
              AI Business Analyst
            </h2>
            <div className="flex items-center gap-1.5 bg-success/10 text-success text-[10px] font-bold px-2 py-0.5 rounded-full border border-success/20">
              <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
              Live Sync
            </div>
            {isAIOffline && <span className="bg-danger/20 border border-danger/30 text-danger text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">Offline</span>}
          </div>
          <div className="flex items-center gap-1">
            <button 
              onClick={clearConversation}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-white/5 text-gray-300 hover:text-white hover:bg-white/10 transition-all border border-white/5 shadow-sm hidden sm:block"
            >
              New Chat
            </button>
            {messages.length > 0 && (
              <button 
                onClick={clearConversation}
                className="p-1.5 rounded-lg text-gray-400 hover:text-danger hover:bg-danger/10 transition-all"
                title="Delete Chat"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            {onClose && (
              <button 
                onClick={onClose}
                className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-all ml-1"
                title="Close Panel"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
        <p className="text-[12px] font-medium text-gray-400">
          Powered by <span className="text-gray-300 font-semibold">Gemini</span> + <span className="text-gray-300 font-semibold">Monday.com</span>
        </p>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar relative">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[50vh] p-8">
            <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-[32px] flex items-center justify-center mb-8 shadow-premium">
              <span className="text-3xl font-bold font-serif tracking-tight">SD</span>
            </div>
            <h1 className="text-3xl font-bold text-slate-900 mb-3 text-center tracking-tight">AI Copilot</h1>
            
            {isAIOffline ? (
              <div className="bg-warning/10 border border-warning/20 p-5 rounded-2xl mt-4 w-full shadow-sm">
                <h4 className="flex items-center text-warning font-semibold mb-2 gap-2 text-sm">
                  <AlertOctagon className="w-5 h-5" /> AI Offline
                </h4>
                <p className="text-warning/80 text-sm mb-5 leading-relaxed">
                  The conversational AI is temporarily unavailable ({offlineReason}). Dashboard data is still live.
                </p>
                <button onClick={() => fetchInsights()} className="text-sm font-bold text-warning hover:text-warning-dark bg-warning/20 hover:bg-warning/30 px-4 py-2.5 rounded-xl transition-all w-full shadow-sm">
                  Retry Connection
                </button>
              </div>
            ) : (
              <>
                <p className="text-slate-500 text-center max-w-md mb-10 text-[15px] leading-relaxed font-medium">
                  I can analyze your Deals and Work Orders from Monday.com. Ask me a question to get started.
                </p>
                <SuggestedQuestions onSelect={handleSendMessage} />
              </>
            )}
          </div>
        ) : (
          <div className="pb-4">
            {messages.map(msg => (
              <ChatMessage key={msg.id} message={msg} />
            ))}
            {isLoading && (
              <div className="py-3 px-6 flex gap-4 flex-row">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center flex-shrink-0 mt-1 shadow-sm">
                  <Loader2 className="w-4 h-4 animate-spin" />
                </div>
                <div className="flex flex-col min-w-0 max-w-[85%] items-start">
                  <div className="flex items-center gap-2 mb-1.5 px-2 flex-row">
                    <span className="font-bold text-[13px] text-slate-700 tracking-wide">Skylark Copilot</span>
                    <span className="text-[11px] text-slate-400 font-medium">Generating...</span>
                  </div>
                  <div className="bg-white rounded-[24px] rounded-tl-sm border border-border-subtle px-5 py-5 shadow-premium flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-300 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-300 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-300 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="bg-gradient-to-t from-bg-dark via-bg-dark/90 to-transparent relative pt-4 pb-2 z-10">
        {isAIOffline && (
          <div className="absolute inset-0 bg-bg-dark/80 backdrop-blur-[1px] z-10 flex items-center justify-center border-t border-white/5">
            <span className="text-warning text-xs font-medium bg-warning/10 px-3 py-1 rounded-full border border-warning/20">
              Chat Disabled (AI Offline)
            </span>
          </div>
        )}
        <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
      </div>
    </div>
  );
};

export default ChatInterface;
