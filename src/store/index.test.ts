import { createAppStore, setCustomData, setLightMode } from './index';

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
});
