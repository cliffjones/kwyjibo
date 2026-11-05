import { hasRemoteBlock } from './has-remote-block';

describe('hasRemoteBlock', () => {
  it('returns true when a block contains only a valid https URL', () => {
    expect(hasRemoteBlock('https://example.com/cards.k')).toBe(true);
  });

  it('returns false when the URL is part of a larger block', () => {
    expect(hasRemoteBlock('# Topic\n\nhttps://example.com/cards.k\nQuestion?')).toBe(false);
    expect(hasRemoteBlock('Question?\nhttps://example.com/cards.k')).toBe(false);
  });
});
