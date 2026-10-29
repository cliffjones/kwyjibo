import { matchInlineToken } from './match-inline-token';

describe('matchInlineToken', () => {
  it('matches inline links and image links', () => {
    const linkMatch = matchInlineToken('[Kwyjibo](https://example.com "Home")', 0);
    expect(linkMatch).toMatchObject({
      length: expect.any(Number),
      token: {
        type: 'link',
        text: 'Kwyjibo',
        url: 'https://example.com',
        title: 'Home',
      }
    });

    const imageMatch = matchInlineToken('![Card](images/card.png)', 0);
    expect(imageMatch).toMatchObject({
      token: {
        type: 'image',
        text: 'Card',
        url: 'images/card.png',
      }
    });

    const imageLinkMatch = matchInlineToken('[![Logo](logo.png)](https://example.com)', 0);
    expect(imageLinkMatch).toMatchObject({
      token: {
        type: 'link',
        url: 'https://example.com',
        image: {
          text: 'Logo',
          url: 'logo.png',
        },
      }
    });
  });

  it('matches emphasis and code delimiters when they close correctly', () => {
    expect(matchInlineToken('*emphasis*', 0)).toEqual({
      token: { type: 'em', text: 'emphasis' },
      length: 10,
    });

    expect(matchInlineToken('`code`', 0)).toEqual({
      token: { type: 'code', text: 'code' },
      length: 6,
    });
  });

  it('returns null for malformed or unsafe markdown spans', () => {
    expect(matchInlineToken('[unsafe](javascript:alert(1))', 0)).toBeNull();
    expect(matchInlineToken('*no close', 0)).toBeNull();
    expect(matchInlineToken('**cross**', 0)).toBeNull();
  });
});
