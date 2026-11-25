import { ITEM_TYPES } from '../../processing/constants';
import type { HistoryItem } from '../../processing/types';
import { bucketItems } from './bucket-items';

const createItem = (time: number, rating: number): HistoryItem => ({
  time,
  rating,
  topic: 'Science',
  task: `Question at ${time}`,
  type: ITEM_TYPES.question,
});

describe('bucketItems', () => {
  it('sorts points and averages points within the same time range', () => {
    expect(bucketItems([createItem(10000, 5), createItem(25, 3), createItem(0, 1)])).toEqual([
      { x: 13, y: 25, tooltipLabels: ['0%', '50%'] },
      { x: 10000, y: 100, tooltipLabels: ['100%'] },
    ]);
  });

  it('averages all points when their timestamps are identical', () => {
    expect(bucketItems([createItem(100, 2), createItem(100, 4)])).toEqual([
      { x: 100, y: 50, tooltipLabels: ['25%', '75%'] },
    ]);
  });

  it('excludes items that cannot be converted to points', () => {
    const invalidInput: HistoryItem = {
      ...createItem(50, 3),
      type: ITEM_TYPES.input,
      response: 'no numeric value',
    };

    expect(bucketItems([createItem(0, 3), invalidInput, createItem(100, 5)])).toEqual([
      { x: 0, y: 50, tooltipLabels: ['50%'] },
      { x: 100, y: 100, tooltipLabels: ['100%'] },
    ]);
  });

  it('returns no points when every item conversion fails', () => {
    expect(
      bucketItems([
        {
          ...createItem(50, 3),
          type: ITEM_TYPES.input,
          response: 'no numeric value',
        },
      ]),
    ).toEqual([]);
  });
});
