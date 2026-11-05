import { CONFIG_KEYS } from './constants';
import { isPlainObject } from './is-plain-object';
import type { ConfigData } from './types';

export const isConfigData = (value: unknown): value is ConfigData => {
  if (!isPlainObject(value)) {
    return false;
  }

  for (const key of Object.keys(value)) {
    if (!CONFIG_KEYS.includes(key)) {
      return false;
    }
  }

  return true;
};
