import { isPlainObject } from './is-plain-object';
import type { TaskData } from './types';

export const isTaskData = (value: unknown): value is TaskData => {
  if (!isPlainObject(value)) {
    return false;
  }
  const item = value as Record<string, unknown>;

  if (item.topic != null && typeof item.topic !== 'string') {
    return false;
  }

  if (item.type != null && typeof item.type !== 'string') {
    return false;
  }

  if (!item.task || typeof item.task !== 'string') {
    return false;
  }

  if (item.solution != null && typeof item.solution !== 'string') {
    return false;
  }

  return true;
};
