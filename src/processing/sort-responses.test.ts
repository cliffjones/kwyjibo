import { sortResponses } from './sort-responses';

describe('sortResponses', () => {
  const createResponse = (text: string, value: number, order: number) => ({
    text,
    value,
    order,
  });

  it('sorts responses by their order value in ascending order', () => {
    const responses = [createResponse('Second', 2, 2), createResponse('First', 1, 1), createResponse('Third', 3, 3)];

    expect(sortResponses(responses).map(({ order }) => order)).toEqual([1, 2, 3]);
  });

  it('returns the same items when order values are equal', () => {
    const responses = [createResponse('A', 1, 1), createResponse('B', 2, 1), createResponse('C', 3, 1)];

    const sorted = sortResponses(responses);

    expect(sorted).toHaveLength(responses.length);
    expect(sorted.map(({ text }) => text).sort()).toEqual(['A', 'B', 'C']);
  });
});
