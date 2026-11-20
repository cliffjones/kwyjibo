import { ITEM_TYPES } from '../../processing/constants';
import type { HistoryItem } from '../../processing/types';
import { itemToPoint } from './item-to-point';

const createItem = (overrides: Partial<HistoryItem> = {}): HistoryItem => ({
  time: 123,
  rating: 4,
  topic: 'Science',
  task: 'Question?',
  type: ITEM_TYPES.question,
  ...overrides,
});

describe('itemToPoint', () => {
  it('converts a rating to a percentage point', () => {
    expect(itemToPoint(createItem())).toEqual({ x: 123, y: 75 });
  });

  it('uses a numeric response as the value for input items', () => {
    expect(itemToPoint(createItem({ type: ITEM_TYPES.input, response: '42.5 units' }))).toEqual({ x: 123, y: 42.5 });
  });

  it('returns null for input responses without a number', () => {
    expect(itemToPoint(createItem({ type: ITEM_TYPES.input, response: 'not a number' }))).toBeNull();
  });

  it('does not use a response for other item types', () => {
    expect(itemToPoint(createItem({ type: ITEM_TYPES.quiz, response: '5' }))).toEqual({ x: 123, y: 75 });
  });
});
