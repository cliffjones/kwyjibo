import type { ConfigData, TaskItem } from '../processing/types';

export type AppState = {
  sourcePath: string;
  configData: ConfigData;
  items: TaskItem[];
  customData: string;
  resolvedCustomData?: string;
  lightMode: boolean;
  initializing: boolean;
  startTime: number;
  ratingTotal: number;
  ratingCount: number;
  selectedTopics: string[];
  remainingIds: number[];
  currentId: number | null;
};
