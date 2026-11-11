import { ALTERNATION_PATTERN, LANG, PLACEHOLDER_PATTERN } from './constants';
import { formatDuration } from './processing/format-duration';
import type { ConfigData } from './processing/types';

// Calculates the accuracy percentage based on the total rating and the number of rated items.
const getAccuracy = (total: number, count: number): number => {
  if (count <= 0) {
    return 0;
  }
  return Math.round((total / count / 4) * 100);
};

// Generates a summary message for once the deck has been completed.
export const getResults = (
  itemCount: number,
  ratingTotal: number,
  ratingCount: number,
  startTime: number,
  endTime: number,
  configData: ConfigData = {},
): string => {
  if (itemCount <= 0) {
    return configData.noCardsMessage || LANG.noCardsMessage;
  }

  const accuracy = getAccuracy(ratingTotal, ratingCount);
  const duration = formatDuration(endTime - startTime, configData);
  let message = (configData.resultsMessage || LANG.resultsMessage)
    .replace(PLACEHOLDER_PATTERN, `${itemCount}`)
    .replace(ALTERNATION_PATTERN, itemCount === 1 ? '$1' : '$2')
    .replace(PLACEHOLDER_PATTERN, accuracy.toString())
    .replace(PLACEHOLDER_PATTERN, duration);
  return message;
};
