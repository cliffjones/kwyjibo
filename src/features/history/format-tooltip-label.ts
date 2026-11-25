import { MAX_LABEL_LENGTH, MAX_LABEL_LINES, TRUNCATION_MARKER } from './constants';

export const formatTooltipLabel = (datasetLabel: string, values: string[]): string[] => {
  const formattedValues = values.map((value) => {
    const characters = Array.from(value);
    const truncated = characters.length > MAX_LABEL_LENGTH;
    return {
      text: truncated ? `${characters.slice(0, MAX_LABEL_LENGTH - 1).join('')}${TRUNCATION_MARKER}` : value,
      truncated,
    };
  });
  const displayedValues = formattedValues.slice(0, MAX_LABEL_LINES);

  if (values.length > MAX_LABEL_LINES && !displayedValues[MAX_LABEL_LINES - 1].truncated) {
    displayedValues[MAX_LABEL_LINES - 1].text += TRUNCATION_MARKER;
  }

  return displayedValues.map(({ text }, index) => (index === 0 ? `${datasetLabel}: ${text}` : text));
};
