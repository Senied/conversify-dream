
import { useState, useEffect, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";
import { sendChatMessage } from "@/utils/api";
import { Message } from "@/components/ChatMessage";

export interface Conversation {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
  messages: Message[];
}

export function useChat() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  // Initialize with a new conversation
  useEffect(() => {
    // Create a new conversation if none exists
    if (conversations.length === 0) {
      const newConversationId = uuidv4();
      const initialMessage: Message = {
        id: uuidv4(),
        role: "assistant",
        content: "Hello, I'm your assistant. How can I help you today?",
        timestamp: new Date(),
      };
      
      const newConversation: Conversation = {
        id: newConversationId,
        title: "New Conversation",
        lastMessage: initialMessage.content,
        timestamp: new Date(),
        messages: [initialMessage],
      };
      
      setConversations([newConversation]);
      setCurrentConversationId(newConversationId);
      setMessages([initialMessage]);
    }
  }, [conversations.length]);

  // Load messages when conversation changes
  useEffect(() => {
    if (currentConversationId) {
      const conversation = conversations.find(c => c.id === currentConversationId);
      if (conversation) {
        setMessages(conversation.messages);
      }
    }
  }, [currentConversationId, conversations]);

  const addMessage = useCallback((content: string, role: "user" | "assistant", loading = false) => {
    const message: Message = {
      id: uuidv4(),
      content,
      role,
      timestamp: new Date(),
      loading,
    };
    
    setMessages(prev => [...prev, message]);
    
    // Update conversation
    if (currentConversationId) {
      setConversations(prev => 
        prev.map(conv => 
          conv.id === currentConversationId 
            ? { 
                ...conv, 
                messages: [...conv.messages, message],
                lastMessage: content,
                timestamp: new Date()
              } 
            : conv
        )
      );
    }
    
    return message.id;
  }, [currentConversationId]);

  const updateMessage = useCallback((id: string, content: string, loading = false) => {
    setMessages(prev => 
      prev.map(message => 
        message.id === id 
          ? { ...message, content, loading } 
          : message
      )
    );
    
    // Update conversation
    if (currentConversationId) {
      setConversations(prev => 
        prev.map(conv => 
          conv.id === currentConversationId 
            ? { 
                ...conv, 
                messages: conv.messages.map(msg => 
                  msg.id === id 
                    ? { ...msg, content, loading }
                    : msg
                ),
                lastMessage: content,
              } 
            : conv
        )
      );
    }
  }, [currentConversationId]);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return;
    
    // If we're starting a new conversation, set a more descriptive title
    if (currentConversationId && messages.length <= 1) {
      // Update the conversation title based on the first user message
      const title = content.length > 30 ? `${content.substring(0, 30)}...` : content;
      setConversations(prev => 
        prev.map(conv => 
          conv.id === currentConversationId 
            ? { ...conv, title } 
            : conv
        )
      );
    }
    
    // Add user message
    addMessage(content, "user");
    
    // Add placeholder for assistant response
    const assistantMsgId = addMessage("", "assistant", true);
    
    setLoading(true);
    
    try {
      const response = await sendChatMessage(content);
      
      if (response.error) {
        updateMessage(assistantMsgId, "I'm sorry, I encountered an error. Please try again.", false);
        toast.error("Failed to get a response");
      } else {
        updateMessage(assistantMsgId, response.response, false);
      }
    } catch (error) {
      console.error("Error in chat:", error);
      updateMessage(assistantMsgId, "I'm sorry, something went wrong. Please try again later.", false);
      toast.error("Failed to communicate with the assistant");
    } finally {
      setLoading(false);
    }
  }, [addMessage, updateMessage, currentConversationId, messages.length]);

  const startNewConversation = useCallback(() => {
    const newConversationId = uuidv4();
    const initialMessage: Message = {
      id: uuidv4(),
      role: "assistant",
      content: "Hello, I'm your assistant. How can I help you today?",
      timestamp: new Date(),
    };
    
    const newConversation: Conversation = {
      id: newConversationId,
      title: "New Conversation",
      lastMessage: initialMessage.content,
      timestamp: new Date(),
      messages: [initialMessage],
    };
    
    setConversations(prev => [newConversation, ...prev]);
    setCurrentConversationId(newConversationId);
  }, []);

  const switchConversation = useCallback((conversationId: string) => {
    setCurrentConversationId(conversationId);
  }, []);

  return {
    messages,
    loading,
    sendMessage,
    conversations,
    currentConversationId,
    startNewConversation,
    switchConversation
  };
}
