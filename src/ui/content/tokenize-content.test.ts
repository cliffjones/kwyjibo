import { tokenizeContent } from './tokenize-content';

describe('tokenizeContent', () => {
  it('splits list items from surrounding text', () => {
    expect(tokenizeContent('Before\n- First item\n- Second item')).toEqual([
      { type: 'text', text: 'Before' },
      { type: 'list-item', text: 'First item' },
      { type: 'list-item', text: 'Second item' },
    ]);
  });

  it('handles compact single-line list entries', () => {
    expect(tokenizeContent('  - alpha  - beta')).toEqual([
      { type: 'list-item', text: 'alpha' },
      { type: 'list-item', text: 'beta' },
    ]);
  });
});
