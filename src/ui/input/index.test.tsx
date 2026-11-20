import { fireEvent, render, screen } from '@testing-library/react';
import { Input } from './index';

describe('Input', () => {
  it('renders and forwards changes from a labeled text area', () => {
    const onChange = vi.fn();
    render(<Input variant="long" label="Custom data" value="initial" onChange={onChange} />);

    const input = screen.getByRole('textbox', { name: 'Custom data' });
    expect(input).toHaveValue('initial');
    fireEvent.change(input, { target: { value: 'updated' } });
    expect(onChange).toHaveBeenCalledTimes(1);
  });
});
