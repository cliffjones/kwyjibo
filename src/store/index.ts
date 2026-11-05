import { configureStore, createAction, createAsyncThunk, createReducer } from '@reduxjs/toolkit';
import { getNextId } from '../processing/get-next-id';
import { getTime } from '../processing/get-time';
import { loadItems } from '../processing/load-items';
import { parseFileData } from '../processing/parse-file-data';
import { sortItems } from '../processing/sort-items';
import type { ConfigData, TaskData, TaskItem } from '../processing/types';
import { createInitialState } from './create-initial-state';
import { loadPersistedState } from './load-persisted-state';
import { persistState } from './persist-state';
import type { AppState } from './types';

export const selectTopics = createAction<string[]>('kwyjibo/selectTopics');
export const setCustomData = createAction<string>('kwyjibo/setCustomData');
export const setLightMode = createAction<boolean>('kwyjibo/setLightMode');
export const startDeck = createAction<{
  customData: string;
  resolvedCustomData?: string;
  parsedCustomData?: [ConfigData, ...TaskData[]];
} | undefined>('kwyjibo/startDeck');
export const rateItem = createAction<number>('kwyjibo/rateItem');
export const reset = createAsyncThunk(
  'kwyjibo/reset',
  async (path: string) => ({ items: await loadItems(path), path })
);

// Creates a reducer for the app state, handling various actions triggered by the user.
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

        state.ratingTotal += rating - 1;
        state.ratingCount += 1;

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

      .addCase(startDeck, (state, action) => {
        const selectedItems = state.items.filter(({ topic, task }) => state.selectedTopics.includes(topic || task));
        const customDataForStart = action.payload?.customData ?? state.customData;
        const resolvedCustomDataForStart = action.payload?.resolvedCustomData ?? (state.resolvedCustomData || customDataForStart);
        const parsedCustomData = action.payload?.parsedCustomData ?? parseFileData(resolvedCustomDataForStart || customDataForStart);
        const nextState = createInitialState(
          state.sourcePath,
          state.configData,
          selectedItems,
          customDataForStart,
          state.lightMode,
          false,
          getTime(),
          0,
          0,
          resolvedCustomDataForStart,
          parsedCustomData
        );

        return nextState;
      })

      .addCase(reset.fulfilled, (state, action) => {
        const [configData, ...items] = action.payload.items;
        const nextState = createInitialState(
          action.payload.path,
          configData,
          items,
          state.customData,
          state.lightMode,
          true,
          0,
          0,
          0,
          state.resolvedCustomData
        );

        // Keep the user's topic choices when rebuilding the loaded cards.
        nextState.selectedTopics = state.selectedTopics;
        return nextState;
      });
  });
};

// Creates a Redux store for the app, optionally using a set of loaded items and custom data.
export const createAppStore = (sourcePath = '/', configData: ConfigData = {}, items: TaskItem[] = []) => {
  const savedState = loadPersistedState(sourcePath);
  const restoredState = savedState?.sourcePath === sourcePath
    ? { ...savedState, sourcePath }
    : null;
  const initialState = restoredState ?? createInitialState(sourcePath, configData, items);

  const store = configureStore({
    reducer: { kwyjibo: createAppReducer(initialState) }
  });

  // Unless the user has a session in progress, reset to avoid stale data.
  if (restoredState && restoredState.currentId == null) {
    void store.dispatch(reset(sourcePath));
  }

  persistState(store.getState().kwyjibo);
  store.subscribe(() => persistState(store.getState().kwyjibo));
  return store;
};

type AppStore = ReturnType<typeof createAppStore>;
export type { AppStore };
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
