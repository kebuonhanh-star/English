import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Chat } from '@google/genai';
import { createTutorChat } from './services/geminiService';
import { ChatMessage } from './components/ChatMessage';
import { ChatInput } from './components/ChatInput';
import { LoadingIndicator } from './components/LoadingIndicator';
import { ChatMessage as ChatMessageType, MessageSender, Exercise } from './types';

export default function App() {
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const chatRef = useRef<Chat | null>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const initializeChat = useCallback(async () => {
    try {
      const chat = createTutorChat();
      chatRef.current = chat;
      const initialResponse = await chat.sendMessage({ message: "Bắt đầu buổi học." });
      setMessages([{
        id: crypto.randomUUID(),
        text: initialResponse.text,
        sender: MessageSender.AI,
      }]);
    } catch (error) {
      console.error("Initialization failed:", error);
      setMessages([{
        id: crypto.randomUUID(),
        text: "Xin lỗi, không thể khởi tạo gia sư AI. Vui lòng kiểm tra lại cấu hình và thử lại sau.",
        sender: MessageSender.AI,
      }]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    initializeChat();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSendMessage = async (userMessage: string) => {
    if (!chatRef.current || !userMessage.trim()) return;

    const newUserMessage: ChatMessageType = {
      id: crypto.randomUUID(),
      text: userMessage,
      sender: MessageSender.USER,
    };
    setMessages(prev => [...prev, newUserMessage]);
    setIsLoading(true);

    try {
      const response = await chatRef.current.sendMessage({ message: userMessage });
      const aiResponseText = response.text;
      let exerciseData: Exercise | undefined;

      try {
        const parsedJson = JSON.parse(aiResponseText);
        if (parsedJson