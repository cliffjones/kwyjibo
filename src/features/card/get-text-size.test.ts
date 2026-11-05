import { getTextSize } from './get-text-size';

describe('getTextSize', () => {
  it('uses the maximum size for short content', () => {
    expect(getTextSize('abc')).toBe('2.5rem');
  });

  it('uses the minimum size for very long content', () => {
    expect(getTextSize('a'.repeat(1000))).toBe('1rem');
  });
});
