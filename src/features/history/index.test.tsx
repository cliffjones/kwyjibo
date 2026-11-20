import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { ITEM_TYPES } from '../../processing/constants';
import type { TaskItem } from '../../processing/types';
import { createAppStore, respond, setLightMode } from '../../store';
import { formatTime } from './format-time';
import { History } from './index';
import type { GraphData, GraphOptions } from './types';

vi.mock('chart.js', () => ({
  Chart: {
    register: vi.fn(),
    defaults: {
      plugins: {
        legend: {
          labels: {
            generateLabels: () => [{ lineWidth: 1 }],
          },
        },
      },
    },
  },
  Legend: {},
  LineController: {},
  LineElement: {},
  LinearScale: {},
  PointElement: {},
  Tooltip: {},
}));

vi.mock('react-chartjs-2', () => ({
  Line: ({ data, options }: { data: GraphData; options: GraphOptions }) => {
    const dataset = data.datasets[0];
    const point = dataset?.data[0];
    const xTicks = options.scales?.x?.ticks;
    const callbacks = options.plugins?.tooltip?.callbacks;
    const legendLabels = options.plugins?.legend?.labels;
    const title = callbacks?.title?.call({} as never, [{ parsed: { x: point?.x, y: point?.y } } as never]);
    const label = callbacks?.label?.call(
      {} as never,
      {
        dataset: { label: dataset?.label },
        parsed: { x: point?.x, y: point?.y },
      } as never,
    );
    const legendItems = legendLabels?.generateLabels?.({} as never);
    const localTime = xTicks?.callback?.call({} as never, point?.x ?? 0, 0, [] as never);

    return (
      <>
        <output data-testid="history-chart">{JSON.stringify(dataset?.data)}</output>
        <output data-testid="history-local-time">{String(localTime ?? '')}</output>
        <output data-testid="history-tooltip-title">{String(title ?? '')}</output>
        <output data-testid="history-tooltip-label">{String(label ?? '')}</output>
        <output data-testid="history-legend">{JSON.stringify(legendItems)}</output>
      </>
    );
  },
}));

describe('History', () => {
  const items: TaskItem[] = [
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

  it('plots ratings and formats the chart labels and tooltips', () => {
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
    expect(plottedPoints).toEqual([{ x: time, y: 75 }]);
    expect(screen.getByTestId('history-local-time')).toHaveTextContent(formatTime(time, true));
    expect(screen.getByTestId('history-tooltip-title')).toHaveTextContent(formatTime(time));
    expect(screen.getByTestId('history-tooltip-label')).toHaveTextContent('Science: 75');
    expect(JSON.parse(screen.getByTestId('history-legend').textContent ?? '[]')).toEqual([{ lineWidth: 0 }]);
  });

  it('uses the configured heading in light mode', () => {
    const store = createAppStore('/history-light', { historyHeading: 'Activity' }, items);
    store.dispatch(setLightMode(true));
    store.dispatch(respond({ rating: 4 }));

    render(
      <Provider store={store}>
        <History />
      </Provider>,
    );

    expect(screen.getByRole('heading', { name: 'Activity' })).toBeInTheDocument();
    expect(screen.getByTestId('history-chart')).toBeInTheDocument();
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
