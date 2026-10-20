import { SETTINGS_KEYS } from './constants';
import { QuizSettings } from './types';

export const isQuizSettings = (value: unknown): value is QuizSettings => {
  if (value == null || typeof value !== 'object') {
    return false;
  }

  for (const key of Object.keys(value)) {
    if (!(SETTINGS_KEYS as string[]).includes(key)) {
      return false;
    }
  }

  return true;
};
