import { QuizData } from './types';

export const isQuizData = (value: unknown): value is QuizData => {
  if (value == null || typeof value !== 'object') {
    return false;
  }
  const item = value as Record<string, unknown>;

  if (!item.task || typeof item.task !== 'string') {
    return false;
  }

  if (!item.solution || typeof item.solution !== 'string') {
    return false;
  }

  if (typeof item.topic !== 'undefined' && typeof item.topic !== 'string') {
    return false;
  }

  return true;
};
