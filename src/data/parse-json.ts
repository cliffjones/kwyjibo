import JSON5 from 'json5';
import { FORBIDDEN_JSON_KEYS } from './constants';

// Securely parse potentially user-supplied JSON using more flexible syntax.
export const parseJson = (text: string): unknown => {
  if (!text) {
    return null;
  }

  // Interpret any keys with no value specified as unary flags.
  const normalizedText = text.replace(
    /(^|[{,]\s*)([a-z_$][\w$-]*)(?=\s*(?:[},]))/gi,
    (_, prefix: string, key: string) => `${prefix}${key}: true`
  );

  try {
    return JSON5.parse(normalizedText, (key, value) => {
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
