import { decodeMosaic } from './decode-mosaic';

describe('decodeMosaic', () => {
  it('reconstitutes tile keys and colors', () => {
    expect(decodeMosaic('0012345621abcdef')).toEqual({
      '0,0': '#123456',
      '2,1': '#abcdef',
    });
  });

  it('ignores malformed codes', () => {
    expect(decodeMosaic('0012')).toBeNull();
  });
});
