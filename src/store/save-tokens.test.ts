import { saveTokens } from './save-tokens';

describe('saveTokens', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('saves unique non-empty tokens at the root and preserves other root data', () => {
    const mosaic = { tiles: { '0,0': '#123456' }, currentColor: '#abcdef' };
    window.localStorage.setItem('kwyjibo', JSON.stringify({ setting: true, mosaic }));

    saveTokens(['alpha', '', 'beta', 'alpha']);

    expect(JSON.parse(window.localStorage.getItem('kwyjibo') ?? 'null')).toEqual({
      setting: true,
      tokens: ['alpha', 'beta'],
      mosaic,
    });
  });

  it('omits the optional root token property when it is empty', () => {
    saveTokens([]);

    expect(JSON.parse(window.localStorage.getItem('kwyjibo') ?? 'null')).toEqual({});
  });
});
