import { getRandomColor } from '../features/mosaic/get-random-color';
import { isMosaicState } from './is-mosaic-state';
import { loadRootData } from './load-root-data';
import type { MosaicState } from './types';

// Load mosaic state from root data.
export const loadMosaic = (): MosaicState => {
  const mosaic = loadRootData().mosaic;
  if (isMosaicState(mosaic)) {
    return mosaic;
  }
  const colorOptions = Array.from({ length: 4 }, getRandomColor);
  return { tiles: {}, currentColor: colorOptions[0], colorOptions };
};
