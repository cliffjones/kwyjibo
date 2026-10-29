import { getStorageKey } from './get-storage-key';
import { loadPersistedState } from './load-persisted-state';

const createState = () => ({
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

describe('loadPersistedState', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('returns null when there is no saved state for that route', () => {
    expect(loadPersistedState('/math')).toBeNull();
  });

  it('loads a valid saved state for the route', () => {
    const state = createState();
    window.localStorage.setItem(getStorageKey('/science'), JSON.stringify(state));

    expect(loadPersistedState('/science')).toEqual(state);
  });

  it('ignores invalid payloads', () => {
    window.localStorage.setItem(getStorageKey('/science'), '{bad json');
    expect(loadPersistedState('/science')).toBeNull();

    window.localStorage.setItem(getStorageKey('/science'), JSON.stringify({ sourcePath: '/science', bad: true }));
    expect(loadPersistedState('/science')).toBeNull();
  });
});
