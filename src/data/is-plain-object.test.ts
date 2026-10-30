import { isPlainObject } from './is-plain-object';

describe('isPlainObject', () => {
  it('accepts plain objects and rejects other values', () => {
    expect(isPlainObject({ title: 'Demo' })).toBe(true);
    expect(isPlainObject(Object.create(null))).toBe(false);
    expect(isPlainObject([])).toBe(false);
    expect(isPlainObject(null)).toBe(false);
    expect(isPlainObject('abc')).toBe(false);
  });
});
