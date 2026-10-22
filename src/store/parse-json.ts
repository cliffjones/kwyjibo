import JSON5 from 'json5';
import { FORBIDDEN_JSON_KEYS } from './constants';

// Securely parse potentially user-supplied JSON using more flexible syntax.
export const parseJson = (text: string): unknown => {
  if (!text) {
    return null;
  }

  try {
    return JSON5.parse(text, (key, value) => {
      if (FORBIDDEN_JSON_KEYS.includes(key)) {
        throw new Error('Forbidden key detected.');
      }
      return value;
    });
  } catch (error) {
    console.error('Unable to parse JSON.', error);
  }

  return null;
};
