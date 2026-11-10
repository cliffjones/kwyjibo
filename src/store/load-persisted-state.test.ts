import { getStorageKey } from './get-storage-key';
import { loadPersistedState } from './load-persisted-state';

const createState = () => ({
  sourcePath: '/science',
  configData: {
    title: 'Science',
    homeMessage: 'Home',
    lightModeMessage: 'Change theme',
    preloadedDataHeading: 'Decks',
    customDataHeading: 'Custom',
    startButton: 'Begin',
    revealButton: 'Show',
    resetButton: 'Restart',
    yesButton: 'Yes',
    noButton: 'No',
    ratingPrompt: 'How did you do?',
    ratingLabel1: 'One',
    ratingLabel2: 'Two',
    ratingLabel3: 'Three',
    ratingLabel4: 'Four',
    ratingLabel5: 'Five',
    ratingMessage: 'Rated:',
    noCardsMessage: 'No cards.',
    resultsMessage: 'Results',
  },
  items: [
    {
      id: 1,
      type: 'question',
      topic: 'Science',
      task: 'What is a cell?',
      solution: 'A basic unit of life.',
      rating: 0,
    },
  ],
  customData: '',
  lightMode: true,
  initializing: false,
  startTime: 0,
  ratingTotal: 3,
  ratingCount: 2,
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
