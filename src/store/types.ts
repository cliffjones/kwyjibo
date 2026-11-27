import type { ConfigData, HistoryItem, TaskItem } from '../processing/types';

export type ProgressState = {
  pointBalance: number;
  activeSince: number;
};

export type MosaicState = {
  tiles: Record<string, string>;
  currentColor: string;
};

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
  history: HistoryItem[];
};
