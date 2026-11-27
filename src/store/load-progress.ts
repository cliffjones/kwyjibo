import { isPlainObject } from '../processing/is-plain-object';
import { loadRootData } from './load-root-data';
import type { ProgressState } from './types';

const toNumber = (value: unknown) => (typeof value === 'number' && Number.isFinite(value) ? value : 0);

// Load tile progress from root data, defaulting missing or invalid fields to 0.
export const loadProgress = (): ProgressState => {
  const rootData = loadRootData();
  const legacyProgress = isPlainObject(rootData.progress) ? (rootData.progress as Record<string, unknown>) : {};
  return {
    pointBalance: toNumber(rootData.pointBalance ?? legacyProgress.pointBalance),
    activeSince: toNumber(rootData.activeSince ?? legacyProgress.activeSince),
  };
};
