import { useState, useCallback, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useProvince } from "@/contexts/ProvinceContext";
import { toast } from "@/hooks/use-toast";

type Message = {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
};

export function useAIAssistant() {
  const { province } = useProvince();
  const [messages, setMessages] = useState<Message[]>([]);
  
  // Initialize with welcome message if needed
  useEffect(() => {
    if (messages.length === 0) {
      // We'll let the component handle the initial UI-only message
    }
  }, [messages]);
  
  const chatMutation = useMutation({
    mutationFn: async (userMessage: string) => {
      const apiMessages = [
        ...messages.map(msg => ({ role: msg.role, content: msg.content })),
        { role: "user", content: userMessage }
      ];
      
      const response = await apiRequest("POST", "/api/ai/chat", {
        messages: apiMessages,
        province,
      });
      
      return response.json();
    },
    onError: (error) => {
      toast({
        title: "Chat Error",
        description: "Failed to get a response. Please try again.",
        variant: "destructive",
      });
    },
  });
  
  const sendMessage = useCallback(
    (content: string) => {
      // Add user message immediately to the UI
      const userMessage: Message = {
        role: "user",
        content,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, userMessage]);
      
      // Send to API
      chatMutation.mutate(content, {
        onSuccess: (data) => {
          // Add assistant response when it comes back
          const assistantMessage: Message = {
            role: "assistant",
            content: data.response,
            timestamp: new Date(),
          };
          
          setMessages(prev => [...prev, assistantMessage]);
        }
      });
    },
    [chatMutation, setMessages]
  );
  
  return {
    messages,
    sendMessage,
    isLoading: chatMutation.isPending,
  };
}
