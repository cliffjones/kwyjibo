import { isPlainObject } from '../processing/is-plain-object';
import { parseJson } from '../processing/parse-json';
import { STORAGE_KEY } from './constants';

export const loadRootData = (): Record<string, unknown> => {
  if (typeof window === 'undefined') {
    return {};
  }

  const parsedData = parseJson(window.localStorage.getItem(STORAGE_KEY) ?? '');
  return isPlainObject(parsedData) ? parsedData : {};
};
