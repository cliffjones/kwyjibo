import { ratingToPercent } from './rating-to-percent';

describe('ratingToPercent', () => {
  it('converts a rating into a percentage', () => {
    expect(ratingToPercent(1)).toBe('0%');
    expect(ratingToPercent(2)).toBe('25%');
    expect(ratingToPercent(3)).toBe('50%');
    expect(ratingToPercent(4)).toBe('75%');
    expect(ratingToPercent(5)).toBe('100%');
  });
});
