import { getRandomColor } from '../features/mosaic/get-random-color';
import { loadMosaic } from './load-mosaic';

describe('loadMosaic', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('loads mosaic data from global root storage', () => {
    const mosaic = { tiles: { '0,0': '#123456' }, currentColor: '#abcdef' };
    window.localStorage.setItem('kwyjibo', JSON.stringify({ mosaic }));

    expect(loadMosaic()).toEqual(mosaic);
  });

  it('creates an empty mosaic with a random current color when no data exists', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5);

    expect(loadMosaic()).toEqual({ tiles: {}, currentColor: getRandomColor() });
  });
});
