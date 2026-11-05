import { formatDuration } from './format-duration';

describe('formatDuration', () => {
  it('formats durations with day, hour, minute, and second parts', () => {
    expect(formatDuration(1 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000 + 3 * 60 * 1000 + 4 * 1000)).toBe(
      '1 day, 2 hours, 3 minutes, 4 seconds',
    );
  });

  it('omits zero-value components and keeps seconds when needed', () => {
    expect(formatDuration(3 * 60 * 1000 + 5 * 1000)).toBe('3 minutes, 5 seconds');
    expect(formatDuration(5 * 1000)).toBe('5 seconds');
    expect(formatDuration(0)).toBe('0 seconds');
  });

  it('returns an empty string for invalid values', () => {
    expect(formatDuration(-1)).toBe('');
    expect(formatDuration(Number.NaN)).toBe('');
    expect(formatDuration(Number.POSITIVE_INFINITY)).toBe('');
  });
});
