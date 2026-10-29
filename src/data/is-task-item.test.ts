import { isTaskItem } from './is-task-item';

describe('isTaskItem', () => {
  const createItem = (overrides: Partial<Record<string, unknown>> = {}) => ({
    id: 1,
    type: 'question',
    topic: 'Science',
    task: 'What is a cell?',
    solution: 'A basic unit of life.',
    rating: 0,
    ...overrides,
  });

  it('accepts valid task items', () => {
    expect(isTaskItem(createItem())).toBe(true);
    expect(isTaskItem(createItem({ type: 'reminder', solution: '' }))).toBe(true);
  });

  it('rejects invalid ids, solutions, and rating bounds', () => {
    expect(isTaskItem(createItem({ id: '1' }))).toBe(false);
    expect(isTaskItem(createItem({ solution: undefined }))).toBe(false);
    expect(isTaskItem(createItem({ rating: 6 }))).toBe(false);
    expect(isTaskItem(createItem({ rating: -1 }))).toBe(false);
  });
});
