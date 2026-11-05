import { isValidUrl } from './is-valid-url';
import { loadRemoteData } from './load-remote-data';
import type { ConfigData, TaskData } from './types';

// Expands any remote data references within a group of task items, merging their config data into a single object.
export const expandRemoteItems = async (group: [ConfigData, ...TaskData[]]): Promise<[ConfigData, ...TaskData[]]> => {
  const [groupConfig, ...items] = group;
  const expandedItems: TaskData[] = [];
  let configData = groupConfig;

  for (const item of items) {
    if (item.task && item.solution === '' && isValidUrl(item.task)) {
      const remoteData = await loadRemoteData(item.task);
      if (remoteData == null) {
        continue;
      }

      const [remoteConfig, ...remoteItems] = remoteData;
      configData = { ...configData, ...remoteConfig };
      expandedItems.push(...remoteItems);
      continue;
    }

    expandedItems.push(item);
  }

  return [configData, ...expandedItems];
};
