import { LINE_CONFIG_KEYS } from './constants';
import { isPlainObject } from './is-plain-object';
import type { LineConfigData } from './types';

export const isLineConfigData = (value: unknown): value is LineConfigData => {
  if (!isPlainObject(value)) {
    return false;
  }

  for (const key of Object.keys(value)) {
    if (!LINE_CONFIG_KEYS.includes(key)) {
      return false;
    }
  }

  return true;
};
