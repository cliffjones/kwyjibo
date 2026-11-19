import type { HistoryItem } from '../../processing/types';
import { MAX_TIME_BUCKETS } from './constants';
import { getGraphData } from './get-graph-data';

const createHistoryItem = (topic: string, time: number, rating: number): HistoryItem => ({
  topic,
  time,
  rating,
  type: 'question',
  task: `Question at ${time}`,
});

describe('getGraphData', () => {
  it('returns no datasets for an empty history', () => {
    expect(getGraphData([], '#4080c0')).toEqual({ datasets: [] });
  });

  it('averages points that fall in the same time range for each label', () => {
    const data = getGraphData(
      [
        createHistoryItem('Biology', 0, 1),
        createHistoryItem('Biology', 50, 3),
        createHistoryItem('Biology', 10000, 5),
        createHistoryItem('Chemistry', 100, 2),
        createHistoryItem('Chemistry', 150, 4),
        createHistoryItem('Chemistry', 10100, 4),
      ],
      '#4080c0',
    );

    expect(data.datasets).toEqual([
      {
        label: 'Biology',
        data: [
          { x: 25, y: 20 },
          { x: 10000, y: 80 },
        ],
        borderColor: expect.any(String),
        backgroundColor: '#4080c0',
      },
      {
        label: 'Chemistry',
        data: [
          { x: 125, y: 40 },
          { x: 10100, y: 60 },
        ],
        borderColor: expect.any(String),
        backgroundColor: expect.any(String),
      },
    ]);
  });

  it('keeps each label within the configured maximum bucket count', () => {
    const history = Array.from({ length: MAX_TIME_BUCKETS + 1 }, (_, time) =>
      createHistoryItem('Biology', time, 5),
    );

    const data = getGraphData(history, '#4080c0');
    const points = data.datasets[0].data;

    expect(points.length).toBeLessThanOrEqual(MAX_TIME_BUCKETS);
    expect(points.at(-1)).toEqual({ x: MAX_TIME_BUCKETS, y: 80 });
  });

  it('averages points with identical timestamps into one point', () => {
    const data = getGraphData([createHistoryItem('Biology', 100, 2), createHistoryItem('Biology', 100, 4)], '#4080c0');

    expect(data.datasets[0].data).toEqual([{ x: 100, y: 40 }]);
  });

  it('uses the task as a label when a topic is missing', () => {
    const data = getGraphData([createHistoryItem('', 100, 4)], '#4080c0');

    expect(data.datasets[0]).toMatchObject({
      label: 'Question at 100',
      data: [{ x: 100, y: 60 }],
    });
  });
});
