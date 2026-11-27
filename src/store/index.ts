import { combineReducers, configureStore, createAction, createAsyncThunk, createReducer } from '@reduxjs/toolkit';
import { getNextId } from '../processing/get-next-id';
import { getTime } from '../processing/get-time';
import { loadItems } from '../processing/load-items';
import { parseFileData } from '../processing/parse-file-data';
import { sortItems } from '../processing/sort-items';
import type { ConfigData, TaskData, TaskItem } from '../processing/types';
import { createInitialState } from './create-initial-state';
import { getStorageKey } from './get-storage-key';
import { loadMosaic } from './load-mosaic';
import { loadPersistedState } from './load-persisted-state';
import { loadProgress } from './load-progress';
import { loadTokens } from './load-tokens';
import { persistState } from './persist-state';
import { saveMosaic } from './save-mosaic';
import { saveProgress } from './save-progress';
import type { AppState, MosaicState, ProgressState } from './types';
import { MAX_MOSAIC_COLOR_OPTIONS, MIN_MOSAIC_COLOR_OPTIONS } from '../features/mosaic/constants';

const ACTIVE_WINDOW_MS = 48 * 60 * 60 * 1000;
const isValidRating = (rating: number) => rating >= 1 && rating <= 5;

export const selectTopics = createAction<string[]>('kwyjibo/selectTopics');
export const setCustomData = createAction<string>('kwyjibo/setCustomData');
export const setLightMode = createAction<boolean>('kwyjibo/setLightMode');
export const setMosaicColor = createAction<string>('kwyjibo/setMosaicColor');
export const setMosaicTile = createAction<{ tileKey: string; colorOptions: string[] }>('kwyjibo/setMosaicTile');
export const startDeck = createAction<
  | {
      customData: string;
      resolvedCustomData?: string;
      parsedCustomData?: [ConfigData, ...TaskData[]];
    }
  | undefined
>('kwyjibo/startDeck');
export const respond = createAction<{ rating: number; response?: string }>('kwyjibo/respond');
export const reset = createAsyncThunk('kwyjibo/reset', async (path: string) => ({
  items: await loadItems(path, loadTokens()),
  path,
}));

const createMosaicReducer = (initialState: MosaicState) =>
  createReducer(initialState, (builder) => {
    builder
      .addCase(setMosaicColor, (state, action) => {
        if (state.colorOptions.includes(action.payload)) {
          state.currentColor = action.payload;
        }
      })
      .addCase(setMosaicTile, (state, action) => {
        const colorOptions = action.payload.colorOptions.slice(0, MAX_MOSAIC_COLOR_OPTIONS);
        if (colorOptions.length < MIN_MOSAIC_COLOR_OPTIONS) {
          return;
        }
        state.tiles[action.payload.tileKey] = state.currentColor;
        state.colorOptions = colorOptions;
        state.currentColor = colorOptions[0];
      });
  });

const createTilesEarnedReducer = (initialState: ProgressState['pointBalance']) =>
  createReducer(initialState, (builder) => {
    builder
      .addCase(respond, (state, action) => {
        if (isValidRating(action.payload.rating)) {
          return state + action.payload.rating / 10;
        }
        return state;
      })
      .addCase(setMosaicTile, (state) => (state >= 1 ? state - 1 : state));
  });

const createActiveSinceReducer = (initialState: ProgressState['activeSince']) =>
  createReducer(initialState, (builder) => {
    builder.addCase(respond, (state, action) => {
      const now = Date.now();
      if (isValidRating(action.payload.rating) && (state === 0 || Math.abs(now - state) > ACTIVE_WINDOW_MS)) {
        return now;
      }
      return state;
    });
  });

