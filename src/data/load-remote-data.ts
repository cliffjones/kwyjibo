import { loadRemoteText } from './load-remote-text';
import { parseKData } from './parse-k-data';
import { ConfigData, TaskData } from './types';

// Loads a K-format data file from a remote URL, returning the parsed config and task data.
export const loadRemoteData = async (url: string): Promise<[ConfigData, ...TaskData[]] | null> => {
  const rawData = await loadRemoteText(url);
  if (rawData == null) {
    return null;
  }

  return parseKData(rawData);
};
