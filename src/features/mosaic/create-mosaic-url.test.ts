import { createMosaicUrl } from './create-mosaic-url';

describe('createMosaicUrl', () => {
  it('replaces mosaic segments while preserving query and hash values', () => {
    expect(
      createMosaicUrl({ '0,0': '#123456' }, 'https://example.com/k/science/m:old/dev/m?mode=quick#cards'),
    ).toBe('https://example.com/k/science/dev/m:00123456?mode=quick#cards');
  });
});
