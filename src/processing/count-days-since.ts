import { MS_PER_DAY } from './constants';

// Determines the number of days from a given timestamp to now.
export const countDaysSince = (date: number) => {
  if (!date) {
    return 0;
  }

  return Math.round((Date.now() - date) / MS_PER_DAY);
};
