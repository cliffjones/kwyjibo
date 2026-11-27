import { STORAGE_KEY } from './constants';
import { loadRootData } from './load-root-data';
import type { ProgressState } from './types';

export const saveProgress = (progress: ProgressState) => {
  if (typeof window === 'undefined') {
    return;
  }

  const rootData = loadRootData();
  rootData.pointBalance = progress.pointBalance;
  rootData.activeSince = progress.activeSince;
  delete rootData.progress;

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(rootData));
  } catch (error) {
    console.error('Unable to save progress state.', error);
  }
};
