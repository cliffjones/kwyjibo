import { extractConfig } from './extract-config';

describe('extractConfig', () => {
  it('returns the original text when there is no leading config', () => {
    expect(extractConfig('plain-text')).toEqual({ config: null, content: 'plain-text' });
  });

  it('pulls a leading config from the content text', () => {
    expect(extractConfig('{alert} warning')).toEqual({ config: { alert: true }, content: 'warning' });
    expect(extractConfig('{info}summary')).toEqual({ config: { info: true }, content: 'summary' });
  });
});
