import { render, screen } from '@testing-library/react';
import { Footer } from './index';

describe('Footer', () => {
  it('renders the author link in the footer', () => {
    render(<Footer />);

    expect(screen.getByRole('link', { name: 'Cliff Jones Jr.' })).toHaveAttribute(
      'href',
      'https://gofund.me/e965a3bab'
    );
  });
});
