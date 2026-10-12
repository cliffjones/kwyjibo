import { getStorageKey } from './constants';
import { isAppState } from './is-app-state';
import { AppState } from './types';

export const loadPersistedState = (sourcePath: string): AppState | null => {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const serializedState = window.localStorage.getItem(getStorageKey(sourcePath));
    if (serializedState == null) {
      return null;
    }

    const state: unknown = JSON.parse(serializedState);
    if (isAppState(state)) {
      return state;
    }

    console.error('Unable to restore saved quiz state: invalid data.');
  } catch (error) {
    console.error('Unable to restore saved quiz state.', error);
  }

  return null;
};
