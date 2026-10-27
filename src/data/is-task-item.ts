import type { TaskItem } from './types';

export const isTaskItem = (value: unknown): value is TaskItem => {
  if (value == null || typeof value !== 'object') {
    return false;
  }
  const item = value as Record<string, unknown>;

  if (typeof item.id !== 'number') {
    return false;
  }

  if (typeof item.type !== 'string') {
    return false;
  }

  if (typeof item.topic !== 'string') {
    return false;
  }

  if (!item.task || typeof item.task !== 'string') {
    return false;
  }

  if (item.type === 'question' && (!item.solution || typeof item.solution !== 'string')) {
    return false;
  }

  if (typeof item.rating !== 'number' || item.rating < 0 || item.rating > 5) {
    return false;
  }

  return true;
};
