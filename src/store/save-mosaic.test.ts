import { saveMosaic } from './save-mosaic';

describe('saveMosaic', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('saves mosaic data globally while preserving other root data', () => {
    window.localStorage.setItem('kwyjibo', JSON.stringify({ tokens: ['alpha'] }));
    const mosaic = { tiles: { '0,0': '#123456' }, currentColor: '#abcdef', colorOptions: ['#abcdef'] };

    saveMosaic(mosaic);

    expect(JSON.parse(window.localStorage.getItem('kwyjibo') ?? 'null')).toEqual({
      tokens: ['alpha'],
      mosaic,
    });
  });
});
