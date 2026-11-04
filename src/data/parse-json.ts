import JSON5 from 'json5';
import { FORBIDDEN_JSON_KEYS } from './constants';

// Interprets any keys with no value specified as unary flags, while leaving quoted strings alone.
const normalizeBareKeys = (text: string): string => {
  let normalizedText = '';
  let inString = false;
  let quoteChar: '"' | "'" | null = null;

  for (let index = 0; index < text.length; index++) {
    const char = text[index];

    if (inString) {
      normalizedText += char;
      if (char === quoteChar && text[index - 1] !== '\\') {
        inString = false;
        quoteChar = null;
      }
      continue;
    }

    if (char === '"' || char === "'") {
      inString = true;
      quoteChar = char;
      normalizedText += char;
      continue;
    }

    if (/[A-Za-z_$]/.test(char)) {
      const before = normalizedText.replace(/\s+$/g, '');
      const previous = before.at(-1) ?? '';
      const keyStart = index;
      let keyEnd = index + 1;

      while (keyEnd < text.length && /[\w$-]/.test(text[keyEnd])) {
        keyEnd += 1;
      }

      let nextIndex = keyEnd;
      while (nextIndex < text.length && /\s/.test(text[nextIndex])) {
        nextIndex += 1;
      }

      const nextChar = text[nextIndex] ?? '';
      if ((previous === '{' || previous === ',') && nextChar !== ':') {
        normalizedText += `${text.slice(keyStart, keyEnd)}: true`;
        index = keyEnd - 1;
        continue;
      }
    }

    normalizedText += char;
  }

  return normalizedText;
};

// Securely parses potentially user-supplied JSON using more flexible syntax.
export const parseJson = (text: string): unknown => {
  if (!text) {
    return null;
  }

  try {
    return JSON5.parse(normalizeBareKeys(text), (key, value) => {
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
