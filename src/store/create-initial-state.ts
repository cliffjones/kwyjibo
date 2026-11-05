import { createTaskItem } from '../processing/create-task-item';
import { getTime } from '../processing/get-time';
import { parseFileData } from '../processing/parse-file-data';
import { sortItems } from '../processing/sort-items';
import type { ConfigData, TaskData, TaskItem } from '../processing/types';
import type { AppState } from './types';

// Creates the initial app state, optionally using a set of loaded items and custom data.
export const createInitialState = (
  sourcePath = '/',
  configData: ConfigData = {},
  loadedItems: TaskItem[] = [],
  customData = '',
  lightMode = false,
  initializing = true,
  startTime = getTime(),
  ratingTotal = 0,
  ratingCount = 0,
  resolvedCustomData?: string,
  parsedCustomData?: [ConfigData, ...TaskData[]]
): AppState => {
  const items: TaskItem[] = sortItems(loadedItems).map((item, index) => ({ ...item, id: index }));
  let customConfigData: ConfigData = {};

  if (!initializing) {
    const customDataText = resolvedCustomData || customData;
    const [customConfig, ...customItems] = parsedCustomData ?? parseFileData(customDataText);
    customConfigData = customConfig;

    // Assign custom card IDs after the loaded cards so both sets can share a single state.
    items.push(...customItems.map((item, index) => createTaskItem(item, items.length + index)));
    const sortedItems = sortItems(items);
    sortedItems.forEach((item, index) => {
      item.id = index;
    });
    items.length = 0;
    items.push(...sortedItems);
  }

  const ids = items.map(({ id }) => id);

  return {
    configData: { ...configData, ...customConfigData },
    items,
    customData,
    resolvedCustomData,
    lightMode,
    initializing,
    startTime,
    ratingTotal,
    ratingCount,
    sourcePath,
    selectedTopics: [...new Set(items.map(({ topic, task }) => topic || task))],
    remainingIds: ids,
    currentId: ids.length ? ids[0] : null,
  };
};
