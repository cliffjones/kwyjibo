import { CONFIG_KEYS } from './constants';
import { ConfigData } from './types';

export const isConfigData = (value: unknown): value is ConfigData => {
  if (value == null || typeof value !== 'object') {
    return false;
  }

  for (const key of Object.keys(value)) {
    if (!CONFIG_KEYS.includes(key)) {
      return false;
    }
  }

  return true;
};
