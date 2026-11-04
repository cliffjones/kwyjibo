export const ratingToPercent = (num: number): string => `${Math.round(((num - 1) / 4) * 100)}%`;
