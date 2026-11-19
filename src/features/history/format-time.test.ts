import { formatTime } from './format-time';

describe('formatTime', () => {
  it('returns an empty string for missing or invalid values', () => {
    expect(formatTime(0)).toBe('');
    expect(formatTime(null)).toBe('');
    expect(formatTime('invalid')).toBe('');
  });

  it('formats a full local date and time', () => {
    const time = new Date(2024, 4, 12, 14, 35).getTime();
    expect(formatTime(time)).toBe(new Date(time).toLocaleString(undefined, { dateStyle: 'short', timeStyle: 'short' }));
  });

  it('formats compact labels as a time for today and a date otherwise', () => {
    const today = new Date();
    const todayTime = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 14, 35).getTime();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayTime = yesterday.getTime();

    expect(formatTime(todayTime, true)).toBe(
      new Date(todayTime).toLocaleString(undefined, { hour: 'numeric', minute: '2-digit' }),
    );
    expect(formatTime(yesterdayTime, true)).toBe(
      new Date(yesterdayTime).toLocaleString(undefined, { month: 'numeric', day: 'numeric' }),
    );
  });
});
