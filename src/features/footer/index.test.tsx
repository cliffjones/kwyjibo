import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { createAppStore } from '../../store';
import { Footer } from './index';

describe('Footer', () => {
  it('renders the author link in the footer', () => {
    window.localStorage.clear();
    const store = createAppStore('/footer');

    render(
      <Provider store={store}>
        <Footer />
      </Provider>
    );

    expect(screen.getByRole('link', { name: 'Cliff Jones Jr.' })).toHaveAttribute(
      'href',
      '/'
    );
  });
});
