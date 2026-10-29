import { isConfigData } from './is-config-data';

describe('isConfigData', () => {
  it('accepts valid config objects and ignores extra keys', () => {
    expect(isConfigData({ title: 'Kwyjibo' })).toBe(true);
    expect(isConfigData({})).toBe(true);
  });

  it('rejects null and unexpected keys', () => {
    expect(isConfigData(null)).toBe(false);
    expect(isConfigData({ bad: 'value' })).toBe(false);
  });
});
