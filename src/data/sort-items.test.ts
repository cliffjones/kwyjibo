import { sortItems } from './sort-items';

describe('sortItems', () => {
  const createItem = (id: number, rating: number, task: string) => ({
    id,
    type: 'question',
    topic: 'Science',
    task,
    solution: 'Answer',
    rating,
  });

  it('sorts items by rating with lower ratings first', () => {
    const items = [
      createItem(1, 3, 'One'),
      createItem(2, 1, 'Two'),
      createItem(3, 3, 'Three'),
    ];

    const sortedIds = sortItems(items).map(({ id }) => id);
    expect(sortedIds[0]).toBe(2);
    expect(sortedIds.slice(1).sort((a, b) => a - b)).toEqual([1, 3]);
  });
});
