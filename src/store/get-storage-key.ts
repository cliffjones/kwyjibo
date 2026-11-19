import { STORAGE_KEY } from './constants';

export const getStorageKey = (path: string) => {
  const simplifiedPath = path.replace(/\/\/+/g, '/').replace(/^\/|\/$/g, '');
  return `${STORAGE_KEY}:${simplifiedPath}`;
};
