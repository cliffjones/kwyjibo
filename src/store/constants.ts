export const STORAGE_KEY = 'kwyjibo';
export const BASE_URL = document.querySelector('base')?.getAttribute('href') ?? '/';
export const DATA_PATH = `${BASE_URL}data/`;

export const getStorageKey = (sourcePath: string) =>
  `${STORAGE_KEY}:${encodeURIComponent(sourcePath)}`;
