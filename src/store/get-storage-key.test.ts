import { getStorageKey } from './get-storage-key';

describe('getStorageKey', () => {
  it('encodes the source path into the persisted state key', () => {
    expect(getStorageKey('/science')).toBe('kwyjibo:%2Fscience');
    expect(getStorageKey('/science/space')).toBe('kwyjibo:%2Fscience%2Fspace');
  });
});
