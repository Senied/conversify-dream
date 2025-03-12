
import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import ConversationSidebar from "./ConversationSidebar";
import { useChat } from "@/hooks/useChat";
import { useIsMobile } from "@/hooks/use-mobile";

const ChatInterface: React.FC = () => {
  const { 
    messages, 
    loading, 
    sendMessage, 
    conversations,
    currentConversationId,
    startNewConversation,
    switchConversation
  } = useChat();
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);

  // Toggle sidebar
  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <ConversationSidebar 
        conversations={conversations}
        currentConversationId={currentConversationId}
        onSelectConversation={switchConversation}
        onNewConversation={startNewConversation}
        isOpen={sidebarOpen}
        onToggle={toggleSidebar}
      />
      
      {/* Main content */}
      <div className="flex-1 flex flex-col h-screen">
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="glass-panel py-4 border-b border-white/10 sticky top-0 z-10"
        >
          <div className="max-w-3xl mx-auto px-4 md:px-8 flex items-center">
            {isMobile && (
              <Button 
                variant="ghost" 
                size="icon" 
                className="mr-3" 
                onClick={toggleSidebar}
              >
                <Menu size={18} />
              </Button>
            )}
            <h1 className="text-lg font-medium text-primary">AI Assistant</h1>
          </div>
        </motion.header>
        
        <div className="flex-1 overflow-y-auto">
          <div className="py-4 max-w-3xl mx-auto px-4 md:px-8">
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
          <div className="max-w-3xl mx-auto px-4 md:px-8">
            <ChatInput onSend={sendMessage} disabled={loading} />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ChatInterface;
