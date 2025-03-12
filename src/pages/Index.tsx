
import { motion } from "framer-motion";
import ChatInterface from "@/components/ChatInterface";

const Index = () => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen"
    >
      <ChatInterface />
    </motion.div>
  );
};

export default Index;
