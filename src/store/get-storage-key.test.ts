import { getStorageKey } from './get-storage-key';

describe('getStorageKey', () => {
  it('encodes the source path into the persisted state key', () => {
    expect(getStorageKey('/science')).toBe('kwyjibo:science');
    expect(getStorageKey('/science/space')).toBe('kwyjibo:science/space');
  });
});
