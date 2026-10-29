import { getNextId } from './get-next-id';

describe('getNextId', () => {
  it('returns null when the list is empty or missing the current item', () => {
    expect(getNextId([], 1)).toBeNull();
    expect(getNextId([3, 5, 8], 99)).toBeNull();
  });

  it('returns the first item when no previous item is supplied', () => {
    expect(getNextId([3, 5, 8])).toBe(3);
  });

  it('returns the next item in sequence or null at the end', () => {
    expect(getNextId([3, 5, 8], 3)).toBe(5);
    expect(getNextId([3, 5, 8], 5)).toBe(8);
    expect(getNextId([3, 5, 8], 8)).toBeNull();
  });
});
