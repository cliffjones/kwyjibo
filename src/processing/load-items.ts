import { DEFAULT_PATH, FILE_EXTENSION, LANG, PLACEHOLDER_PATTERN } from '../constants';
import { DATA_PATH, K_DELIMS } from './constants';
import { createTaskItem } from './create-task-item';
import { expandRemoteItems } from './expand-remote-items';
import { isConfigData } from './is-config-data';
import { isTaskData } from './is-task-data';
import { parseFileData } from './parse-file-data';
import { parsePathSegment } from './parse-path-segment';
import type { ConfigData, TaskItem } from './types';

// Loads files corresponding to path segments, returning the combined config data and task items.
export const loadItems = async (path = '/', tokens: string[] = []): Promise<[ConfigData, ...TaskItem[]]> => {
  // Each route segment should name a data file.
  const pathSegments = path.split('/').filter(Boolean);

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

  // Return a list of unique file names to load, based on the path segments.
  const files = [...new Set(pathSegments.flatMap((segment) => parsePathSegment(segment, tokens)))];

  // If there aren't any valid path segments, default to `index.k`.
  if (!files.length) {
    files.push(`${DEFAULT_PATH}.${FILE_EXTENSION}`);
  }

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
