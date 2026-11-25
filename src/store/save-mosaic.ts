import { STORAGE_KEY } from './constants';
import { loadRootData } from './load-root-data';
import type { MosaicState } from './types';

export const saveMosaic = (mosaic: MosaicState) => {
  if (typeof window === 'undefined') {
    return;
  }

  const rootData = loadRootData();
  rootData.mosaic = mosaic;

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(rootData));
  } catch (error) {
    console.error('Unable to save mosaic state.', error);
  }
};
