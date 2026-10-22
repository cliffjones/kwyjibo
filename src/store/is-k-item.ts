import { KItem } from './types';

export const isKItem = (value: unknown): value is KItem => {
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

  if (item.type === 'quiz' && (!item.solution || typeof item.solution !== 'string')) {
    return false;
  }

  if (typeof item.confidence !== 'number' || item.confidence < 0 || item.confidence > 5) {
    return false;
  }

  return true;
};
