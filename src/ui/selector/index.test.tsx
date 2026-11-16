import { fireEvent, render, screen } from '@testing-library/react';
import { Selector } from './index';

describe('Selector', () => {
  it('renders options, forwards select props, and merges variant classes', () => {
    const onChange = vi.fn();

    render(
      <Selector aria-label="Language" name="language" value="es" variant="compact outlined" onChange={onChange}>
        <option value="en">English</option>
        <option value="es">Español</option>
        <option value="fr">Français</option>
      </Selector>,
    );

    const selector = screen.getByRole('combobox', { name: 'Language' });
    expect(selector).toHaveValue('es');
    expect(selector).toHaveAttribute('name', 'language');
    expect(selector).toHaveClass('selector', 'selector--compact', 'selector--outlined');

    fireEvent.change(selector, { target: { value: 'fr' } });
    expect(onChange).toHaveBeenCalledTimes(1);
  });
});
