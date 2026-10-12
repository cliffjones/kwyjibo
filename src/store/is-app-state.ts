import { isQuizItem } from './is-quiz-item';
import type { AppState } from './types';

export const isAppState = (value: unknown): value is AppState => {
  if (value == null || typeof value !== 'object') {
    return false;
  }
  const state = value as Record<string, unknown>;

  if (typeof state.sourcePath !== 'string') {
    return false;
  }

  if (!Array.isArray(state.items) || !state.items.every(isQuizItem)) {
    return false;
  }

  if (typeof state.customData !== 'string') {
    return false;
  }

  if (typeof state.initializing !== 'boolean') {
    return false;
  }

  if (typeof state.darkMode !== 'boolean') {
    return false;
  }

  if (!Array.isArray(state.selectedTopics) || !state.selectedTopics.every(topic => typeof topic === 'string')) {
    return false;
  }

  if (!Array.isArray(state.remainingIds) || !state.remainingIds.every(id => typeof id === 'number' && Number.isInteger(id))) {
    return false;
  }

  if (state.currentId !== null && typeof state.currentId !== 'number') {
    return false;
  }

  // Ensure that `remainingIds` is a subset of the item IDs and that `currentId` makes sense.
  const itemIds = new Set(state.items.map(item => item.id));
  const remainingIds = new Set(state.remainingIds);
  return itemIds.size === state.items.length
    && remainingIds.size === state.remainingIds.length
    && state.remainingIds.every(id => itemIds.has(id))
    && (state.remainingIds.length ? remainingIds.has(state.currentId) : state.currentId == null);
};
