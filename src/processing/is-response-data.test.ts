import { isResponseData } from './is-response-data';

describe('isResponseData', () => {
  it('accepts valid response data', () => {
    expect(isResponseData({ text: 'Hello', value: 1, order: 2 })).toBe(true);
  });

  it('rejects non-plain objects and invalid types', () => {
    expect(isResponseData(null)).toBe(false);
    expect(isResponseData([])).toBe(false);
    expect(isResponseData('Hello')).toBe(false);
    expect(isResponseData({ text: '', value: 1, order: 2 })).toBe(false);
    expect(isResponseData({ text: 'Hello', value: '1', order: 2 })).toBe(false);
    expect(isResponseData({ text: 'Hello', value: 1, order: '2' })).toBe(false);
    expect(isResponseData({ text: 'Hello' })).toBe(false);
    expect(isResponseData({ [Symbol('demo')]: 'value', text: 'Hello', value: 1, order: 2 })).toBe(false);
  });
});
