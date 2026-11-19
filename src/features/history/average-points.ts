import './style.scss';
import type { Point } from './types';

export const averagePoints = (points: Point[]): Point => {
  const total = points.reduce((result, point) => ({ x: result.x + point.x, y: result.y + point.y }), { x: 0, y: 0 });
  return {
    x: Math.round(total.x / points.length),
    y: Math.round((total.y / points.length) * 100) / 100,
  };
};
