import type { ConfigData, TaskItem } from '../data/types';

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
