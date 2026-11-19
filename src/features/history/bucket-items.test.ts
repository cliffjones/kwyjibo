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
      { x: 13, y: 20 },
      { x: 10000, y: 80 },
    ]);
  });

  it('averages all points when their timestamps are identical', () => {
    expect(bucketItems([createItem(100, 2), createItem(100, 4)])).toEqual([{ x: 100, y: 40 }]);
  });
});
