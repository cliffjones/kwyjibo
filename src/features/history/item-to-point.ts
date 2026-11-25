import { ITEM_TYPES } from '../../processing/constants';
import { extractFirstNumber } from '../../processing/extract-first-number';
import { ratingToPercent } from '../../processing/rating-to-percent';
import type { HistoryItem } from '../../processing/types';
import './style.scss';
import type { Point } from './types';

// Reduces a given history item to a timestamp and a single numeric value.
export const itemToPoint = (item: HistoryItem): Point | null => {
  let value = ratingToPercent(item.rating);
  if (item.type === ITEM_TYPES.input) {
    const responseValue = extractFirstNumber(item.response ?? '');
    if (!Number.isFinite(responseValue)) {
      return null;
    }
    value = responseValue;
  }
  return {
    x: item.time,
    y: value,
    tooltipLabels: [item.type === ITEM_TYPES.input ? (item.response ?? '') : `${ratingToPercent(item.rating)}%`],
  };
};
