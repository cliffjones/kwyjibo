import { isPlainObject } from './is-plain-object';
import { isResponseData } from './is-response-data';
import type { TaskData } from './types';

export const isTaskData = (value: unknown): value is TaskData => {
  if (!isPlainObject(value)) {
    return false;
  }

  if (value.topic != null && typeof value.topic !== 'string') {
    return false;
  }

  if (value.type != null && typeof value.type !== 'string') {
    return false;
  }

  if (!value.task || typeof value.task !== 'string') {
    return false;
  }

  if (value.solution != null && typeof value.solution !== 'string') {
    return false;
  }

  if (value.responses != null && (!Array.isArray(value.responses) || !value.responses.every(isResponseData))) {
    return false;
  }

  return true;
};
