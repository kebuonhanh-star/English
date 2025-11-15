import React, { useState, useEffect, useRef } from 'react';
import { Exercise } from '../types';

interface ExerciseCardProps {
  exercise: Exercise;
  onComplete: () => void;
}

const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
    <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.052-.143Z" clipRule="evenodd" />
  </svg>
);

const XMarkIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
    <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
  </svg>
);


export const ExerciseCard: React.FC<ExerciseCardProps> = ({ exercise, onComplete }) => {
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const onCompleteCalled = useRef(false);

  useEffect(() => {
    if (isAnswered && !onCompleteCalled.current) {
      onCompleteCalled.current = true;
      const timer = setTimeout(() => {
        onComplete();
      }, 3000); // Wait 3 seconds before getting the next question
      return () => clearTimeout(timer);
    }
  }, [isAnswered, onComplete]);

  const handleOptionClick = (index: number) => {
    if (isAnswered) return;
    setIsAnswered(true);
    setSelectedOptionIndex(index);
  };

  return (
    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
      <p className="font-semibold text-gray-900 mb-4">{exercise.question}</p>
      <div className="space-y-2">
        {exercise.options.map((option, index) => {
          const isCorrect = index === exercise.correctOptionIndex;
          const isSelected = index === selectedOptionIndex;
          
          let buttonClass = "w-full text-left p-3 rounded-lg border transition-all duration-200 flex items-center justify-between ";
          
          if (isAnswered) {
            if (isCorrect) {
              buttonClass += "bg-green-100 border-green-400 text-green-800 font-semibold";
            } else if (isSelected) {
              buttonClass += "bg-red-100 border-red-400 text-red-800";
            } else {
              buttonClass += "bg-gray-100 border-gray-200 text-gray-500 opacity-70";
            }
          } else {
            buttonClass += "bg-white border-gray-300 hover:bg-indigo-50 hover:border-indigo-400 cursor-pointer";
          }

          return (
            <button
              key={index}
              disabled={isAnswered}
              onClick={() => handleOptionClick(index)}
              className={buttonClass}
              aria-pressed={isSelected}
            >
              <span>{option}</span>
              {isAnswered && isCorrect && <CheckIcon />}
              {isAnswered && isSelected && !isCorrect && <XMarkIcon />}
            </button>
          );
        })}
      </div>
      {isAnswered && (
        <div className="mt-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 rounded-r-lg">
            <h4 className="font-bold text-yellow-800">Giải thích</h4>
            <p className="text-yellow-700">{exercise.explanation}</p>
        </div>
      )}
    </div>
  );
};
