// Returns the icon name for a given face number (1-5).
export const faceNumberToName = (num: number): string => {
  if (num >= 5) {
    return 'yes';
  }

  switch (Math.floor(num)) {
    case 4:
      return 'positive';
    case 3:
      return 'neutral';
    case 2:
      return 'negative';
    default:
      return 'no';
  }
};
