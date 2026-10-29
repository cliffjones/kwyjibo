import { tokenizeInline } from './tokenize-inline';

describe('tokenizeInline', () => {
  it('turns mixed plain text and markdown into inline tokens', () => {
    expect(tokenizeInline('Hello *world* [link](https://example.com) ![img](img.png)')).toEqual([
      { type: 'text', text: 'Hello ' },
      { type: 'em', text: 'world' },
      { type: 'text', text: ' ' },
      { type: 'link', text: 'link', url: 'https://example.com' },
      { type: 'text', text: ' ' },
      { type: 'image', text: 'img', url: 'img.png' },
    ]);
  });

  it('parses valid emphasis tokens and preserves unmatched markers as text', () => {
    expect(tokenizeInline('**not markdown**')).toEqual([
      { type: 'text', text: '*' },
      { type: 'em', text: 'not markdown' },
      { type: 'text', text: '*' },
    ]);
  });
});
