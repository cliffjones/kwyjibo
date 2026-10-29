import { isTaskData } from './is-task-data';

describe('isTaskData', () => {
  it('accepts valid task objects', () => {
    expect(isTaskData({ task: 'Name the planet' })).toBe(true);
    expect(isTaskData({ topic: 'Science', task: 'Name the planet', solution: 'Earth' })).toBe(true);
  });

  it('rejects invalid task objects', () => {
    expect(isTaskData({ topic: 3, task: 'Name the planet' })).toBe(false);
    expect(isTaskData({ type: 'reminder', task: 42 })).toBe(false);
    expect(isTaskData({ solution: 'Earth' })).toBe(false);
  });
});
