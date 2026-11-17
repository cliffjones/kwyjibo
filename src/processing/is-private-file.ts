import { isPlainObject } from './is-plain-object';
import { PrivateFile } from './types';

export const isPrivateFile = (value: unknown): value is PrivateFile => {
  if (!isPlainObject(value)) {
    return false;
  }

  return (
    'segment' in value &&
    typeof value.segment === 'string' &&
    'name' in value &&
    typeof value.name === 'string' &&
    'content' in value &&
    typeof value.content === 'string'
  );
};
