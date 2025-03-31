import { useState, useRef, useEffect } from "react";
import { FaRobot, FaTimes, FaPaperclip, FaMicrophone, FaPaperPlane, FaUser } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useAIAssistant } from "@/hooks/useAIAssistant";
import { useProvince } from "@/contexts/ProvinceContext";

type Message = {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
};

const formatTime = (date: Date) => {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const AIChatAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { province } = useProvince();
  const { messages, sendMessage, isLoading } = useAIAssistant();
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const handleSendMessage = async () => {
    if (input.trim() && !isLoading) {
      sendMessage(input);
      setInput("");
    }
  };
  
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat Toggle Button */}
      <Button 
        onClick={() => setIsOpen(!isOpen)} 
        className="w-14 h-14 rounded-full bg-primary shadow-lg text-white hover:bg-primary-foreground transition-colors"
      >
        <FaRobot className="text-xl" />
      </Button>
      
      {/* Chat Interface */}
      <Card 
        className={cn(
          "absolute bottom-16 right-0 w-96 overflow-hidden shadow-lg transition-all duration-300 transform",
          isOpen ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
        )}
      >
        <div className="bg-primary p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center">
                <FaRobot className="text-white text-sm" />
              </div>
              <div className="ml-3">
                <h3 className="text-white font-medium">Legal AI Assistant</h3>
                <p className="text-white/70 text-xs">Powered by Canadian legal data</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" className="text-white/70 hover:text-white" onClick={() => setIsOpen(false)}>
              <FaTimes />
            </Button>
          </div>
        </div>
        
        <div className="h-80 overflow-y-auto p-4 bg-neutral-50/50">
          {messages.length === 0 ? (
            <div className="flex mb-4">
              <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                <FaRobot className="text-primary text-sm" />
              </div>
              <div className="ml-3 bg-white p-3 rounded-lg rounded-tl-none shadow-sm max-w-[80%]">
                <p className="text-sm text-neutral-800">
                  Hello! I'm your legal AI assistant. How can I help you with your legal documents today?
                </p>
                <p className="text-xs text-neutral-500 mt-1">{formatTime(new Date())}</p>
              </div>
            </div>
          ) : (
            messages.map((message, index) => (
              <div 
                key={index} 
                className={cn(
                  "flex mb-4",
                  message.role === "user" && "justify-end"
                )}
              >
                {message.role === "assistant" && (
                  <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <FaRobot className="text-primary text-sm" />
                  </div>
                )}
                
                <div 
                  className={cn(
                    "p-3 rounded-lg shadow-sm max-w-[80%]",
                    message.role === "assistant" 
                      ? "ml-3 bg-white rounded-tl-none" 
                      : "mr-3 bg-primary rounded-tr-none"
                  )}
                >
                  <p className={cn(
                    "text-sm",
                    message.role === "assistant" ? "text-neutral-800" : "text-white"
                  )}>
                    {message.content}
                  </p>
                  <p className={cn(
                    "text-xs mt-1",
                    message.role === "assistant" ? "text-neutral-500" : "text-white/70"
                  )}>
                    {formatTime(message.timestamp)}
                  </p>
                </div>
                
                {message.role === "user" && (
                  <div className="flex-shrink-0 h-8 w-8 rounded-full bg-neutral-200 flex items-center justify-center">
                    <FaUser className="text-neutral-600 text-sm" />
                  </div>
                )}
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
        
        <div className="p-3 border-t border-neutral-200">
          <div className="flex">
            <Button variant="ghost" size="icon" className="text-neutral-500 hover:text-primary transition-colors">
              <FaPaperclip />
            </Button>
            <Button variant="ghost" size="icon" className="text-neutral-500 hover:text-primary transition-colors">
              <FaMicrophone />
            </Button>
            <Input
              type="text"
              className="flex-1 px-3 py-2 text-sm focus:ring-1 focus:ring-primary"
              placeholder="Type your question..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
            />
            <Button 
              className="ml-2"
              onClick={handleSendMessage}
              disabled={!input.trim() || isLoading}
            >
              <FaPaperPlane />
            </Button>
          </div>
          <div className="mt-2 text-center">
            <span className="text-xs text-neutral-500">
              Responses are based on {province} legal data
            </span>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AIChatAssistant;
