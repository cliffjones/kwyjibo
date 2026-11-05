import * as dataModule from '../processing/load-items';
import { createAppStore, rateItem, setCustomData, setLightMode, startDeck } from './index';

describe('app store', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('persists independent app state for each route', () => {
    window.localStorage.setItem('kwyjibo', JSON.stringify({
      sourcePath: '/science',
      configData: {},
      items: [],
      customData: 'legacy shared deck',
      lightMode: false,
      initializing: true,
      startTime: 0,
      ratingTotal: 0,
      ratingCount: 0,
      selectedTopics: [],
      remainingIds: [],
      currentId: null
    }));

    const scienceStore = createAppStore('/science');
    expect(scienceStore.getState().kwyjibo.customData).toBe('');
    expect(scienceStore.getState().kwyjibo.lightMode).toBe(false);
    scienceStore.dispatch(setCustomData('Science-specific deck'));
    scienceStore.dispatch(setLightMode(true));

    const mathStore = createAppStore('/math');
    expect(mathStore.getState().kwyjibo.customData).toBe('');
    expect(mathStore.getState().kwyjibo.lightMode).toBe(false);
    mathStore.dispatch(setCustomData('Math-specific deck'));

    const restoredScienceStore = createAppStore('/science');
    expect(restoredScienceStore.getState().kwyjibo.customData).toBe('Science-specific deck');
    expect(restoredScienceStore.getState().kwyjibo.lightMode).toBe(true);

    const restoredMathStore = createAppStore('/math');
    expect(restoredMathStore.getState().kwyjibo.customData).toBe('Math-specific deck');
    expect(restoredMathStore.getState().kwyjibo.lightMode).toBe(false);
  });

  it('resets the deck timer when starting a new deck', () => {
    vi.useFakeTimers();

    try {
      vi.setSystemTime(new Date('2024-01-01T00:00:00Z'));
      const store = createAppStore('/test');
      const initialStartTime = store.getState().kwyjibo.startTime;

      vi.setSystemTime(new Date('2024-01-01T00:05:00Z'));
      store.dispatch(setCustomData('# Test\n\nQuestion one?\nAnswer one.'));
      store.dispatch(startDeck());

      expect(store.getState().kwyjibo.startTime).toBe(Date.now());
      expect(store.getState().kwyjibo.startTime).not.toBe(initialStartTime);
    } finally {
      vi.useRealTimers();
    }
  });

  it('advances to the next card when the current item is mastered', () => {
    const store = createAppStore('/test');
    store.dispatch(setCustomData('# Test\n\nQuestion one?\nAnswer one.\n\nQuestion two?\nAnswer two.\n\nQuestion three?\nAnswer three.'));
    store.dispatch(startDeck());

    store.dispatch(rateItem(5));
    expect(store.getState().kwyjibo.currentId).toBe(1);

    store.dispatch(rateItem(5));
    expect(store.getState().kwyjibo.currentId).toBe(2);
    expect(store.getState().kwyjibo.remainingIds).toEqual([2]);
  });

  it('reloads remote data when persisted state has no active deck', async () => {
    const loadItemsSpy = vi.spyOn(dataModule, 'loadItems').mockResolvedValue([
      {},
      { topic: 'Science', task: 'Question?', solution: 'Answer', responses: [], id: 0, type: 'task', rating: 0 }
    ]);

    window.localStorage.setItem('kwyjibo:%2Ftest', JSON.stringify({
      sourcePath: '/test',
      configData: { title: 'Saved state' },
      items: [],
      customData: '',
      lightMode: false,
      initializing: false,
      startTime: 0,
      ratingTotal: 0,
      ratingCount: 0,
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
