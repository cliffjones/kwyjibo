import { splitVariant } from './split-variant';

describe('splitVariant', () => {
  it('returns the original text when there is no trailing variant', () => {
    expect(splitVariant('plain-text')).toEqual({ content: 'plain-text', variant: '' });
  });

  it('splits a trailing variant from the content text', () => {
    expect(splitVariant('warning {alert}')).toEqual({ content: 'warning ', variant: 'alert' });
    expect(splitVariant('summary{info}')).toEqual({ content: 'summary', variant: 'info' });
  });
});
