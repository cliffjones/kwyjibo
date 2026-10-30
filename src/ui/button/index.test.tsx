import { fireEvent, render, screen } from '@testing-library/react';
import { Button } from './index';

describe('Button', () => {
  it('renders a button with its standard props and custom class', () => {
    const onClick = vi.fn();
    render(<Button className="button--primary" onClick={onClick}>Save</Button>);

    const button = screen.getByRole('button', { name: 'Save' });
    expect(button).toHaveClass('button', 'button--primary');
    fireEvent.click(button);
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
