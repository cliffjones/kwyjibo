import type { HistoryItem } from '../../processing/types';
import { averagePoints } from './average-points';
import { MAX_TIME_BUCKETS } from './constants';
import { itemToPoint } from './item-to-point';
import './style.scss';
import type { Point } from './types';

export const bucketItems = (items: HistoryItem[]): Point[] => {
  const points = items.map(itemToPoint).sort((first, second) => first.x - second.x);
  const firstTime = points[0].x;
  const timeRange = points[points.length - 1].x - firstTime;

  if (timeRange === 0) {
    return [averagePoints(points)];
  }

  const buckets: Point[][] = Array.from({ length: MAX_TIME_BUCKETS }, () => []);
  points.forEach((point) => {
    const bucketIndex = Math.min(
      Math.floor(((point.x - firstTime) / timeRange) * MAX_TIME_BUCKETS),
      MAX_TIME_BUCKETS - 1,
    );
    buckets[bucketIndex].push(point);
  });

  return buckets.filter((bucket) => bucket.length).map(averagePoints);
};
