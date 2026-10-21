import { fireEvent, render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { createAppStore, startQuiz } from '../../store';
import { getStorageKey } from '../../store/get-storage-key';
import type { QuizItem } from '../../store/types';
import { Header } from './index';

const items: QuizItem[] = [
  { id: 0, topic: 'Zulu', question: 'Question?', answer: 'Answer.', confidence: 0 }
];

describe('Header', () => {
  beforeEach(() => {
    window.localStorage.clear();
    delete document.documentElement.dataset.theme;
  });

  it('shows card counts and calls the reset confirmation handler', () => {
    const store = createAppStore('/test', items);
    store.dispatch(startQuiz());
    const confirmReset = jest.fn();

    render(
      <Provider store={store}>
        <Header confirmReset={confirmReset} confirmingReset={false} />
      </Provider>
    );

    expect(screen.getByText('1 card loaded')).toBeInTheDocument();
    fireEvent.click(screen.getByTitle('Reset'));
    expect(confirmReset).toHaveBeenCalledTimes(1);
  });

  it('toggles and persists the global color theme from the header', () => {
    const store = createAppStore('/test');

    const { unmount } = render(
      <Provider store={store}>
        <Header confirmReset={jest.fn()} confirmingReset={false} />
      </Provider>
    );

    fireEvent.click(screen.getByTitle('Switch to Light Mode'));

    expect(document.documentElement).toHaveAttribute('data-theme', 'light');
    expect(store.getState().kwyjibo.lightMode).toBe(true);
    expect(JSON.parse(window.localStorage.getItem(getStorageKey('/test')) ?? '{}').lightMode).toBe(true);

    const restoredStore = createAppStore('/test');
    expect(restoredStore.getState().kwyjibo.lightMode).toBe(true);

    unmount();
    render(
      <Provider store={restoredStore}>
        <Header confirmReset={jest.fn()} confirmingReset={false} />
      </Provider>
    );
    expect(document.documentElement).toHaveAttribute('data-theme', 'light');

    fireEvent.click(screen.getByTitle('Switch to Dark Mode'));
    expect(document.documentElement).toHaveAttribute('data-theme', 'dark');
    expect(restoredStore.getState().kwyjibo.lightMode).toBe(false);
  });
});
