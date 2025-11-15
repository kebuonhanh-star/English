export enum MessageSender {
    USER = 'user',
    AI = 'ai',
}

export interface Exercise {
  type: 'exercise';
  exerciseType: 'multiple-choice';
  question: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
}

export interface ChatMessage {
    id: string;
    text: string;
    sender: MessageSender;
    exercise?: Exercise;
}
