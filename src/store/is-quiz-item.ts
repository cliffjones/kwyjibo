import { QuizItem } from './types';

export const isQuizItem = (value: unknown): value is QuizItem => {
  if (value == null || typeof value !== 'object') {
    return false;
  }
  const item = value as Record<string, unknown>;

  if (typeof item.id !== 'number') {
    return false;
  }

  if (typeof item.topic !== 'string') {
    return false;
  }

  if (!item.question || typeof item.question !== 'string') {
    return false;
  }

  if (!item.answer || typeof item.answer !== 'string') {
    return false;
  }

  if (typeof item.confidence !== 'number' || item.confidence < 0 || item.confidence > 5) {
    return false;
  }

  return true;
};
