import { shiftColor } from './shift-color';

describe('shiftColor', () => {
  it.each([
    ['#ff0000', '#9400ff'],
    ['#ffff00', '#ff006b'],
    ['#00ff00', '#ff9400'],
    ['#00ffff', '#6bff00'],
    ['#0000ff', '#ff9400'],
    ['#ff00ff', '#6bff00'],
  ])('shifts %s to %s', (color, shiftedColor) => {
    expect(shiftColor(color, 43)).toBe(shiftedColor);
  });

  it('expands shorthand hex colors and supports achromatic colors', () => {
    expect(shiftColor('#f00')).toBe(shiftColor('#ff0000'));
    expect(shiftColor('#888')).toBe('#888888');
  });

  it('returns non-hex colors unchanged', () => {
    expect(shiftColor('red')).toBe('red');
    expect(shiftColor('#gg0000')).toBe('#gg0000');
  });
});
