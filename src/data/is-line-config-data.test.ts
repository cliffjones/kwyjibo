import { isLineConfigData } from './is-line-config-data';

describe('isLineConfigData', () => {
  it('accepts valid plain-object line config payloads', () => {
    expect(isLineConfigData({ left: true })).toBe(true);
    expect(isLineConfigData({ right: true, order: 2, value: 4 })).toBe(true);
  });

  it('rejects null, non-plain objects, and unknown keys', () => {
    expect(isLineConfigData(null)).toBe(false);
    expect(isLineConfigData([])).toBe(false);
    expect(isLineConfigData({ extra: true })).toBe(false);
    expect(isLineConfigData(Object.create({ left: true }))).toBe(false);
  });
});
