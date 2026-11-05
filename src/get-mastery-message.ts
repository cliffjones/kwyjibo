import { formatDuration } from './processing/format-duration';

export const getMasteryMessage = (
  itemCount: number,
  ratingTotal: number,
  ratingCount: number,
  startTime: number,
  endTime: number,
): string => {
  if (itemCount <= 0) {
    return 'No cards selected.';
  }
  const accuracy = ratingCount > 0 ? Math.round((ratingTotal / ratingCount) * 25) : 0;
  const duration = formatDuration(endTime - startTime);
  return `You mastered ${itemCount} cards with ${accuracy}% accuracy over ${duration}.`;
};
