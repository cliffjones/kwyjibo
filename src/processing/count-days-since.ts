const MS_PER_DAY = 1000 * 60 * 60 * 24;

export const countDaysSince = (date: number) => Math.round((Date.now() - date) / MS_PER_DAY);
