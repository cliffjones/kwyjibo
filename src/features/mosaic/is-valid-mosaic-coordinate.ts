import { MOSAIC_GRID_SIZE } from './constants';

export const isValidMosaicCoordinate = (x: number, y: number) =>
  Number.isInteger(x) &&
  Number.isInteger(y) &&
  x >= 0 &&
  x < MOSAIC_GRID_SIZE - (y % 2) &&
  y >= 0 &&
  y < MOSAIC_GRID_SIZE;
