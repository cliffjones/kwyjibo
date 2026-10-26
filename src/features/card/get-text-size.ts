import {
  CONTENT_LENGTH_CEILING,
  CONTENT_LENGTH_FLOOR,
  CONTENT_SIZE_MAX,
  CONTENT_SIZE_MIN
} from './constants';

// Calculates a font size based on supplied text. The longer the text, the smaller the font.
export const getTextSize = (text: string) => {
  const boundedLength = Math.max(CONTENT_LENGTH_FLOOR, Math.min(text.length, CONTENT_LENGTH_CEILING));
  const fractionalSize = (CONTENT_LENGTH_CEILING - boundedLength) / (CONTENT_LENGTH_CEILING - CONTENT_LENGTH_FLOOR);
  const sizeBoost = (CONTENT_SIZE_MAX - CONTENT_SIZE_MIN) * fractionalSize;
  return `${(CONTENT_SIZE_MIN + sizeBoost)}rem`;
};
