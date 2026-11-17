import { isPlainObject } from './is-plain-object';
import { isPrivateFile } from './is-private-file';
import { PrivateFilesResponse } from './types';

export const isPrivateFilesResponse = (value: unknown): value is PrivateFilesResponse => {
  if (!isPlainObject(value)) {
    return false;
  }

  return (
    'segments' in value &&
    Array.isArray(value.segments) &&
    value.segments.every((segment) => typeof segment === 'string') &&
    'files' in value &&
    Array.isArray(value.files) &&
    value.files.every(isPrivateFile)
  );
};
