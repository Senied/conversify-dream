
import { useState, useEffect, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";
import { sendChatMessage } from "@/utils/api";
import { Message } from "@/components/ChatMessage";

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  // Initialize with welcome message
  useEffect(() => {
    const initialMessage: Message = {
      id: uuidv4(),
      role: "assistant",
      content: "Hello, I'm your assistant. How can I help you today?",
      timestamp: new Date(),
    };
    
    setMessages([initialMessage]);
  }, []);

  const addMessage = useCallback((content: string, role: "user" | "assistant", loading = false) => {
    const message: Message = {
      id: uuidv4(),
      content,
      role,
      timestamp: new Date(),
      loading,
    };
    
    setMessages(prev => [...prev, message]);
    return message.id;
  }, []);

  const updateMessage = useCallback((id: string, content: string, loading = false) => {
    setMessages(prev => 
      prev.map(message => 
        message.id === id 
          ? { ...message, content, loading } 
          : message
      )
    );
  }, []);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return;
    
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
  }, [addMessage, updateMessage]);

  return {
    messages,
    loading,
    sendMessage,
  };
}
