
import { SendIcon } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSend, disabled = false }) => {
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (input.trim() && !disabled) {
      onSend(input.trim());
      setInput("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  useEffect(() => {
    // Adjust textarea height on input change
    if (textareaRef.current) {
      textareaRef.current.style.height = "48px";
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        200
      )}px`;
    }
  }, [input]);

  return (
    <div className="relative w-full max-w-3xl mx-auto px-4 md:px-8 mb-8">
      <motion.form 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        onSubmit={handleSubmit} 
        className="relative glass-panel rounded-xl overflow-hidden"
      >
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          placeholder="Ask a question..."
          rows={1}
          className="w-full resize-none bg-transparent text-foreground py-4 px-4 pr-14 outline-none border-none focus:ring-0 text-sm h-12 min-h-[48px] max-h-[200px]"
        />
        <Button
          type="submit"
          disabled={disabled || !input.trim()}
          size="icon"
          className="absolute bottom-1.5 right-1.5 h-9 w-9 rounded-lg opacity-90 hover:opacity-100 transition-opacity"
        >
          <SendIcon className="h-4 w-4" />
        </Button>
      </motion.form>
    </div>
  );
};

export default ChatInput;
