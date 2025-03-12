
import { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import { useChat } from "@/hooks/useChat";

const ChatInterface: React.FC = () => {
  const { messages, loading, sendMessage } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col h-screen">
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="glass-panel py-4 border-b border-white/10 sticky top-0 z-10"
      >
        <div className="max-w-3xl mx-auto px-4 md:px-8">
          <h1 className="text-lg font-medium text-primary">AI Assistant</h1>
        </div>
      </motion.header>
      
      <div className="flex-1 overflow-y-auto">
        <div className="py-4">
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="sticky bottom-0 pb-4 pt-2 border-t border-white/5 bg-gradient-to-t from-chat-darker via-chat-darker"
      >
        <ChatInput onSend={sendMessage} disabled={loading} />
      </motion.div>
    </div>
  );
};

export default ChatInterface;
