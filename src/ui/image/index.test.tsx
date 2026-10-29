import { render, screen } from '@testing-library/react';
import { Image } from './index';

describe('Image', () => {
  it('renders an img tag with the image class and forwarded props', () => {
    render(<Image src="/logo.png" alt="Kwyjibo logo" className="brand" data-testid="logo" />);

    const image = screen.getByTestId('logo');
    expect(image).toHaveAttribute('src', '/logo.png');
    expect(image).toHaveAttribute('alt', 'Kwyjibo logo');
    expect(image).toHaveClass('image', 'brand');
  });
});
