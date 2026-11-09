import { DATA_PATH } from './constants';
import { createTaskItem } from './create-task-item';
import { expandRemoteItems } from './expand-remote-items';
import { isConfigData } from './is-config-data';
import { isTaskData } from './is-task-data';
import { parseFileData } from './parse-file-data';
import type { ConfigData, TaskItem } from './types';

const validatePathSegment = (segment: string): string => {
  let stem: string;
  try {
    stem = decodeURIComponent(segment);
  } catch {
    return '';
  }

  if (!stem || stem === '.' || stem === '..' || /[\\/]/.test(stem)) {
    return '';
  }

  return stem;
};

// Loads files corresponding to path segments, returning the combined config data and task items.
export const loadItems = async (path = '/'): Promise<[ConfigData, ...TaskItem[]]> => {
  // Each route segment should name a data file. Or if there aren't any, default to `index`.
  const pathSegments = path.split('/').filter(Boolean);
  if (!pathSegments.length) {
    pathSegments.push('index');
  }

  // Return a list of unique file names to load, based on the path segments.
  const files = [
    ...new Set(
      pathSegments.flatMap((segment) => {
        // For any segments containing a colon, treat the first part as a namespace.
        let namespace = '';
        const splitSegment = segment.split(':', 2);
        if (splitSegment.length === 2) {
          namespace = validatePathSegment(splitSegment.shift() ?? '');
        }

        // Ensure we have a valid stem for the file name.
        if (!splitSegment.length) {
          return [];
        }
        const stem = validatePathSegment(splitSegment[0]);
        if (!stem) {
          return [];
        }

        // A valid namespace means we should try to import a base file too.
        if (namespace) {
          return [`${namespace}.k`, `${namespace}_${stem}.k`];
        }
        return [`${stem}.k`];
      }),
    ),
  ];

  // Load each file, ignoring any that fail to load, and expand any remote references within them.
  const itemGroups = await Promise.all(
    files.map(async (file) => {
      const response = await fetch(`${DATA_PATH}${encodeURIComponent(file)}`);
      if (response.status === 403 || response.status === 404) {
        return [];
      }

      if (!response.ok) {
        throw new Error(`Unable to load ${file}: ${response.status}`);
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
