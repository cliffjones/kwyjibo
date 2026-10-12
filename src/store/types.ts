export type QuizData = {
  question: string;
  answer: string;
  topic?: string;
};

export type QuizItem = {
  id: number;
  topic: string;
  question: string;
  answer: string;
  confidence: number;
};

export type AppState = {
  sourcePath: string;
  items: QuizItem[];
  customData: string;
  initializing: boolean;
  darkMode: boolean;
  selectedTopics: string[];
  remainingIds: number[];
  currentId: number | null;
};
