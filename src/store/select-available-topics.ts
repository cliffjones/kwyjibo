import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '.';

// Selects a unique set of item topics (falling back to the task text when needed).
export const selectAvailableTopics = createSelector([(state: RootState) => state.kwyjibo.items], (items) =>
  [...new Set(items.map(({ topic, task }) => topic || task))].sort((a, b) => a.localeCompare(b)),
);
