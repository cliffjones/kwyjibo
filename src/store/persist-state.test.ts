import { getStorageKey } from './get-storage-key';
import { persistState } from './persist-state';

describe('persistState', () => {
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
        responses: [],
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

  beforeEach(() => {
    window.localStorage.clear();
  });

  it('stores the current state under the route key', () => {
    persistState(createState());

    expect(JSON.parse(window.localStorage.getItem(getStorageKey('/science')) ?? 'null')).toEqual(createState());
  });

  it('swallows browser storage errors', () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const setItem = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('disk full');
    });

    expect(() => persistState(createState())).not.toThrow();
    expect(errorSpy).toHaveBeenCalledTimes(1);

    setItem.mockRestore();
    errorSpy.mockRestore();
  });
});
