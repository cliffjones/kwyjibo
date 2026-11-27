import { encodeMosaic } from './encode-mosaic';

describe('encodeMosaic', () => {
  it('encodes tiles in coordinate order using URL-safe characters', () => {
    const code = encodeMosaic({
      '2,1': '#ABCDEF',
      '0,0': '#123456',
    });

    expect(code).toBe('0012345621abcdef');
    expect(code).toMatch(/^[0-9a-z]+$/);
  });
});
