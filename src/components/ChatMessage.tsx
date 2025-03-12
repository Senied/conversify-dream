
import { AnimatePresence, motion } from "framer-motion";
import { useState, useEffect } from "react";
import LoadingDots from "./LoadingDots";

export interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
  loading?: boolean;
}

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const isUser = message.role === "user";
  
  return (
    <AnimatePresence>
      {isMounted && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className={`py-6 ${isUser ? 'bg-transparent' : 'bg-chat-dark/30 border-y border-white/5'}`}
        >
          <div className="max-w-3xl mx-auto px-4 md:px-8">
            <div className="flex items-start gap-4">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-medium ${
                isUser ? 'bg-primary text-primary-foreground' : 'glass-panel text-foreground'
              }`}>
                {isUser ? 'You' : 'AI'}
              </div>
              
              <div className="flex-1 space-y-2 overflow-hidden">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm">
                    {isUser ? 'You' : 'Assistant'}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                
                {message.loading ? (
                  <LoadingDots />
                ) : (
                  <div className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                    {message.content.split('\n').map((paragraph, index) => (
                      paragraph.length > 0 ? (
                        <p key={index} className="mb-3">{paragraph}</p>
                      ) : <br key={index} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ChatMessage;
