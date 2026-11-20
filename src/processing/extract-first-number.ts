export const extractFirstNumber = (text: string) => {
  const match = text.replace(/,/g, '').match(/[+-]?(?:\d+\.?\d*|\.\d+)/);
  return match ? parseFloat(match[0]) : NaN;
};
