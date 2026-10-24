export type ConfigData = {
  language?: string;
  title?: string;
  heading?: string;
  intro?: string;
  footer?: string;
};

export type TaskData = {
  topic?: string;
  type?: string; // question, reminder (+), log (=)...?
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
