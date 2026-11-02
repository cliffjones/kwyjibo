import { isPlainObject } from './is-plain-object';
import type { ResponseData } from './types';

export const isResponseData = (value: unknown): value is ResponseData => {
  if (!isPlainObject(value)) {
    return false;
  }

  if (!value.text || typeof value.text !== 'string') {
    return false;
  }

  if (typeof value.value !== 'number') {
    return false;
  }

  if (typeof value.order !== 'number') {
    return false;
  }

  return true;
};
