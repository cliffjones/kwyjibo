export type ConfigData = {
  theme?: string;
  language?: string;
  title?: string;
  heading?: string;
  intro?: string;
  footer?: string;
};

export type QuizData = {
  task: string;
  solution: string;
  topic?: string;
};

export type TaskData = {
  type: string; // Binary (-), numeric (#), text (>)...?
  task: string;
  topic?: string;
};

export type KData = QuizData | TaskData;

export type KItem = {
  id: number;
  type: string;
  topic: string;
  task: string;
  solution: string;
  confidence: number;
};

export type AppState = {
  sourcePath: string;
  configData: ConfigData;
  items: KItem[];
  customData: string;
  initializing: boolean;
  lightMode: boolean;
  selectedTopics: string[];
  remainingIds: number[];
  currentId: number | null;
};
