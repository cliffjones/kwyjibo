import { selectItemCounts } from './select-item-counts';

describe('selectItemCounts', () => {
  it('counts how many items belong to each topic', () => {
    const state = {
      kwyjibo: {
        items: [
          { topic: 'Science', task: 'Gravity question', solution: 'Answer', responses: [], rating: 0 },
          { topic: '', task: 'Zebra question', solution: 'Answer', responses: [], rating: 0 },
          { topic: 'Science', task: 'Another gravity question', solution: 'Answer', responses: [], rating: 0 },
          { topic: 'Math', task: 'Arithmetic question', solution: 'Answer', responses: [], rating: 0 },
          { topic: 'Math', task: 'Algebra question', solution: 'Answer', responses: [], rating: 0 },
        ],
      },
    } as any;

    expect(selectItemCounts(state)).toEqual({
      Science: 2,
      'Zebra question': 1,
      Math: 2,
    });
  });
});
