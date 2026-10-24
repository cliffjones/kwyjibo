import { matchInlineToken } from './match-inline-token';
import type { InlineToken } from './types';

export const tokenizeInline = (value: string): InlineToken[] => {
  const tokens: InlineToken[] = [];
  let position = 0;
  let textStart = 0;

  while (position < value.length) {
    const character = value[position];
    if (character !== '!' && character !== '[' && character !== '`' && character !== '*') {
      position += 1;
      continue;
    }

    const match = matchInlineToken(value, position);
    if (!match) {
      position += 1;
      continue;
    }

    if (position > textStart) {
      tokens.push({ type: 'text', text: value.slice(textStart, position) });
    }
    tokens.push(match.token);
    position += match.length;
    textStart = position;
  }

  if (textStart < value.length) {
    tokens.push({ type: 'text', text: value.slice(textStart) });
  }
  return tokens;
};
