import { createInitialState } from './create-initial-state';

describe('createInitialState', () => {
  it('preserves loaded config data in app state', () => {
    const configData = {
      homeMessage: 'Home',
      startButton: 'Begin',
      ratingLabel5: 'Excellent',
      resultsMessage: 'Results',
    };

    expect(createInitialState('/test', configData).configData).toEqual(configData);
  });

  it('sorts loaded items and assigns stable ids', () => {
    const state = createInitialState('/test', {}, [
      {
        id: 99,
        type: 'task',
        topic: 'Zulu',
        task: 'Second question?',
        solution: 'Second answer.',
        responses: [],
        rating: 0,
      },
      {
        id: 98,
        type: 'task',
        topic: 'Alpha',
        task: 'First question?',
        solution: 'First answer.',
        responses: [],
        rating: 0,
      },
    ]);

    expect([...state.items.map(({ task }) => task)].sort()).toEqual(['First question?', 'Second question?']);
    expect(state.items.map(({ id }) => id)).toEqual([0, 1]);
    expect(state.remainingIds).toEqual([0, 1]);
    expect(state.currentId).toBe(0);
  });

  it('merges custom deck data when the app is no longer initializing', () => {
    const parsedCustomData = [
      { title: 'Custom deck' },
      { task: 'Custom question?', solution: 'Custom answer.' },
    ] as any;

    const state = createInitialState('/test', {}, [], '', false, false, 123, 3, 2, undefined, parsedCustomData);

    expect(state.configData).toEqual({ title: 'Custom deck' });
    expect(state.startTime).toBe(123);
    expect(state.items).toHaveLength(1);
    expect(state.items[0]).toMatchObject({ task: 'Custom question?', solution: 'Custom answer.' });
    expect(state.currentId).toBe(0);
  });
});
