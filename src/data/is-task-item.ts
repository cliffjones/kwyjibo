import { isPlainObject } from './is-plain-object';
import type { TaskItem } from './types';

export const isTaskItem = (value: unknown): value is TaskItem => {
  if (!isPlainObject(value)) {
    return false;
  }

  if (typeof value.id !== 'number') {
    return false;
  }

  if (typeof value.type !== 'string') {
    return false;
  }

  if (typeof value.topic !== 'string') {
    return false;
  }

  if (!value.task || typeof value.task !== 'string') {
    return false;
  }

  if (value.type === 'question' && (!value.solution || typeof value.solution !== 'string')) {
    return false;
  }

  if (typeof value.rating !== 'number' || value.rating < 0 || value.rating > 5) {
    return false;
  }

  return true;
};
