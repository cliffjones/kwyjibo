import { isAppState } from './is-app-state';
import type { AppState } from './types';

describe('isAppState', () => {
  const createState = (): AppState => ({
    sourcePath: '/science',
    configData: { title: 'Science' },
    items: [{
      id: 1,
      type: 'question',
      topic: 'Science',
      task: 'What is a cell?',
      solution: 'A basic unit of life.',
      rating: 0,
    }],
    customData: '',
    initializing: false,
    lightMode: true,
    selectedTopics: ['Science'],
    remainingIds: [1],
    currentId: 1,
  });

  it('accepts a valid persisted app state', () => {
    expect(isAppState(createState())).toBe(true);
  });

  it('rejects malformed or inconsistent app state', () => {
    const state = createState();
    expect(isAppState({ ...state, sourcePath: 42 })).toBe(false);
    expect(isAppState({ ...state, customData: 7 })).toBe(false);
    expect(isAppState({ ...state, remainingIds: [2] })).toBe(false);
    expect(isAppState({ ...state, currentId: null, remainingIds: [] })).toBe(true);
    expect(isAppState({ ...state, currentId: 2 })).toBe(false);
  });
});
