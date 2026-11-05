import { extractLineConfig } from './extract-line-config';

describe('extractLineConfig', () => {
  it('returns the original text when there is no leading config', () => {
    expect(extractLineConfig('plain-text')).toEqual({ config: null, content: 'plain-text' });
  });

  it('pulls a leading config from the content text', () => {
    expect(extractLineConfig('{left} warning')).toEqual({ config: { left: true }, content: 'warning' });
    expect(extractLineConfig('{right}summary')).toEqual({ config: { right: true }, content: 'summary' });
  });
});
