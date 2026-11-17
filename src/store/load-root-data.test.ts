import { loadRootData } from './load-root-data';

describe('loadRootData', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('returns an empty object when root data is missing', () => {
    expect(loadRootData()).toEqual({});
  });

  it('loads a plain object from root storage', () => {
    const rootData = { setting: true, tokens: ['alpha'] };
    window.localStorage.setItem('kwyjibo', JSON.stringify(rootData));

    expect(loadRootData()).toEqual(rootData);
  });

  it('returns an empty object for non-object root data', () => {
    window.localStorage.setItem('kwyjibo', JSON.stringify(['alpha']));

    expect(loadRootData()).toEqual({});
  });
});
