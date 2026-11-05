import { isValidUrl } from './is-valid-url';
import { loadRemoteData } from './load-remote-data';
import { parseFileData } from './parse-file-data';
import type { ConfigData, TaskData } from './types';

// Parses a user-supplied data string into a configuration object and an array of task objects.
export const parseCustomData = async (text: string): Promise<[ConfigData, ...TaskData[]]> => {
  const blocks = text
    .split(/\r?\n\r?\n/)
    .map(block => block.trim())
    .filter(Boolean);

  const configData: ConfigData = {};
  const items: TaskData[] = [];
  const pendingBlocks: string[] = [];

  const flushPendingBlocks = () => {
    if (!pendingBlocks.length) {
      return;
    }

    const [pendingConfig, ...pendingItems] = parseFileData(pendingBlocks.join('\n\n'));
    Object.assign(configData, pendingConfig);
    items.push(...pendingItems);
    pendingBlocks.length = 0;
  };

  for (const block of blocks) {
    const lines = block.split(/\r?\n/).map(line => line.trim()).filter(Boolean);
    if (lines.length === 1 && isValidUrl(lines[0])) {
      flushPendingBlocks();
      const remoteData = await loadRemoteData(lines[0]);
      if (remoteData == null) {
        continue;
      }

      const [remoteConfig, ...remoteItems] = remoteData;
      Object.assign(configData, remoteConfig);
      items.push(...remoteItems);
      continue;
    }

    pendingBlocks.push(block);
  }

  flushPendingBlocks();

  return [configData, ...items];
};
