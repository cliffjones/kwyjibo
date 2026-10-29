import { getStorageKey } from './get-storage-key';
import { persistState } from './persist-state';

describe('persistState', () => {
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

  beforeEach(() => {
    window.localStorage.clear();
  });

  it('stores the current state under the route key', () => {
    persistState(createState());

    expect(JSON.parse(window.localStorage.getItem(getStorageKey('/science')) ?? 'null')).toEqual(createState());
  });

  it('swallows browser storage errors', () => {
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => { });
    const setItem = jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('disk full');
    });

    expect(() => persistState(createState())).not.toThrow();
    expect(errorSpy).toHaveBeenCalledTimes(1);

    setItem.mockRestore();
    errorSpy.mockRestore();
  });
});
