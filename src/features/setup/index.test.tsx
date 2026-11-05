import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import type { TaskItem } from '../../data/types';
import { createAppStore, setCustomData } from '../../store';
import { Setup } from './index';

const items: TaskItem[] = [
  { id: 0, type: 'quiz', topic: 'Zulu', task: 'Question Z?', solution: 'Answer Z.', responses: [], rating: 0 },
  { id: 1, type: 'quiz', topic: 'Alpha', task: 'Question A?', solution: 'Answer A.', responses: [], rating: 0 },
  { id: 2, type: 'quiz', topic: 'Alpha', task: 'Another question A?', solution: 'Another answer A.', responses: [], rating: 0 }
];

describe('Setup', () => {
  it('lists unique topics in order, updates selection, and starts the quiz', async () => {
    const store = createAppStore('/test', {}, items);
    store.dispatch(setCustomData(''));
    const handleTextChange = vi.fn();

    render(
      <Provider store={store}>
        <Setup customData="custom quiz" handleTextChange={handleTextChange} />
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

    await waitFor(() => {
      expect(store.getState().kwyjibo.initializing).toBe(false);
      expect(store.getState().kwyjibo.items.map(item => item.topic)).toEqual(['Zulu']);
    });
  });

  it('disables Start only when custom data and available topics are both empty', () => {
    const store = createAppStore('/empty');
    const handleTextChange = vi.fn();
    const { rerender } = render(
      <Provider store={store}>
        <Setup customData="" handleTextChange={handleTextChange} />
      </Provider>
    );

    expect(screen.getByRole('button', { name: 'Start' })).toBeDisabled();

    rerender(
      <Provider store={store}>
        <Setup customData="A custom quiz" handleTextChange={handleTextChange} />
      </Provider>
    );

    expect(screen.getByRole('button', { name: 'Start' })).toBeEnabled();
  });

  it('loads remote custom data before starting without replacing the user-entered URL', async () => {
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue({
      ok: true,
      status: 200,
      headers: new Headers({ 'content-type': 'text/plain' }),
      text: async () => '# Remote\n\nQuestion?\nAnswer.'
    } as Response);
    vi.stubGlobal('fetch', fetchMock);

    const store = createAppStore('/remote');
    store.dispatch(setCustomData('https://example.com/remote.k'));
    render(
      <Provider store={store}>
        <Setup customData="https://example.com/remote.k" handleTextChange={vi.fn()} />
      </Provider>
    );

    fireEvent.click(screen.getByRole('button', { name: 'Start' }));

    await waitFor(() => {
      expect(store.getState().kwyjibo.initializing).toBe(false);
    });

    expect(fetchMock).toHaveBeenCalledWith('https://example.com/remote.k');
    expect(store.getState().kwyjibo.customData).toBe('https://example.com/remote.k');
    expect(store.getState().kwyjibo.resolvedCustomData).toContain('Question?');
    expect(screen.getByLabelText('Custom card data:')).toHaveValue('https://example.com/remote.k');
    expect(store.getState().kwyjibo.items[0]).toMatchObject({
      topic: 'Remote',
      task: 'Question?',
      solution: 'Answer.'
    });
  });

  it('parses a remote block separately from surrounding custom data', async () => {
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue({
      ok: true,
      status: 200,
      headers: new Headers({ 'content-type': 'text/plain' }),
      text: async () => 'Brush and floss your teeth.\nDrink some water.\nEat a healthy meal.'
    } as Response);
    vi.stubGlobal('fetch', fetchMock);

    const store = createAppStore('/remote-mixed');
    store.dispatch(setCustomData('# Before\n\nWhat should you do?\nDrink water.\n\nhttps://example.com/remote.k\n\n# After\n\nHow are you?\nGreat.'));
    render(
      <Provider store={store}>
        <Setup customData="# Before\n\nWhat should you do?\nDrink water.\n\nhttps://example.com/remote.k\n\n# After\n\nHow are you?\nGreat." handleTextChange={vi.fn()} />
      </Provider>
    );

    fireEvent.click(screen.getByRole('button', { name: 'Start' }));

    await waitFor(() => {
      expect(store.getState().kwyjibo.initializing).toBe(false);
    });

    expect(store.getState().kwyjibo.customData).toContain('https://example.com/remote.k');
    expect(store.getState().kwyjibo.items.map(item => item.task)).toEqual(expect.arrayContaining([
      'What should you do?',
      'Brush and floss your teeth.',
      'Drink some water.',
      'Eat a healthy meal.',
      'How are you?'
    ]));
    expect(store.getState().kwyjibo.items).not.toEqual(expect.arrayContaining([
      expect.objectContaining({ task: 'Brush and floss your teeth.', responses: expect.arrayContaining([
        expect.objectContaining({ text: 'Drink some water.' })
      ]) })
    ]));
  });
});