// Creates a reducer for the app state, handling various actions triggered by the user.
const createAppReducer = (initialState: AppState) => {
  return createReducer(initialState, (builder) => {
    builder
      .addCase(respond, (state, action) => {
        if (state.currentId == null || !isValidRating(action.payload.rating)) {
          return;
        }

        const currentId = state.currentId;
        const currentIndex = state.remainingIds.indexOf(currentId);
        const { rating, response } = action.payload;
        const currentItem = state.items.find(({ id }) => id === currentId);

        if (currentItem) {
          state.history.push({
            time: getTime(),
            type: currentItem.type,
            topic: currentItem.topic,
            task: currentItem.task,
            ...(response === undefined ? {} : { response }),
            rating,
          });
        }

        if (currentIndex !== -1) {
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
        state.ratingCount++;

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
          state.remainingIds = state.items.filter(({ id }) => state.remainingIds.includes(id)).map(({ id }) => id);
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
        const resolvedCustomDataForStart =
          action.payload?.resolvedCustomData ?? (state.resolvedCustomData || customDataForStart);
        const parsedCustomData =
          action.payload?.parsedCustomData ?? parseFileData(resolvedCustomDataForStart || customDataForStart);
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
          parsedCustomData,
          state.history,
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
          state.resolvedCustomData,
          undefined,
          state.history,
        );

        // Keep the user's topic choices when rebuilding the loaded cards.
        nextState.selectedTopics = state.selectedTopics;
        return nextState;
      });
  });
};

// Creates a Redux store for the app, optionally using a set of loaded items and custom data.
export const createAppStore = (
  sourcePath = '/',
  configData: ConfigData = {},
  items: TaskItem[] = [],
  tokens = loadTokens(),
) => {
  const savedState = loadPersistedState(sourcePath);
  const restoredState: AppState | null =
    savedState && getStorageKey(savedState.sourcePath) === getStorageKey(sourcePath)
      ? { ...savedState, sourcePath }
      : null;
  const initialState = restoredState ?? createInitialState(sourcePath, configData, items);
  const initialMosaic = loadMosaic();
  const initialProgress = loadProgress();
  const combinedReducer = combineReducers({
    kwyjibo: createAppReducer(initialState),
    tokens: (state: string[] = tokens) => state,
    mosaic: createMosaicReducer(initialMosaic),
    pointBalance: createTilesEarnedReducer(initialProgress.pointBalance),
    activeSince: createActiveSinceReducer(initialProgress.activeSince),
  });

  const store = configureStore({
    reducer: (state: ReturnType<typeof combinedReducer> | undefined, action: Parameters<typeof combinedReducer>[1]) => {
      if (state && setMosaicTile.match(action) && state.pointBalance < 1) {
        return state;
      }
      const nextState = combinedReducer(state, action);
      if (
        respond.match(action) &&
        state != null &&
        (state.kwyjibo.currentId == null || !isValidRating(action.payload.rating))
      ) {
        return {
          ...nextState,
          pointBalance: state.pointBalance,
          activeSince: state.activeSince,
        };
      }
      return nextState;
    },
  });

  // Unless the user has a session in progress, reset to avoid stale data.
  if (restoredState && restoredState.currentId == null) {
    void store.dispatch(reset(sourcePath));
  }

  persistState(store.getState().kwyjibo);
  saveMosaic(store.getState().mosaic);
  saveProgress({
    pointBalance: store.getState().pointBalance,
    activeSince: store.getState().activeSince,
  });
  let previousMosaic = store.getState().mosaic;
  let previousTilesEarned = store.getState().pointBalance;
  let previousActiveSince = store.getState().activeSince;
  store.subscribe(() => {
    persistState(store.getState().kwyjibo);
    const { pointBalance, activeSince } = store.getState();
    if (pointBalance !== previousTilesEarned || activeSince !== previousActiveSince) {
      previousTilesEarned = pointBalance;
      previousActiveSince = activeSince;
      saveProgress({ pointBalance, activeSince });
    }
    const mosaic = store.getState().mosaic;
    if (mosaic !== previousMosaic) {
      previousMosaic = mosaic;
      saveMosaic(mosaic);
    }
  });
  return store;
};

type AppStore = ReturnType<typeof createAppStore>;
export type { AppStore };
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
