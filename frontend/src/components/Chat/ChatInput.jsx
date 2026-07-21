import { useState, useRef, useEffect } from 'react';
import { Send, Loader2, Paperclip, Mic } from 'lucide-react';
import { motion } from 'framer-motion';

const ChatInput = ({ onSendMessage, isLoading }) => {
  const [message, setMessage] = useState('');
  const textareaRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [message]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (message.trim() && !isLoading) {
        onSendMessage(message.trim());
        setMessage('');
      }
    }
  };

  const handleSend = () => {
    if (message.trim() && !isLoading) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-5 pb-6 pt-2">
      <div className="relative bg-white border border-border-subtle rounded-[32px] shadow-premium flex items-end p-2 transition-all duration-300 focus-within:border-primary/40 focus-within:ring-4 focus-within:ring-primary/10">
        <textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask about revenue, pipeline, work orders..."
          className="w-full bg-transparent text-slate-800 placeholder-slate-400 resize-none outline-none p-3.5 pl-5 max-h-[200px] overflow-y-auto text-[15px] font-medium leading-relaxed"
          rows={1}
          disabled={isLoading}
        />
        
        <div className="flex items-center gap-1.5 ml-2 mr-1 pb-1 flex-shrink-0">
          <button disabled className="p-2.5 text-slate-300 cursor-not-allowed">
            <Paperclip className="w-5 h-5" />
          </button>
          <button disabled className="p-2.5 text-slate-300 cursor-not-allowed">
            <Mic className="w-5 h-5" />
          </button>
          
          <motion.button
            whileHover={message.trim() && !isLoading ? { scale: 1.05 } : {}}
            whileTap={message.trim() && !isLoading ? { scale: 0.95 } : {}}
            onClick={handleSend}
            disabled={!message.trim() || isLoading}
            className={`p-3.5 rounded-full flex-shrink-0 transition-all duration-300 shadow-sm ${
              message.trim() && !isLoading 
                ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white cursor-pointer hover:shadow-md' 
                : 'bg-slate-100 text-slate-400 cursor-not-allowed'
            }`}
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
          </motion.button>
        </div>
      </div>
      <p className="text-center text-[12px] text-slate-400 mt-4 font-medium tracking-wide">
        Skylark Copilot can make mistakes. Verify important metrics.
      </p>
    </div>
  );
};

export default ChatInput;
