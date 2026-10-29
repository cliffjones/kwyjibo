import { render, screen } from '@testing-library/react';
import { Link } from './index';

describe('Link', () => {
  it('adds external link behavior and merges class names', () => {
    render(
      <Link href="https://example.com" className="cta" title="Example">
        Visit
      </Link>
    );

    const link = screen.getByRole('link', { name: 'Visit' });
    expect(link).toHaveAttribute('href', 'https://example.com');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('title', 'Example');
    expect(link).toHaveClass('link', 'cta');
  });

  it('keeps internal links as regular anchors', () => {
    render(<Link href="/docs">Docs</Link>);

    const link = screen.getByRole('link', { name: 'Docs' });
    expect(link).toHaveAttribute('href', '/docs');
    expect(link).not.toHaveAttribute('target');
  });
});
