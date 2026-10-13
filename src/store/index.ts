import { configureStore, createAction, createAsyncThunk, createReducer } from '@reduxjs/toolkit';
import { getRandomId } from './get-random-id';
import { loadItems } from './load-items';
import { loadPersistedState } from './load-persisted-state';
import { parseQuizData } from './parse-quiz-data';
import { persistState } from './persist-state';
import type { AppState, QuizItem } from './types';

export const selectTopics = createAction<string[]>('kwyjibo/selectTopics');
export const setCustomData = createAction<string>('kwyjibo/setCustomData');
export const setLightMode = createAction<boolean>('kwyjibo/setLightMode');
export const startQuiz = createAction('kwyjibo/startQuiz');
export const rateConfidence = createAction<number>('kwyjibo/rateConfidence');
export const reset = createAsyncThunk(
  'kwyjibo/reset',
  async (path: string) => ({ items: await loadItems(path), path })
);

const createInitialState = (
  sourcePath = '/',
  loadedItems: QuizItem[] = [],
  customData = '',
  initializing = true,
  lightMode = false
): AppState => {
  const items = loadedItems.map((item, index) => ({ ...item, id: index }));
  if (!initializing) {
    // Assign pasted cards IDs after the loaded cards so both sets can share a single state.
    items.push(...parseQuizData(customData).map((item, index) => ({
      ...item,
      id: items.length + index,
      topic: item.topic ?? '',
      confidence: 0
    })));
  }

  const ids = items.map(item => item.id);

  return {
    items,
    customData,
    initializing,
    lightMode,
    sourcePath,
    selectedTopics: [...new Set(items.map(item => item.topic))],
    remainingIds: ids,
    currentId: ids.length ? getRandomId(ids, items) : null
  };
};

const createAppReducer = (initialState: AppState) => {
  return createReducer(initialState, builder => {
    builder
      .addCase(rateConfidence, (state, action) => {
        if (state.currentId == null) {
          return;
        }

        const currentIndex = state.remainingIds.indexOf(
          state.currentId
        );

        const rating = action.payload;
        if (currentIndex !== -1) {
          const currentItem = state.items.find(item => item.id === state.currentId);
          if (currentItem) {
            if (rating > 4) {
              // Remove the current question from rotation if the user reports confidence.
              currentItem.confidence = 0;
              state.remainingIds.splice(currentIndex, 1);
            } else {
              currentItem.confidence = rating;
            }
          }
        }

        if (state.remainingIds.length === 0) {
          state.currentId = null;
          return;
        }

        state.currentId = getRandomId(state.remainingIds, state.items, state.currentId);
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
        const selectedItems = state.items.filter(item => state.selectedTopics.includes(item.topic));
        return createInitialState(state.sourcePath, selectedItems, state.customData, false, state.lightMode);
      })

      .addCase(reset.fulfilled, (state, action) => {
        const nextState = createInitialState(
          action.payload.path,
          action.payload.items,
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

export const createAppStore = (sourcePath = '/', items: QuizItem[] = []) => {
  const savedState = loadPersistedState(sourcePath);
  const restoredState = savedState?.sourcePath === sourcePath
    ? { ...savedState, sourcePath }
    : null;
  const initialState = restoredState ?? createInitialState(sourcePath, items);

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
