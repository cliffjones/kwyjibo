const MIN_LENGTH = 50;
const MAX_LENGTH = 250;

// Calculates a font size based on supplied text. The longer the text, the smaller the font.
export const getTextSize = (text: string) => {
  const boundedLength = Math.max(MIN_LENGTH, Math.min(text.length, MAX_LENGTH));
  const fractionalSize = (MAX_LENGTH - boundedLength) / (MAX_LENGTH - MIN_LENGTH);
  return `${(1.5 + fractionalSize)}rem`;
};
