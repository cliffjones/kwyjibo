import { parseJson } from './parse-json';

describe('parseJson', () => {
  it('parses valid JSON5 content', () => {
    expect(parseJson('{"language":"en","title":"Demo"}')).toEqual({ language: 'en', title: 'Demo' });
  });

  it('allows object keys with no explicit value', () => {
    expect(parseJson('{ left, title: "Demo", active }')).toEqual({
      left: true,
      title: 'Demo',
      active: true,
    });
  });

  it('returns null for empty input and forbidden keys', () => {
    expect(parseJson('')).toBeNull();

    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => { });
    expect(parseJson('{"__proto__":{"evil":true}}')).toBeNull();
    expect(errorSpy).toHaveBeenCalledTimes(1);
    errorSpy.mockRestore();
  });
});
