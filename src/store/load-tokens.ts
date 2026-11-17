import { loadRootData } from './load-root-data';

export const loadTokens = (): string[] => {
  const tokens = loadRootData().tokens;
  return Array.isArray(tokens)
    ? [...new Set(tokens.filter((token): token is string => typeof token === 'string' && token.length > 0))]
    : [];
};
