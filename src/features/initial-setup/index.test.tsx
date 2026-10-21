import { fireEvent, render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { createAppStore, setCustomData } from '../../store';
import type { QuizItem } from '../../store/types';
import { InitialSetup } from './index';

const items: QuizItem[] = [
  { id: 0, topic: 'Zulu', question: 'Question Z?', answer: 'Answer Z.', confidence: 0 },
  { id: 1, topic: 'Alpha', question: 'Question A?', answer: 'Answer A.', confidence: 0 },
  { id: 2, topic: 'Alpha', question: 'Another question A?', answer: 'Another answer A.', confidence: 0 }
];

describe('InitialSetup', () => {
  it('lists unique topics in order, updates selection, and starts the quiz', () => {
    const store = createAppStore('/test', items);
    store.dispatch(setCustomData(''));
    const handleTextChange = jest.fn();

    render(
      <Provider store={store}>
        <InitialSetup customData="custom quiz" handleTextChange={handleTextChange} />
      </Provider>
    );

    expect(screen.getAllByRole('checkbox').map(option => option.parentElement?.textContent))
      .toEqual(['Alpha (2)', 'Zulu']);
    expect(screen.getByLabelText('Custom card data:')).toHaveValue('custom quiz');
    expect(screen.getByRole('button', { name: 'Start' })).toBeEnabled();

    fireEvent.click(screen.getByRole('checkbox', { name: 'Alpha (2)' }));
    fireEvent.change(screen.getByLabelText('Custom card data:'), {
      target: { value: 'updated quiz' }
    });
    expect(store.getState().kwyjibo.selectedTopics).toEqual(['Zulu']);
    expect(handleTextChange).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByRole('button', { name: 'Start' }));
    expect(store.getState().kwyjibo.initializing).toBe(false);
    expect(store.getState().kwyjibo.items.map(item => item.topic)).toEqual(['Zulu']);
  });

  it('disables Start only when custom data and available topics are both empty', () => {
    const store = createAppStore('/empty');
    const handleTextChange = jest.fn();
    const { rerender } = render(
      <Provider store={store}>
        <InitialSetup customData="" handleTextChange={handleTextChange} />
      </Provider>
    );

    expect(screen.getByRole('button', { name: 'Start' })).toBeDisabled();

    rerender(
      <Provider store={store}>
        <InitialSetup customData="A custom quiz" handleTextChange={handleTextChange} />
      </Provider>
    );

    expect(screen.getByRole('button', { name: 'Start' })).toBeEnabled();
  });
});
