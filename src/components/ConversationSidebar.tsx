
import { motion } from "framer-motion";
import { ChevronLeft, MessageSquarePlus, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Conversation } from "@/hooks/useChat";
import { cn } from "@/lib/utils";
import { useMobile } from "@/hooks/use-mobile";
import { formatDistanceToNow } from "date-fns";

interface ConversationSidebarProps {
  conversations: Conversation[];
  currentConversationId: string | null;
  onSelectConversation: (id: string) => void;
  onNewConversation: () => void;
  isOpen: boolean;
  onToggle: () => void;
}

const ConversationSidebar: React.FC<ConversationSidebarProps> = ({
  conversations,
  currentConversationId,
  onSelectConversation,
  onNewConversation,
  isOpen,
  onToggle
}) => {
  const isMobile = useMobile();
  
  return (
    <>
      {/* Mobile overlay */}
      {isMobile && isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20" 
          onClick={onToggle}
        />
      )}
      
      <motion.div 
        initial={isMobile ? { x: "-100%" } : { x: 0 }}
        animate={isOpen ? { x: 0 } : isMobile ? { x: "-100%" } : { x: 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className={cn(
          "glass-panel border-r border-white/10 h-screen flex flex-col",
          isMobile ? "fixed left-0 top-0 z-30 w-72" : "w-72 min-w-72"
        )}
      >
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <h2 className="text-lg font-medium text-primary">Conversations</h2>
          {isMobile && (
            <Button variant="ghost" size="icon" onClick={onToggle}>
              <ChevronLeft size={18} />
            </Button>
          )}
        </div>
        
        <div className="p-3">
          <Button 
            onClick={onNewConversation} 
            className="w-full justify-start gap-2 mb-3"
          >
            <MessageSquarePlus size={18} />
            New Conversation
          </Button>
        </div>
        
        <div className="flex-1 overflow-y-auto pb-4">
          {conversations.map((conversation) => (
            <div 
              key={conversation.id}
              onClick={() => onSelectConversation(conversation.id)}
              className={cn(
                "p-3 hover:bg-chat-light/10 cursor-pointer transition-colors",
                currentConversationId === conversation.id && "bg-chat-light/20"
              )}
            >
              <div className="flex items-start gap-3">
                <MessageSquare size={18} className="mt-1 text-primary/80" />
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium truncate">{conversation.title}</h3>
                  <p className="text-xs text-white/60 truncate mt-1">{conversation.lastMessage}</p>
                  <p className="text-xs text-white/40 mt-1">
                    {formatDistanceToNow(conversation.timestamp, { addSuffix: true })}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </>
  );
};

export default ConversationSidebar;
