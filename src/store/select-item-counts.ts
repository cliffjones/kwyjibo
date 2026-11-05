import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '.';

// Selects a set of item counts keyed by each unique topic.
export const selectItemCounts = createSelector([(state: RootState) => state.kwyjibo.items], (items) =>
  items.reduce<Record<string, number>>((counts, { topic, task }) => {
    counts[topic || task] = (counts[topic || task] ?? 0) + 1;
    return counts;
  }, {}),
);
