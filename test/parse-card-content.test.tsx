import { render, screen } from '@testing-library/react';
import { parseCardContent } from '../src/features/card/parse-card-content';

describe('parseCardContent', () => {
  it('renders Markdown-style links and images', () => {
    render(parseCardContent('Visit [Kwyjibo](https://example.com "Home") ![A card](images/card.png "Card image")'));

    expect(screen.getByRole('link', { name: 'Kwyjibo' })).toHaveAttribute('href', 'https://example.com');
    expect(screen.getByRole('link', { name: 'Kwyjibo' })).toHaveAttribute('title', 'Home');
    expect(screen.getByRole('img', { name: 'A card' })).toHaveAttribute('src', 'images/card.png');
    expect(screen.getByRole('img', { name: 'A card' })).toHaveAttribute('title', 'Card image');
  });

  it('leaves unsafe or malformed Markdown-style links as text', () => {
    render(parseCardContent('[unsafe](javascript:alert(1)) [unfinished](https://example.com'));

    expect(screen.queryByRole('link')).not.toBeInTheDocument();
    expect(screen.getByText('[unsafe](javascript:alert(1)) [unfinished](https://example.com')).toBeInTheDocument();
  });

  it('preserves existing inline formatting alongside links', () => {
    render(parseCardContent('*emphasis* and `code` [link](/cards)'));

    expect(screen.getByText('emphasis').tagName).toBe('EM');
    expect(screen.getByText('code').tagName).toBe('CODE');
    expect(screen.getByRole('link', { name: 'link' })).toHaveAttribute('href', '/cards');
  });
});
