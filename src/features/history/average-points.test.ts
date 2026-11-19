import { averagePoints } from './average-points';

describe('averagePoints', () => {
  it('averages coordinates, rounding time to an integer and value to two decimals', () => {
    expect(
      averagePoints([
        { x: 10, y: 1.123 },
        { x: 13, y: 2.234 },
        { x: 17, y: 4.567 },
      ]),
    ).toEqual({ x: 13, y: 2.64 });
  });

  it('returns a single point with the same rounding rules', () => {
    expect(averagePoints([{ x: 2.6, y: 3.456 }])).toEqual({ x: 3, y: 3.46 });
  });
});
