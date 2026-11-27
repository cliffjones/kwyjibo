import { ITEM_TYPES } from '../processing/constants';
import * as dataModule from '../processing/load-items';
import { getStorageKey } from './get-storage-key';
import { createAppStore, respond, setCustomData, setLightMode, setMosaicTile, startDeck } from './index';

describe('app store', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('persists independent app state for each route', () => {
    window.localStorage.setItem(
      'kwyjibo',
      JSON.stringify({
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
        currentId: null,
      }),
    );

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

  it('preserves history when the route differs only by trailing slashes', () => {
    const store = createAppStore('/science', {}, [
      {
        id: 0,
        type: ITEM_TYPES.question,
        topic: 'Science',
        task: 'Question?',
        solution: 'Answer.',
        responses: [],
        rating: 0,
      },
    ]);
    store.dispatch(respond({ rating: 4 }));
    const history = store.getState().kwyjibo.history;

    const trailingSlashStore = createAppStore('/science/');
    expect(trailingSlashStore.getState().kwyjibo.history).toEqual(history);

    const originalPathStore = createAppStore('/science');
    expect(originalPathStore.getState().kwyjibo.history).toEqual(history);
  });

  it('initializes root-level tokens independently from the route state', () => {
    const store = createAppStore('/science', {}, [], ['alpha', 'beta']);

    expect(store.getState().tokens).toEqual(['alpha', 'beta']);
    expect(store.getState().kwyjibo.sourcePath).toBe('/science');
  });

  it('shares mosaic state across route-scoped stores', () => {
    const items = [
      {
        id: 0,
        type: ITEM_TYPES.question,
        topic: 'Science',
        task: 'Question?',
        solution: 'Answer.',
        responses: [],
        rating: 0,
      },
    ];
    const firstStore = createAppStore('/science', {}, items);
    firstStore.dispatch(setMosaicTile({ tileKey: '0,0', colorOptions: ['#112233'] }));
    const mosaic = firstStore.getState().mosaic;

    const secondStore = createAppStore('/math', {}, items);
    expect(secondStore.getState().mosaic).toEqual(mosaic);

    secondStore.dispatch(setMosaicTile({ tileKey: '1,0', colorOptions: ['#445566'] }));
    expect(createAppStore('/science').getState().mosaic).toEqual(secondStore.getState().mosaic);
  });

  it('tracks and persists root progress when an item is rated', () => {
    vi.useFakeTimers();

    try {
      vi.setSystemTime(new Date('2024-01-01T00:00:00Z'));
      const store = createAppStore('/science', {}, [
        {
          id: 0,
          type: ITEM_TYPES.question,
          topic: 'Science',
          task: 'Question?',
          solution: 'Answer.',
          responses: [],
          rating: 0,
        },
      ]);

      store.dispatch(respond({ rating: 4 }));

      expect(store.getState().pointBalance).toBe(0.4);
      expect(store.getState().activeSince).toBe(Date.now());
      expect(JSON.parse(window.localStorage.getItem('kwyjibo') ?? '{}')).toMatchObject({
        pointBalance: 0.4,
        activeSince: Date.now(),
      });

      const activeSince = store.getState().activeSince;
      vi.setSystemTime(new Date('2024-01-03T00:00:00.001Z'));
      store.dispatch(respond({ rating: 1 }));

      expect(store.getState().pointBalance).toBe(0.5);
      expect(store.getState().activeSince).toBe(Date.now());
      expect(store.getState().activeSince).not.toBe(activeSince);
      expect(createAppStore('/math').getState()).toMatchObject({
        pointBalance: 0.5,
        activeSince: Date.now(),
      });
    } finally {
      vi.useRealTimers();
    }
  });

  it('keeps activeSince when a rating occurs within 48 hours', () => {
    vi.useFakeTimers();

    try {
      vi.setSystemTime(new Date('2024-01-01T00:00:00Z'));
      const store = createAppStore('/active', {}, [
        {
          id: 0,
          type: ITEM_TYPES.question,
          topic: 'Science',
          task: 'Question?',
          solution: 'Answer.',
          responses: [],
          rating: 0,
        },
      ]);
      store.dispatch(respond({ rating: 2 }));
      const activeSince = store.getState().activeSince;

      vi.setSystemTime(new Date('2024-01-03T00:00:00Z'));
      store.dispatch(respond({ rating: 3 }));

      expect(store.getState().activeSince).toBe(activeSince);
    } finally {
      vi.useRealTimers();
    }
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
    store.dispatch(
      setCustomData(
        '# Test\n\nQuestion one?\nAnswer one.\n\nQuestion two?\nAnswer two.\n\nQuestion three?\nAnswer three.',
      ),
    );
    store.dispatch(startDeck());

    store.dispatch(respond({ rating: 5 }));
    expect(store.getState().kwyjibo.currentId).toBe(1);

    store.dispatch(respond({ rating: 5 }));
    expect(store.getState().kwyjibo.currentId).toBe(2);
    expect(store.getState().kwyjibo.remainingIds).toEqual([2]);
  });

  it('records each rating and persists quiz responses in history', () => {
    vi.useFakeTimers();

    try {
      vi.setSystemTime(new Date('2024-01-01T00:00:00Z'));
      const store = createAppStore('/history');
      store.dispatch(setCustomData('# Science\n\nWhich answer?\nCorrect\nIncorrect'));
      store.dispatch(startDeck());

      store.dispatch(respond({ rating: 1, response: 'Incorrect' }));

      const history = store.getState().kwyjibo.history;
      expect(history).toEqual([
        {
          time: Date.now(),
          type: ITEM_TYPES.quiz,
          topic: 'Science',
          task: 'Which answer?',
          response: 'Incorrect',
          rating: 1,
        },
      ]);
      expect(JSON.parse(window.localStorage.getItem(getStorageKey('/history')) ?? 'null').history).toEqual(history);
    } finally {
      vi.useRealTimers();
    }
  });

  it('preserves history when starting another deck', () => {
    const store = createAppStore('/history');
    store.dispatch(setCustomData('# Science\n\nQuestion?\nAnswer.'));
    store.dispatch(startDeck());
    store.dispatch(respond({ rating: 3 }));

    const history = store.getState().kwyjibo.history;
    store.dispatch(startDeck());

    expect(store.getState().kwyjibo.history).toEqual(history);
    expect(store.getState().kwyjibo.history[0]).not.toHaveProperty('response');
  });

  it('preserves mosaic colors when starting another deck', () => {
    const store = createAppStore('/mosaic');
    store.dispatch(setMosaicTile({ tileKey: '0,0', colorOptions: ['#112233'] }));
    const mosaic = store.getState().mosaic;

    store.dispatch(startDeck({ customData: '# Science\n\nQuestion?\nAnswer.' }));

    expect(store.getState().mosaic).toEqual(mosaic);
  });

  it('reloads remote data when persisted state has no active deck', async () => {
    const loadItemsSpy = vi
      .spyOn(dataModule, 'loadItems')
      .mockResolvedValue([
        {},
        { topic: 'Science', task: 'Question?', solution: 'Answer', responses: [], id: 0, type: 'task', rating: 0 },
      ]);

    window.localStorage.setItem(
      'kwyjibo:test',
      JSON.stringify({
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
        history: [],
      }),
    );

    const store = createAppStore('/test');

    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(loadItemsSpy).toHaveBeenCalledWith('/test', []);
    expect(store.getState().kwyjibo.currentId).toBe(0);
  });
});
