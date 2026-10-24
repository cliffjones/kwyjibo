import { render, screen } from '@testing-library/react';
import { Content } from './index';

describe('Content', () => {
  it('renders Markdown-style links and images', () => {
    render(<Content text={'Visit [Kwyjibo](https://example.com "Home") ![A card](images/card.png)'} />);

    expect(screen.getByRole('link', { name: 'Kwyjibo' })).toHaveAttribute('href', 'https://example.com');
    expect(screen.getByRole('link', { name: 'Kwyjibo' })).toHaveAttribute('title', 'Home');
    expect(screen.getByRole('img', { name: 'A card' })).toHaveAttribute('src', 'images/card.png');
  });

  it('leaves unsafe or malformed Markdown-style links as text', () => {
    render(<Content text="[unsafe](javascript:alert(1)) [unfinished](https://example.com" />);

    expect(screen.queryByRole('link')).not.toBeInTheDocument();
    expect(screen.getByText('[unsafe](javascript:alert(1)) [unfinished](https://example.com')).toBeInTheDocument();
  });

  it('preserves existing inline formatting alongside links', () => {
    render(<Content text="*emphasis* and `code` [link](/cards)" />);

    expect(screen.getByText('emphasis').tagName).toBe('EM');
    expect(screen.getByText('code').tagName).toBe('CODE');
    expect(screen.getByRole('link', { name: 'link' })).toHaveAttribute('href', '/cards');
  });

  it('renders links in every list item', () => {
    render(<Content text={'- First [link](/first)\n- Second [link](/second)'} />);

    expect(screen.getAllByRole('listitem')).toHaveLength(2);
    expect(screen.getByRole('list')).toContainElement(screen.getAllByRole('link')[0]);
    expect(screen.getAllByRole('link').map(link => link.getAttribute('href'))).toEqual([
      '/first',
      '/second'
    ]);
  });

  it('renders same-line list items as separate list items without line breaks', () => {
    render(<Content text="Examples:  - First [link](/first)  - Second [link](/second)" />);

    expect(screen.getAllByRole('listitem')).toHaveLength(2);
    expect(screen.getAllByRole('link').map(link => link.getAttribute('href'))).toEqual([
      '/first',
      '/second'
    ]);
    expect(screen.getAllByRole('listitem').map(item => item.querySelector('br'))).toEqual([
      null,
      null
    ]);
  });

  it('renders an image inside a link', () => {
    render(<Content text="[![Kwyjibo](logo.png)](https://example.com)" />);

    const link = screen.getByRole('link', { name: 'Kwyjibo' });
    expect(link).toHaveAttribute('href', 'https://example.com');
    expect(link).toContainElement(screen.getByRole('img', { name: 'Kwyjibo' }));
    expect(screen.getByRole('img', { name: 'Kwyjibo' })).toHaveAttribute('src', 'logo.png');
  });
});
