import { getStorageKey } from './constants';
import { AppState } from './types';

export const persistState = (state: AppState) => {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    window.localStorage.setItem(getStorageKey(state.sourcePath), JSON.stringify(state));
  } catch (error) {
    console.error('Unable to save quiz state.', error);
  }
};
