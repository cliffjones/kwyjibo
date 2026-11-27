import { MOSAIC_GRID_SIZE } from './constants';
import { isValidMosaicCoordinate } from './is-valid-mosaic-coordinate';

describe('isValidMosaicCoordinate', () => {
  it('accepts coordinates in even and offset rows', () => {
    expect(isValidMosaicCoordinate(0, 0)).toBe(true);
    expect(isValidMosaicCoordinate(MOSAIC_GRID_SIZE - 2, 1)).toBe(true);
  });

  it('rejects coordinates outside the row or grid', () => {
    expect(isValidMosaicCoordinate(MOSAIC_GRID_SIZE, 0)).toBe(false);
    expect(isValidMosaicCoordinate(MOSAIC_GRID_SIZE - 1, 1)).toBe(false);
    expect(isValidMosaicCoordinate(0, MOSAIC_GRID_SIZE)).toBe(false);
    expect(isValidMosaicCoordinate(0.5, 0)).toBe(false);
  });
});
