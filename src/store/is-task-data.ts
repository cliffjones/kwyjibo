import { TaskData } from './types';

export const isTaskData = (value: unknown): value is TaskData => {
  if (value == null || typeof value !== 'object') {
    return false;
  }
  const item = value as Record<string, unknown>;

  if (!item.type || typeof item.type !== 'string') {
    return false;
  }

  if (!item.task || typeof item.task !== 'string') {
    return false;
  }

  if (item.solution) {
    return false;
  }

  if (typeof item.topic !== 'undefined' && typeof item.topic !== 'string') {
    return false;
  }

  return true;
};
