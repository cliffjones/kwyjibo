import { STORAGE_KEY } from './constants';

export const getStorageKey = (sourcePath: string) =>
  `${STORAGE_KEY}:${encodeURIComponent(sourcePath)}`;
