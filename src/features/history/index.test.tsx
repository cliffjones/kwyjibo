import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import type { TaskItem } from '../../processing/types';
import { createAppStore, respond } from '../../store';
import { History } from './index';

vi.mock('react-chartjs-2', () => ({
  Line: ({
    data,
    options,
  }: {
    data: { datasets: { data: { x: number; y: number }[] }[] };
    options: { scales: { x: { ticks: { callback: (value: number) => string } } } };
  }) => (
    <>
      <output data-testid="history-chart">{JSON.stringify(data.datasets[0].data)}</output>
      <output data-testid="history-local-time">{options.scales.x.ticks.callback(data.datasets[0].data[0].x)}</output>
    </>
  ),
}));

describe('History', () => {
  it('plots ratings against their timestamps in local time', () => {
    const items: TaskItem[] = [
      { id: 0, type: 'question', topic: 'Science', task: 'Question?', solution: 'Answer.', responses: [], rating: 0 },
    ];
    const store = createAppStore('/history-chart', {}, items);
    store.dispatch(respond({ rating: 4 }));

    render(
      <Provider store={store}>
        <History />
      </Provider>,
    );

    expect(screen.getByRole('heading', { name: 'Your Activity' })).toBeInTheDocument();
    const plottedPoints = JSON.parse(screen.getByTestId('history-chart').textContent ?? '[]');
    const time = store.getState().kwyjibo.history[0].time;
    expect(plottedPoints).toEqual([{ x: time, y: 4 }]);
    expect(screen.getByTestId('history-local-time')).toHaveTextContent(
      new Date(time)
        .toLocaleString(undefined, {
          month: 'numeric',
          day: 'numeric',
          hour: 'numeric',
          minute: '2-digit',
          hour12: false,
        })
        .replace(',', ''),
    );
  });

  it('renders no card when history is empty', () => {
    const store = createAppStore('/empty-history');
    const { container } = render(
      <Provider store={store}>
        <History />
      </Provider>,
    );

    expect(container.querySelector('.card')).not.toBeInTheDocument();
  });
});
