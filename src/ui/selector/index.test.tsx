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

  it('shows an icon button until opened and hides the select after selection', () => {
    const onChange = vi.fn();
    const descriptor = Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, 'showPicker');
    const showPicker = vi.fn();

    Object.defineProperty(HTMLSelectElement.prototype, 'showPicker', {
      configurable: true,
      value: showPicker,
    });

    try {
      render(
        <Selector icon="sun" aria-label="Theme" value="dark" onChange={onChange}>
          <option value="dark">Dark</option>
          <option value="light">Light</option>
        </Selector>,
      );

      expect(screen.queryByRole('combobox', { name: 'Theme' })).not.toBeInTheDocument();
      const button = screen.getByRole('button', { name: 'Theme' });
      expect(button).toHaveClass('button', 'button--text');
      expect(button.querySelector('svg')).toBeInTheDocument();

      fireEvent.click(button);

      const selector = screen.getByRole('combobox', { name: 'Theme' });
      expect(selector).toHaveClass('selector');
      expect(screen.queryByRole('button', { name: 'Theme' })).not.toBeInTheDocument();
      expect(showPicker).toHaveBeenCalledTimes(1);

      fireEvent.change(selector, { target: { value: 'light' } });

      expect(onChange).toHaveBeenCalledTimes(1);
      expect(screen.queryByRole('combobox', { name: 'Theme' })).not.toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Theme' })).toBeInTheDocument();
    } finally {
      if (descriptor) {
        Object.defineProperty(HTMLSelectElement.prototype, 'showPicker', descriptor);
      } else {
        Reflect.deleteProperty(HTMLSelectElement.prototype, 'showPicker');
      }
    }
  });
});
