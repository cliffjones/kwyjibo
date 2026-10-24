import { MD_LIST_ITEM_PATTERN } from './constants';
import type { ContentToken } from './types';

export const tokenizeContent = (value: string): ContentToken[] => {
  const tokens: ContentToken[] = [];
  let position = 0;
  let textStart = 0;

  while (position < value.length) {
    const character = value[position];
    if (character !== '-' && character !== '\r' && character !== '\n' && character !== ' ') {
      position += 1;
      continue;
    }

    const listItemMatch = MD_LIST_ITEM_PATTERN.exec(value.slice(position));
    if (listItemMatch?.[1]) {
      if (position > textStart) {
        tokens.push({ type: 'text', text: value.slice(textStart, position) });
      }
      tokens.push({ type: 'list-item', text: listItemMatch[1].trim() });
      position += listItemMatch[0].length;
      textStart = position;
    } else {
      position += 1;
    }
  }

  if (textStart < value.length) {
    tokens.push({ type: 'text', text: value.slice(textStart) });
  }
  return tokens;
};
