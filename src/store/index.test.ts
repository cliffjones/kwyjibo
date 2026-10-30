import * as dataModule from '../data/load-items';
import { createAppStore, rateItem, setCustomData, setLightMode, startQuiz } from './index';

describe('app store', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('persists independent app state for each route', () => {
    window.localStorage.setItem('kwyjibo', JSON.stringify({
      sourcePath: '/science',
      configData: {},
      items: [],
      customData: 'legacy shared quiz',
      initializing: true,
      lightMode: false,
      selectedTopics: [],
      remainingIds: [],
      currentId: null
    }));

    const scienceStore = createAppStore('/science');
    expect(scienceStore.getState().kwyjibo.customData).toBe('');
    expect(scienceStore.getState().kwyjibo.lightMode).toBe(false);
    scienceStore.dispatch(setCustomData('Science-specific quiz'));
    scienceStore.dispatch(setLightMode(true));

    const mathStore = createAppStore('/math');
    expect(mathStore.getState().kwyjibo.customData).toBe('');
    expect(mathStore.getState().kwyjibo.lightMode).toBe(false);
    mathStore.dispatch(setCustomData('Math-specific quiz'));

    const restoredScienceStore = createAppStore('/science');
    expect(restoredScienceStore.getState().kwyjibo.customData).toBe('Science-specific quiz');
    expect(restoredScienceStore.getState().kwyjibo.lightMode).toBe(true);

    const restoredMathStore = createAppStore('/math');
    expect(restoredMathStore.getState().kwyjibo.customData).toBe('Math-specific quiz');
    expect(restoredMathStore.getState().kwyjibo.lightMode).toBe(false);
  });

  it('advances to the next card when the current item is mastered', () => {
    const store = createAppStore('/test');
    store.dispatch(setCustomData('# Test\n\nQuestion one?\nAnswer one.\n\nQuestion two?\nAnswer two.\n\nQuestion three?\nAnswer three.'));
    store.dispatch(startQuiz());

    store.dispatch(rateItem(5));
    expect(store.getState().kwyjibo.currentId).toBe(1);

    store.dispatch(rateItem(5));
    expect(store.getState().kwyjibo.currentId).toBe(2);
    expect(store.getState().kwyjibo.remainingIds).toEqual([2]);
  });

  it('reloads remote data when persisted state has no active quiz', async () => {
    const loadItemsSpy = vi.spyOn(dataModule, 'loadItems').mockResolvedValue([
      {},
      { topic: 'Science', task: 'Question?', solution: 'Answer' }
    ]);

    window.localStorage.setItem('kwyjibo:%2Ftest', JSON.stringify({
      sourcePath: '/test',
      configData: { title: 'Saved state' },
      items: [],
      customData: '',
      initializing: false,
      lightMode: false,
      selectedTopics: [],
      remainingIds: [],
      currentId: null,
    }));

    const store = createAppStore('/test');

    await new Promise(resolve => setTimeout(resolve, 0));

    expect(loadItemsSpy).toHaveBeenCalledWith('/test');
    expect(store.getState().kwyjibo.currentId).toBe(0);
  });
});
