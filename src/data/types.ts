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

export type ResponseData = {
  text: string;
  value: number;
  order: number;
};

export type TaskData = {
  task: string;
  topic?: string;
  type?: string;
  solution?: string;
  responses?: ResponseData[];
};

export type TaskItem = {
  id: number;
  type: string;
  topic: string;
  task: string;
  solution: string;
  responses: ResponseData[];
  rating: number;
};
