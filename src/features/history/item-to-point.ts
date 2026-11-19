import type { HistoryItem } from '../../processing/types';
import './style.scss';
import type { Point } from './types';

// Reduces a given history item to a timestamp and a single numeric value.
export const itemToPoint = (item: HistoryItem): Point => {
  let value = ((item.rating - 1) / 5) * 100;
  if (item.type === 'input' && item.response) {
    const responseValue = parseFloat(item.response);
    if (Number.isFinite(responseValue)) {
      value = responseValue;
    }
  }
  return {
    x: item.time,
    y: value,
  };
};
