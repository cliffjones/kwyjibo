export type ConfigData = {
  language?: string;
  title?: string;
  heading?: string;
  intro?: string;
  footer?: string;
};

export type LineConfigData = {
  left?: boolean;
  right?: boolean;
  order?: number;
  value?: number;
};

export type TaskData = {
  topic?: string;
  type?: string;
  task: string;
  solution?: string;
};

export type TaskItem = {
  id: number;
  type: string;
  topic: string;
  task: string;
  solution: string;
  rating: number;
};
