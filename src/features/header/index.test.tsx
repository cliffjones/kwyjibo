import { fireEvent, render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter, useLocation } from 'react-router';
import type { TaskItem } from '../../processing/types';
import { createAppStore, startDeck } from '../../store';
import { getStorageKey } from '../../store/get-storage-key';
import { Header } from './index';

const items: TaskItem[] = [
  { id: 0, type: 'quiz', topic: 'Zulu', task: 'Question?', solution: 'Answer.', responses: [], rating: 0 },
];

const CurrentPath = () => {
  const { pathname } = useLocation();
  return <output data-testid="current-path">{pathname}</output>;
};

describe('Header', () => {
  beforeEach(() => {
    window.localStorage.clear();
    delete document.documentElement.dataset.theme;
  });

  it('shows card counts and calls the reset confirmation handler', () => {
    const store = createAppStore('/test', {}, items);
    store.dispatch(startDeck());
    const confirmReset = vi.fn();

    render(
      <MemoryRouter basename="/k" initialEntries={['/k/test']}>
        <Provider store={store}>
          <Header confirmReset={confirmReset} confirmingReset={false} />
        </Provider>
      </MemoryRouter>,
    );

    expect(screen.getByText('1 card loaded.')).toBeInTheDocument();
    fireEvent.click(screen.getByTitle('Reset'));
    expect(confirmReset).toHaveBeenCalledTimes(1);
  });

  it('updates the document title from the configured title and resets it when absent', () => {
    const store = createAppStore('/title', { title: 'Science' });
    const { rerender } = render(
      <MemoryRouter basename="/k" initialEntries={['/k/title']}>
        <Provider store={store}>
          <Header confirmReset={vi.fn()} confirmingReset={false} />
        </Provider>
      </MemoryRouter>,
    );

    expect(document.title).toBe('Kwyjibo: Science');

    const storeWithoutTitle = createAppStore('/title-without-config');
    rerender(
      <MemoryRouter basename="/k" initialEntries={['/k/title-without-config']}>
        <Provider store={storeWithoutTitle}>
          <Header confirmReset={vi.fn()} confirmingReset={false} />
        </Provider>
      </MemoryRouter>,
    );

    expect(document.title).toBe('Kwyjibo');
  });

  it('toggles and persists the global color theme from the header', () => {
    const store = createAppStore('/test');

    const { unmount } = render(
      <MemoryRouter basename="/k" initialEntries={['/k/test']}>
        <Provider store={store}>
          <Header confirmReset={vi.fn()} confirmingReset={false} />
        </Provider>
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByTitle('Switch to light mode'));

    expect(document.documentElement).toHaveAttribute('data-theme', 'light');
    expect(store.getState().kwyjibo.lightMode).toBe(true);
    expect(JSON.parse(window.localStorage.getItem(getStorageKey('/test')) ?? '{}').lightMode).toBe(true);

    const restoredStore = createAppStore('/test');
    expect(restoredStore.getState().kwyjibo.lightMode).toBe(true);

    unmount();
    render(
      <MemoryRouter basename="/k" initialEntries={['/k/test']}>
        <Provider store={restoredStore}>
          <Header confirmReset={vi.fn()} confirmingReset={false} />
        </Provider>
      </MemoryRouter>,
    );
    expect(document.documentElement).toHaveAttribute('data-theme', 'light');

    fireEvent.click(screen.getByTitle('Switch to dark mode'));
    expect(document.documentElement).toHaveAttribute('data-theme', 'dark');
    expect(restoredStore.getState().kwyjibo.lightMode).toBe(false);
  });

  it('uses configured header labels with defaults as fallback', () => {
    const store = createAppStore(
      '/custom-header',
      {
        homeMessage: 'Return home',
        lightModeMessage: 'Use {Dark|Light} theme',
        ratingMessage: 'Custom rating:',
        resetButton: 'Restart deck',
      },
      items,
    );
    store.dispatch(startDeck());

    render(
      <MemoryRouter basename="/k" initialEntries={['/k/custom-header']}>
        <Provider store={store}>
          <Header confirmReset={vi.fn()} confirmingReset={false} lastRating={5} />
        </Provider>
      </MemoryRouter>,
    );

    expect(screen.getByRole('link', { name: 'Kwyjibo' })).toHaveAttribute('title', 'Return home');
    expect(screen.getByTitle('Use Light theme')).toBeInTheDocument();
    expect(screen.getByTitle('Custom rating: 100%')).toBeInTheDocument();
    expect(screen.getByTitle('Restart deck')).toBeInTheDocument();
  });

  it('shows native language names, keeps language codes as values, and navigates to the selected language', () => {
    const store = createAppStore('/es', { language: 'es' }, items);

    render(
      <MemoryRouter basename="/k" initialEntries={['/k/es']}>
        <Provider store={store}>
          <Header confirmReset={vi.fn()} confirmingReset={false} />
          <CurrentPath />
        </Provider>
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Choose your language' }));

    const languageSelector = screen.getByRole('combobox', { name: 'Choose your language' });
    expect(languageSelector).toHaveValue('es');
    expect(screen.getByRole('option', { name: 'Español' })).toHaveValue('es');
    expect(screen.getByRole('option', { name: 'Français' })).toHaveValue('fr');

    fireEvent.change(languageSelector, { target: { value: 'fr' } });

    expect(screen.getByTestId('current-path')).toHaveTextContent('/fr');

    fireEvent.click(screen.getByRole('button', { name: 'Choose your language' }));
    fireEvent.change(screen.getByRole('combobox', { name: 'Choose your language' }), { target: { value: 'en' } });

    expect(screen.getByTestId('current-path')).toHaveTextContent('/');
  });
});
