
import React from 'react';

const AiIcon: React.FC = () => (
  <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
    AI
  </div>
);

export const LoadingIndicator: React.FC = () => {
    return (
        <div className="flex items-start gap-3 my-4 justify-start">
            <AiIcon />
            <div className="p-4 rounded-2xl max-w-sm bg-white text-gray-800 rounded-bl-none shadow-sm">
                <div className="flex items-center justify-center space-x-1.5">
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
            </div>
        </div>
    );
};
