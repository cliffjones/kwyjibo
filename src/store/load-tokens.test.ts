import { loadTokens } from './load-tokens';

describe('loadTokens', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('loads unique non-empty string tokens from root storage', () => {
    window.localStorage.setItem('kwyjibo', JSON.stringify({ tokens: ['alpha', '', 'alpha', 7, 'beta'] }));

    expect(loadTokens()).toEqual(['alpha', 'beta']);
  });

  it('returns an empty list when root storage has no tokens', () => {
    window.localStorage.setItem('kwyjibo', JSON.stringify({ setting: true }));

    expect(loadTokens()).toEqual([]);
  });
});
