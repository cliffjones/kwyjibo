import { DEFAULT_PATH, FILE_EXTENSION, LANG, PLACEHOLDER_PATTERN } from '../constants';
import { DATA_PATH, K_DELIMS } from './constants';
import { createTaskItem } from './create-task-item';
import { expandRemoteItems } from './expand-remote-items';
import { isConfigData } from './is-config-data';
import { isTaskData } from './is-task-data';
import { parseFileData } from './parse-file-data';
import type { ConfigData, TaskItem } from './types';

// Returns either a valid path segment or an empty string.
const validatePathSegment = (segment: string): string => {
  let stem: string;
  try {
    stem = decodeURIComponent(segment);
  } catch {
    return '';
  }

  // Disallow any characters with a special meaning in the system.
  if (!stem || /[.\\/]/.test(stem)) {
    return '';
  }

  return stem;
};

const parsePathSegment = (segment: string, tokens: string[]) => {
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

  // If the user has any stored tokens, check for matching private files.
  /** @todo: Step through each value of `tokens` to see if it matches a SHA-256 hash of any value of `segments` plus the secret `salt` value (pulled from a file not stored in the repo). If a match is found, prepend a `.` onto that element of `segments`. */

  return segments;
};

// Loads files corresponding to path segments, returning the combined config data and task items.
export const loadItems = async (path = '/'): Promise<[ConfigData, ...TaskItem[]]> => {
  // Each route segment should name a data file. Or if there aren't any, default to `index`.
  const pathSegments = path.split('/').filter(Boolean);
  if (!pathSegments.length) {
    pathSegments.push(DEFAULT_PATH);
  }

  // For any non-namespaced segments, look for corresponding namespaced indexes.
  let index = 0;
  while (index < pathSegments.length) {
    const segment = pathSegments[index];
    if (segment === DEFAULT_PATH || segment.includes(K_DELIMS.namespace)) {
      index++;
      continue;
    }
    pathSegments.splice(index + 1, 0, `${segment}${K_DELIMS.namespace}${DEFAULT_PATH}`);
    index += 2;
  }

  /** @todo: Get `tokens` from local storage. */
  const tokens = ['test'];

  // Return a list of unique file names to load, based on the path segments.
  const files = [...new Set(pathSegments.flatMap((segment) => parsePathSegment(segment, tokens)))];

  // Load each file, ignoring any that fail to load, and expand any remote references within them.
  const itemGroups = await Promise.all(
    files.map(async (file) => {
      const response = await fetch(`${DATA_PATH}${encodeURIComponent(file)}`);
      if (response.status === 403 || response.status === 404) {
        return [];
      }

      if (!response.ok) {
        const message = LANG.unableToLoadMessage.replace(PLACEHOLDER_PATTERN, `"${file}": ${response.status}`);
        throw new Error(message);
      }

      // Some static hosts return the app shell with status 200 when a data file is missing.
      const data = await response.text();
      if (
        response.headers.get('content-type')?.includes('text/html') ||
        /^\s*(?:<!doctype\s+html|<html\b)/i.test(data)
      ) {
        return [];
      }

      return expandRemoteItems(parseFileData(data));
    }),
  );

  // Pull the config data off the front of each data set, and flatten it into a single object.
  let configData: ConfigData = {};
  itemGroups.forEach((group) => {
    if (!isConfigData(group[0])) {
      return;
    }
    configData = { ...configData, ...group.shift() };
  });

  const items: TaskItem[] = itemGroups.flat().filter(isTaskData).map(createTaskItem);

  return [configData, ...items];
};
