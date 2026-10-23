export type ConfigData = {
  theme?: string;
  language?: string;
  title?: string;
  heading?: string;
  intro?: string;
  footer?: string;
};

export type TaskData = {
  topic?: string;
  type?: string; // question, reminder, binary (?), value (=)...?
  task: string;
  solution?: string;
};

export type TaskItem = {
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
  items: TaskItem[];
  customData: string;
  initializing: boolean;
  lightMode: boolean;
  selectedTopics: string[];
  remainingIds: number[];
  currentId: number | null;
};
