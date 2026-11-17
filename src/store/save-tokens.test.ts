import { saveTokens } from './save-tokens';

describe('saveTokens', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('saves unique non-empty tokens at the root and preserves other root data', () => {
    window.localStorage.setItem('kwyjibo', JSON.stringify({ setting: true }));

    saveTokens(['alpha', '', 'beta', 'alpha']);

    expect(JSON.parse(window.localStorage.getItem('kwyjibo') ?? 'null')).toEqual({
      setting: true,
      tokens: ['alpha', 'beta'],
    });
  });

  it('omits the optional root token property when it is empty', () => {
    saveTokens([]);

    expect(JSON.parse(window.localStorage.getItem('kwyjibo') ?? 'null')).toEqual({});
  });
});
