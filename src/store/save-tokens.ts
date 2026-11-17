import { STORAGE_KEY } from './constants';
import { loadRootData } from './load-root-data';

export const saveTokens = (tokens: string[]) => {
  if (typeof window === 'undefined') {
    return;
  }

  const rootData = loadRootData();
  const uniqueTokens = [...new Set(tokens.filter((token) => token.length > 0))];
  if (uniqueTokens.length) {
    rootData.tokens = uniqueTokens;
  } else {
    delete rootData.tokens;
  }

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(rootData));
  } catch (error) {
    console.error('Unable to save tokens.', error);
  }
};
