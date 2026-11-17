import { isPlainObject } from '../processing/is-plain-object';
import { parseJson } from '../processing/parse-json';
import { getStorageKey } from './get-storage-key';
import { isAppState } from './is-app-state';
import { AppState } from './types';

// Loads the persisted app state from local storage, if available and valid.
export const loadPersistedState = (sourcePath: string): AppState | null => {
  if (typeof window === 'undefined') {
    return null;
  }

  const serializedState = window.localStorage.getItem(getStorageKey(sourcePath));
  if (serializedState == null) {
    return null;
  }

  const parsedState = parseJson(serializedState);
  if (!isPlainObject(parsedState)) {
    return null;
  }

  // Fill in a missing `history` for backward-compatibility.
  const state = 'history' in parsedState ? parsedState : { ...parsedState, history: [] };
  if (isAppState(state)) {
    return state;
  }

  return null;
};
