
import React from 'react';
import { ChatMessage as ChatMessageType, MessageSender } from '../types';

const AiIcon: React.FC = () => (
  <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
    AI
  </div>
);

const UserIcon: React.FC = () => (
  <div className="w-8 h-8 rounded-full bg-gray-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
    Me
  </div>
);

interface ChatMessageProps {
  message: ChatMessageType;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.sender === MessageSender.USER;

  // This simple renderer handles bold text (**text**) and newlines.
  const renderText = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={index}>{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  return (
    <div className={`flex items-start gap-3 my-4 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && <AiIcon />}
      <div className={`p-4 rounded-2xl max-w-lg lg:max-w-xl xl:max-w-2xl break-words shadow-sm ${isUser ? 'bg-blue-600 text-white rounded-br-none' : 'bg-white text-gray-800 rounded-bl-none'}`}>
         <div className="whitespace-pre-wrap">{renderText(message.text)}</div>
      </div>
      {isUser && <UserIcon />}
    </div>
  );
};
