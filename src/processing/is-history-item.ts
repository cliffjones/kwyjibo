import { isPlainObject } from './is-plain-object';
import type { HistoryItem } from './types';

export const isHistoryItem = (value: unknown): value is HistoryItem => {
  if (!isPlainObject(value)) {
    return false;
  }

  return (
    typeof value.time === 'number' &&
    typeof value.type === 'string' &&
    typeof value.topic === 'string' &&
    typeof value.task === 'string' &&
    (value.response === undefined || typeof value.response === 'string') &&
    typeof value.rating === 'number'
  );
};
