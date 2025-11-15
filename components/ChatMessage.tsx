import React from 'react';
import { ChatMessage as ChatMessageType, MessageSender } from '../types';
import { ExerciseCard } from './ExerciseCard';

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
  onExerciseComplete: () => void;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message, onExerciseComplete }) => {
  const isUser = message.sender === MessageSender.USER;

  const renderText = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={index}>{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  const messageContent = message.text && message.text.trim() !== '' 
    ? <div className="whitespace-pre-wrap">{renderText(message.text)}</div>
    : null;

  return (
    <div className={`flex items-start gap-3 my-4 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && <AiIcon />}
      <div className={`p-4 rounded-2xl max-w-lg lg:max-w-xl xl:max-w-2xl break-words shadow-sm ${isUser ? 'bg-blue-600 text-white rounded-br-none' : 'bg-white text-gray-800 rounded-bl-none'}`}>
         {messageContent}
         {message.exercise && (
            <div className={messageContent ? 'mt-4' : ''}>
                 <ExerciseCard
                    exercise={message.exercise}
                    onComplete={onExerciseComplete}
                />
            </div>
         )}
      </div>
      {isUser && <UserIcon />}
    </div>
  );
};
