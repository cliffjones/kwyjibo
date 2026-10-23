import { LENGTH_SIZING_CEILING, LENGTH_SIZING_FLOOR } from './constants';

// Calculates a font size based on supplied text. The longer the text, the smaller the font.
export const getTextSize = (text: string) => {
  const boundedLength = Math.max(LENGTH_SIZING_FLOOR, Math.min(text.length, LENGTH_SIZING_CEILING));
  const fractionalSize = (LENGTH_SIZING_CEILING - boundedLength) / (LENGTH_SIZING_CEILING - LENGTH_SIZING_FLOOR);
  return `${(1.5 + fractionalSize)}rem`;
};
