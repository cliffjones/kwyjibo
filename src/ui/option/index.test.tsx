import { fireEvent, render, screen } from '@testing-library/react';
import { Option } from './index';

describe('Option', () => {
  it('renders a labeled checkbox and forwards changes', () => {
    const onChange = vi.fn();
    render(<Option label="Science" checked={false} onChange={onChange} />);

    const option = screen.getByRole('checkbox', { name: 'Science' });
    fireEvent.click(option);
    expect(onChange).toHaveBeenCalledTimes(1);
  });
});
