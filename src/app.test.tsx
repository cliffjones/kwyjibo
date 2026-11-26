import { act, fireEvent, render, screen, within } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router';
import { App } from './app';
import { LANG } from './constants';
import { ITEM_TYPES } from './processing/constants';
import { loadItems } from './processing/load-items';
import { createAppStore, respond, setCustomData, setLightMode, startDeck } from './store';

vi.mock('./processing/load-items', () => ({
  loadItems: vi.fn(),
  hasRemoteBlock: vi.fn((text: string) => {
    const blocks = text
      .split(/\r?\n\r?\n/)
      .map((block) => block.trim())
      .filter(Boolean);

    return blocks.some((block) => {
      const lines = block
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean);
      return lines.length === 1 && /^https?:\/\//i.test(lines[0]);
    });
  }),
  parseCustomData: vi.fn(async (text: string) => {
    const { parseFileData } = await import('./processing/parse-file-data');
    return parseFileData(text);
  }),
  resolveRemoteText: vi.fn(async (text: string) => text),
}));

vi.mock('react-chartjs-2', () => ({
  Line: () => <div data-testid="history-chart" />,
}));

const mockedLoadItems = vi.mocked(loadItems);

const renderApp = (path: string, store: ReturnType<typeof createAppStore>) =>
  render(
    <MemoryRouter basename="/k" initialEntries={[`/k${path}`]}>
      <Provider store={store}>
        <App path={path} />
      </Provider>
    </MemoryRouter>,
  );

describe('App', () => {
  beforeEach(() => {
    window.localStorage.clear();
    delete document.documentElement.dataset.theme;
  });

  it('starts a deck, reveals an answer, and advances after a confident rating', () => {
    const store = createAppStore('/test');
    store.dispatch(setCustomData('# Test\n\nQuestion one?\nAnswer one.\n\nQuestion two?\nAnswer two.'));

    renderApp('/test', store);

    fireEvent.click(screen.getByRole('button', { name: 'Start' }));
    expect(screen.getByText(/Question (one|two)\?/)).toBeInTheDocument();
    expect(screen.queryByText('Answer one.')).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Reveal' }));
    expect(screen.getByText(/Answer (one|two)\./)).toBeInTheDocument();

    const currentId = store.getState().kwyjibo.currentId;
    const currentItem = store.getState().kwyjibo.items.find((item) => item.id === currentId);
    const solution = currentItem?.solution;
    fireEvent.click(screen.getByTitle('Yes!'));

    expect(store.getState().kwyjibo.remainingIds).toHaveLength(1);
    expect(screen.queryByText(solution ?? '')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Reveal' })).toBeInTheDocument();
  });

  it('renders the reset confirmation and dispatches reset when accepted', async () => {
    mockedLoadItems.mockResolvedValue([{}]);
    const store = createAppStore('/test');
    store.dispatch(setCustomData(LANG.customDataPlaceholder));
    store.dispatch(setLightMode(false));
    store.dispatch(startDeck());
    store.dispatch(respond({ rating: 5 }));

    renderApp('/test', store);

    fireEvent.click(screen.getByTitle('Reset'));
    expect(screen.getByText('Really reset the cards?')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Yes' }));
    expect(await screen.findByText('What Do You Want to Work On Today?')).toBeInTheDocument();
    expect(mockedLoadItems).toHaveBeenCalledWith('/test', []);
    expect(store.getState().kwyjibo.lightMode).toBe(false);
    expect(store.getState().kwyjibo.history).toHaveLength(1);
  });

  it('records the selected quiz response in rating history', () => {
    const store = createAppStore('/quiz');
    store.dispatch(setCustomData('# Science\n\nWhich answer?\nCorrect\nIncorrect'));

    renderApp('/quiz', store);

    fireEvent.click(screen.getByRole('button', { name: 'Start' }));
    fireEvent.click(screen.getByRole('button', { name: 'Incorrect' }));

    expect(store.getState().kwyjibo.history[0]).toMatchObject({
      type: ITEM_TYPES.quiz,
      topic: 'Science',
      task: 'Which answer?',
      response: 'Incorrect',
      rating: 1,
    });
  });

  it('renders History as a separate card under main when history entries exist', async () => {
    const items = [
      {
        id: 0,
        type: ITEM_TYPES.question,
        topic: 'Science',
        task: 'Question?',
        solution: 'Answer.',
        responses: [],
        rating: 0,
      },
    ];
    const store = createAppStore('/history', {}, items);
    renderApp('/history', store);

    const main = screen.getByRole('main');
    const setupHeading = within(main).getByRole('heading', { name: LANG.heading });
    expect(within(main).queryByRole('heading', { name: 'Your Activity' })).not.toBeInTheDocument();

    act(() => {
      store.dispatch(respond({ rating: 4 }));
    });

    const historyHeading = await within(main).findByRole('heading', { name: 'Your Activity' });
    expect(within(main).getByTestId('history-chart')).toBeInTheDocument();
    expect(historyHeading.closest('.card')).not.toBe(setupHeading.closest('.card'));
  });

  it('cancels the reset confirmation without reloading the deck', () => {
    const store = createAppStore('/test');
    store.dispatch(setCustomData('# Test\n\nQuestion one?\nAnswer one.'));
    store.dispatch(startDeck());

    renderApp('/test', store);

    fireEvent.click(screen.getByTitle('Reset'));
    expect(screen.getByText('Really reset the cards?')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'No' }));
    expect(screen.queryByText('Really reset the cards?')).not.toBeInTheDocument();
    expect(screen.getByText('Question one?')).toBeInTheDocument();
  });

  it('shows the mastery summary when all items have been rated', () => {
    const store = createAppStore('/test');
    store.dispatch(setCustomData('# Test\n\nQuestion one?\nAnswer one.\n\nQuestion two?\nAnswer two.'));
    store.dispatch(startDeck());

    renderApp('/test', store);

    fireEvent.click(screen.getByRole('button', { name: 'Reveal' }));
    fireEvent.click(screen.getByTitle('Yes!'));
    fireEvent.click(screen.getByRole('button', { name: 'Reveal' }));
    fireEvent.click(screen.getByTitle('Yes!'));

    expect(screen.getByText(/You mastered 2 cards with 100% accuracy over .*seconds\./)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Reset' })).toBeInTheDocument();
  });

  it('uses configured quiz, confirmation, and results text', () => {
    const store = createAppStore('/custom-messages', {
      revealButton: 'Show answer',
      resetButton: 'Restart quiz',
      yesButton: 'Confirm',
      noButton: 'Keep studying',
      ratingPrompt: 'How did you do?',
      ratingLabel5: 'Excellent',
      resultsMessage: 'Completed {} cards with {}% accuracy in {}.',
    });
    store.dispatch(setCustomData('# Test\n\nQuestion?\nAnswer.'));

    renderApp('/custom-messages', store);

    fireEvent.click(screen.getByRole('button', { name: 'Start' }));
    fireEvent.click(screen.getByTitle('Restart quiz'));
    expect(screen.getByRole('button', { name: 'Confirm' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Keep studying' }));

    fireEvent.click(screen.getByRole('button', { name: 'Show answer' }));
    expect(screen.getByText('How did you do?')).toBeInTheDocument();
    fireEvent.click(screen.getByTitle('Excellent'));

    expect(screen.getByText(/Completed 1 cards with 100% accuracy in .*seconds\./)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Restart quiz' })).toBeInTheDocument();
  });
});
