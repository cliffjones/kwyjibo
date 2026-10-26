import { fireEvent, render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { App } from './app';
import { CUSTOM_DATA_EXAMPLE } from './features/setup/constants';
import { createAppStore, rateConfidence, setCustomData, setLightMode, startQuiz } from './store';
import { loadItems } from './data/load-items';

jest.mock('./data/load-items', () => ({
  loadItems: jest.fn()
}));

const mockedLoadItems = jest.mocked(loadItems);

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
    store.dispatch(rateConfidence(5));

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
});
