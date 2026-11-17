import { FILE_EXTENSION } from '../constants';
import { K_DELIMS } from './constants';
import { validatePathSegment } from './validate-path-segment';

export const parsePathSegment = (segment: string) => {
  const segments: string[] = [];

  // For any segments containing a colon, treat the first part as a namespace.
  let namespace = '';
  const splitSegment = segment.split(K_DELIMS.namespace, 2);
  if (splitSegment.length === 2) {
    namespace = validatePathSegment(splitSegment.shift() ?? '');
  }

  // Ensure we have a valid stem for the file name.
  if (!splitSegment.length) {
    return segments;
  }
  const stem = validatePathSegment(splitSegment[0]);
  if (!stem) {
    return segments;
  }

  // A valid namespace means we should try to import a base file too.
  if (namespace) {
    segments.push(`${namespace}.${FILE_EXTENSION}`, `${namespace}.${stem}.${FILE_EXTENSION}`);
  } else {
    segments.push(`${stem}.${FILE_EXTENSION}`);
  }

  return segments;
};
