import { isSafeUrl } from './is-safe-url';

describe('isSafeUrl', () => {
  it('allows safe HTTP, HTTPS, and mailto URLs', () => {
    expect(isSafeUrl('https://example.com')).toBe(true);
    expect(isSafeUrl('http://example.com/path?q=1')).toBe(true);
    expect(isSafeUrl('mailto:test@example.com', true)).toBe(true);
    expect(isSafeUrl('/docs/intro')).toBe(true);
  });

  it('rejects unsafe protocols and control characters', () => {
    expect(isSafeUrl('javascript:alert(1)')).toBe(false);
    expect(isSafeUrl('data:text/plain,hello')).toBe(false);
    expect(isSafeUrl('https://example.com\n')).toBe(false);
    expect(isSafeUrl('https://example.com\u0007')).toBe(false);
  });
});
