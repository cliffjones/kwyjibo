import { DATA_PATH } from './constants';
import { createTaskItem } from './create-task-item';
import { isConfigData } from './is-config-data';
import { isTaskData } from './is-task-data';
import { parseKData } from './parse-k-data';
import type { ConfigData, TaskItem } from './types';

export const loadItems = async (path = '/'): Promise<[ConfigData, ...TaskItem[]]> => {
  // Each route segment may name a data file. Ignore malformed segments, and try the rest.
  const pathSegments = path.split('/').filter(Boolean);
  if (!pathSegments.length) {
    pathSegments.push('index');
  }
  const files = [...new Set(pathSegments.flatMap(segment => {
    let stem: string;
    try {
      stem = decodeURIComponent(segment);
    } catch {
      return [];
    }

    if (!stem || stem === '.' || stem === '..' || /[\\/]/.test(stem)) {
      return [];
    }

    return [`${stem}.k`];
  }))];

  const itemGroups = await Promise.all(
    files.map(async file => {
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
        response.headers.get('content-type')?.includes('text/html')
        || /^\s*(?:<!doctype\s+html|<html\b)/i.test(data)
      ) {
        return [];
      }

      return parseKData(data);
    })
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
