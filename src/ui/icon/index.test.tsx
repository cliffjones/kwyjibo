import { render } from '@testing-library/react';
import { Icon } from './index';

describe('Icon', () => {
  it('renders a basic SVG container for supported icon names', () => {
    const names = ['check', 'face-no', 'face-yes', 'moon', 'point-down', 'point-right', 'reset', 'sun', 'x'] as const;

    names.forEach((name) => {
      const { container, unmount } = render(<Icon name={name} />);
      const svg = container.querySelector('svg');

      expect(svg).toBeInTheDocument();
      expect(svg).toHaveAttribute('aria-hidden', 'true');
      expect(svg).toHaveClass('icon');
      unmount();
    });
  });
});
