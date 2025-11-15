import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Chat } from '@google/genai';
import { createTutorChat } from './services/geminiService';
import { ChatMessage } from './components/ChatMessage';
import { ChatInput } from './components/ChatInput';
import { LoadingIndicator } from './components/LoadingIndicator';
import { ChatMessage as ChatMessageType, MessageSender, Exercise } from './types';

export default function App() {
  const [messages, setMessages] = useState<ChatMessageType[]>([
    {
      id: crypto.randomUUID(),
      text: "Chào em! Anh/chị là Gia sư AI.\n\nĐể xây dựng lộ trình học hiệu quả nhất, em có muốn làm một bài kiểm tra trình độ ngắn (khoảng 5-10 phút) không?\n\nHãy trả lời bằng cách gõ: **Làm bài test** hoặc **Bỏ qua và vào học luôn**.",
      sender: MessageSender.AI,
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const chatRef = useRef<Chat | null>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  useEffect(() => {
    // Khởi tạo phiên trò chuyện khi component được tải.
    // Thao tác này chưa gửi tin nhắn hay gọi API.
    chatRef.current = createTutorChat();
  }, []);

  const handleSendMessage = useCallback(async (userMessage: string) => {
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

      // Cố gắng phân tích phản hồi dưới dạng JSON bài tập
      if (aiResponseText.trim().startsWith('{')) {
        try {
            const parsedJson = JSON.parse(aiResponseText);
            if (parsedJson.type === 'exercise' && parsedJson.exerciseType === 'multiple-choice') {
              exerciseData = parsedJson;
            }
        } catch (e) {
            // Không phải là JSON bài tập hợp lệ, coi như văn bản thông thường
            console.warn("Phản hồi của AI trông giống JSON nhưng không thể phân tích:", e);
        }
      }

      const aiMessage: ChatMessageType = {
        id: crypto.randomUUID(),
        text: exerciseData ? "Hãy làm bài tập sau đây nhé:" : aiResponseText,
        sender: MessageSender.AI,
        exercise: exerciseData,
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error: any) {
      console.error("Error sending message:", error);
      
      let errorMessageText = "Đã có lỗi xảy ra khi gửi tin nhắn. Vui lòng thử lại.";
      const errorString = error.toString();
      
      // Cung cấp thông báo lỗi cụ thể hơn cho các vấn đề về hạn mức
      if (errorString.includes('RESOURCE_EXHAUSTED') || errorString.includes('429')) {
         errorMessageText = "Lỗi: Bạn đã vượt quá hạn mức sử dụng API. Vui lòng kiểm tra gói dịch vụ và thông tin thanh toán của bạn trên Google AI Studio và thử lại sau.";
      }

      const errorMessage: ChatMessageType = {
        id: crypto.randomUUID(),
        text: errorMessageText,
        sender: MessageSender.AI,
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleExerciseComplete = useCallback(() => {
    // Tự động yêu cầu câu hỏi tiếp theo theo logic của system prompt
    handleSendMessage("Cho tôi câu hỏi tiếp theo.");
  }, [handleSendMessage]);

  return (
    <div className="flex flex-col h-screen bg-gray-100 font-sans">
      <header className="bg-white shadow-md p-4 border-b border-gray-200">
        <div className="max-w-4xl mx-auto flex items-center justify-center space-x-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
            AI
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-800">Gia Sư AI Tiếng Anh</h1>
            <p className="text-sm text-gray-500">Người bạn đồng hành học tập của bạn</p>
          </div>
        </div>
      </header>

      <main ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 md:p-6">
        <div className="max-w-4xl mx-auto">
          {messages.map((msg) => (
            <ChatMessage key={msg.id} message={msg} onExerciseComplete={handleExerciseComplete} />
          ))}
          {isLoading && <LoadingIndicator />}
        </div>
      </main>

      <footer className="sticky bottom-0 bg-gray-100">
        <div className="max-w-4xl mx-auto">
          <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
        </div>
      </footer>
    </div>
  );
}
