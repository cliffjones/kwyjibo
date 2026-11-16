import { extractLineConfig } from './extract-line-config';

describe('extractLineConfig', () => {
  it('returns the original text when there is no leading config', () => {
    expect(extractLineConfig('plain-text')).toEqual({ config: null, content: 'plain-text' });
  });

  it('pulls a leading config from the content text', () => {
    expect(extractLineConfig('{start} warning')).toEqual({ config: { start: true }, content: 'warning' });
    expect(extractLineConfig('{end}summary')).toEqual({ config: { end: true }, content: 'summary' });
  });
});
