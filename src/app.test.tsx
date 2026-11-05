import { fireEvent, render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { App } from './app';
import { loadItems } from './data/load-items';
import { CUSTOM_DATA_EXAMPLE } from './features/setup/constants';
import { createAppStore, rateItem, setCustomData, setLightMode, startQuiz } from './store';

vi.mock('./data/load-items', () => ({
  loadItems: vi.fn(),
  hasRemoteBlock: vi.fn((text: string) => {
    const blocks = text
      .split(/\r?\n\r?\n/)
      .map(block => block.trim())
      .filter(Boolean);

    return blocks.some(block => {
      const lines = block.split(/\r?\n/).map(line => line.trim()).filter(Boolean);
      return lines.length === 1 && /^https?:\/\//i.test(lines[0]);
    });
  }),
  parseCustomData: vi.fn(async (text: string) => {
    const { parseKData } = await import('./data/parse-k-data');
    return parseKData(text);
  }),
  resolveRemoteText: vi.fn(async (text: string) => text)
}));

const mockedLoadItems = vi.mocked(loadItems);

describe('App', () => {
  beforeEach(() => {
    window.localStorage.clear();
    delete document.documentElement.dataset.theme;
  });

  it('starts a quiz, reveals an answer, and advances after a confident rating', () => {
    const store = createAppStore('/test');
    store.dispatch(setCustomData(
      '# Test\n\nQuestion one?\nAnswer one.\n\nQuestion two?\nAnswer two.'
    ));

    render(
      <Provider store={store}>
        <App path="/test" />
      </Provider>
    );

    fireEvent.click(screen.getByRole('button', { name: 'Start' }));
    expect(screen.getByText(/Question (one|two)\?/)).toBeInTheDocument();
    expect(screen.queryByText('Answer one.')).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Reveal' }));
    expect(screen.getByText(/Answer (one|two)\./)).toBeInTheDocument();

    const currentId = store.getState().kwyjibo.currentId;
    const currentItem = store.getState().kwyjibo.items.find(item => item.id === currentId);
    const solution = currentItem?.solution;
    fireEvent.click(screen.getByTitle('Yes!'));

    expect(store.getState().kwyjibo.remainingIds).toHaveLength(1);
    expect(screen.queryByText(solution ?? '')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Reveal' })).toBeInTheDocument();
  });

  it('renders the reset confirmation and dispatches reset when accepted', async () => {
    mockedLoadItems.mockResolvedValue([{}]);
    const store = createAppStore('/test');
    store.dispatch(setCustomData(CUSTOM_DATA_EXAMPLE));
    store.dispatch(setLightMode(false));
    store.dispatch(startQuiz());
    store.dispatch(rateItem(5));

    render(
      <Provider store={store}>
        <App path="/test" />
      </Provider>
    );

    fireEvent.click(screen.getByTitle('Reset'));
    expect(screen.getByText('Really reset the cards?')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Yes' }));
    expect(await screen.findByText('What do you want to work on today?')).toBeInTheDocument();
    expect(mockedLoadItems).toHaveBeenCalledWith('/test');
    expect(store.getState().kwyjibo.lightMode).toBe(false);
  });

  it('cancels the reset confirmation without reloading the quiz', () => {
    const store = createAppStore('/test');
    store.dispatch(setCustomData('# Test\n\nQuestion one?\nAnswer one.'));
    store.dispatch(startQuiz());

    render(
      <Provider store={store}>
        <App path="/test" />
      </Provider>
    );

    fireEvent.click(screen.getByTitle('Reset'));
    expect(screen.getByText('Really reset the cards?')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'No' }));
    expect(screen.queryByText('Really reset the cards?')).not.toBeInTheDocument();
    expect(screen.getByText('Question one?')).toBeInTheDocument();
  });

  it('shows the mastery summary when all items have been rated', () => {
    const store = createAppStore('/test');
    store.dispatch(setCustomData('# Test\n\nQuestion one?\nAnswer one.\n\nQuestion two?\nAnswer two.'));
    store.dispatch(startQuiz());

    render(
      <Provider store={store}>
        <App path="/test" />
      </Provider>
    );

    fireEvent.click(screen.getByRole('button', { name: 'Reveal' }));
    fireEvent.click(screen.getByTitle('Yes!'));
    fireEvent.click(screen.getByRole('button', { name: 'Reveal' }));
    fireEvent.click(screen.getByTitle('Yes!'));

    expect(screen.getByText(/You mastered 2 cards with 100% accuracy over .*seconds\./)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Reset' })).toBeInTheDocument();
  });
});
