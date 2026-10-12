import { QuizData } from './types';

export const isQuizData = (value: unknown): value is QuizData => {
  if (value == null || typeof value !== 'object') {
    return false;
  }
  const item = value as Record<string, unknown>;

  if (!item.question || typeof item.question !== 'string') {
    return false;
  }

  if (!item.answer || typeof item.answer !== 'string') {
    return false;
  }

  if (typeof item.topic !== 'undefined' && typeof item.topic !== 'string') {
    return false;
  }

  return true;
};
