import { configureStore, createAction, createAsyncThunk, createReducer } from '@reduxjs/toolkit';
import { createTaskItem } from '../data/create-task-item';
import { getNextId } from '../data/get-next-id';
import { loadItems } from '../data/load-items';
import { parseKData } from '../data/parse-k-data';
import { sortItems } from '../data/sort-items';
import type { ConfigData, TaskItem } from '../data/types';
import { loadPersistedState } from './load-persisted-state';
import { persistState } from './persist-state';
import type { AppState } from './types';

export const selectTopics = createAction<string[]>('kwyjibo/selectTopics');
export const setCustomData = createAction<string>('kwyjibo/setCustomData');
export const setLightMode = createAction<boolean>('kwyjibo/setLightMode');
export const startQuiz = createAction('kwyjibo/startQuiz');
export const rateItem = createAction<number>('kwyjibo/rateItem');
export const reset = createAsyncThunk(
  'kwyjibo/reset',
  async (path: string) => ({ items: await loadItems(path), path })
);

const createInitialState = (
  sourcePath = '/',
  configData: ConfigData = {},
  loadedItems: TaskItem[] = [],
  customData = '',
  initializing = true,
  lightMode = false
): AppState => {
  const items: TaskItem[] = sortItems(loadedItems).map((item, index) => ({ ...item, id: index }));
  let customConfigData: ConfigData = {};

  if (!initializing) {
    const [data, ...customItems] = parseKData(customData);
    customConfigData = data;

    // Assign custom card IDs after the loaded cards so both sets can share a single state.
    items.push(...customItems.map((item, index) => createTaskItem(item, items.length + index)));
  }

  const ids = items.map(({ id }) => id);

  return {
    configData: { ...configData, ...customConfigData },
    items,
    customData,
    initializing,
    lightMode,
    sourcePath,
    selectedTopics: [...new Set(items.map(({ topic, task }) => topic || task))],
    remainingIds: ids,
    currentId: ids.length ? ids[0] : null,
  };
};

const createAppReducer = (initialState: AppState) => {
  return createReducer(initialState, builder => {
    builder
      .addCase(rateItem, (state, action) => {
        if (state.currentId == null) {
          return;
        }

        const currentId = state.currentId;
        const currentIndex = state.remainingIds.indexOf(currentId);
        const rating = action.payload;

        if (currentIndex !== -1) {
          const currentItem = state.items.find(({ id }) => id === currentId);
          if (currentItem) {
            if (rating > 4) {
              // Remove the current task from rotation if the user reports mastery.
              currentItem.rating = 0;
            } else {
              currentItem.rating = rating;
            }
          }
        }

        const itemIsMastered = rating > 4 && currentIndex !== -1;
        const itemIsLast = currentIndex === state.remainingIds.length - 1;

        if (itemIsMastered) {
          state.remainingIds.splice(currentIndex, 1);
        }

        if (state.remainingIds.length === 0) {
          state.currentId = null;
          return;
        }

        let nextId: number | null = null;

        if (itemIsMastered && !itemIsLast) {
          // Once the current item is removed, continue with the next item, which now has that same index.
          nextId = state.remainingIds[currentIndex] ?? state.remainingIds[0];
        } else {
          nextId = getNextId(state.remainingIds, currentId);
        }

        // If we hit the end of the list, re-sort and start with first or second item.
        if (itemIsLast || nextId == null) {
          state.items = sortItems(state.items);
          state.remainingIds = state.items
            .filter(({ id }) => state.remainingIds.includes(id))
            .map(({ id }) => id);
          nextId = state.remainingIds[0];
          if (nextId === currentId && state.remainingIds.length > 1) {
            nextId = state.remainingIds[1];
          }
        }

        state.currentId = nextId;
      })

      .addCase(selectTopics, (state, action) => {
        state.selectedTopics = action.payload;
      })

      .addCase(setCustomData, (state, action) => {
        state.customData = action.payload;
      })

      .addCase(setLightMode, (state, action) => {
        state.lightMode = action.payload;
      })

      .addCase(startQuiz, state => {
        const selectedItems = state.items.filter(({ topic, task }) => state.selectedTopics.includes(topic || task));
        return createInitialState(state.sourcePath, state.configData, selectedItems, state.customData, false, state.lightMode);
      })

      .addCase(reset.fulfilled, (state, action) => {
        const [configData, ...items] = action.payload.items;
        const nextState = createInitialState(
          action.payload.path,
          configData,
          items,
          state.customData,
          true,
          state.lightMode
        );

        // Keep the user's topic choices when rebuilding the loaded cards.
        nextState.selectedTopics = state.selectedTopics;
        return nextState;
      });
  });
};

export const createAppStore = (sourcePath = '/', configData: ConfigData = {}, items: TaskItem[] = []) => {
  const savedState = loadPersistedState(sourcePath);
  const restoredState = savedState?.sourcePath === sourcePath
    ? { ...savedState, sourcePath }
    : null;
  const initialState = restoredState ?? createInitialState(sourcePath, configData, items);

  const store = configureStore({
    reducer: { kwyjibo: createAppReducer(initialState) }
  });

  persistState(store.getState().kwyjibo);
  store.subscribe(() => persistState(store.getState().kwyjibo));
  return store;
};

type AppStore = ReturnType<typeof createAppStore>;
export type { AppStore };
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
