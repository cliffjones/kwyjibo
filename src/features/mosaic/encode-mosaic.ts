import { isValidMosaicCoordinate } from './is-valid-mosaic-coordinate';

export const MOSAIC_TILE_CODE_LENGTH = 8;

export const encodeMosaic = (tiles: Record<string, string>) =>
  Object.entries(tiles)
    .map(([key, color]) => {
      const [x, y] = key.split(',').map(Number);
      if (!isValidMosaicCoordinate(x, y) || !/^#[0-9a-f]{6}$/i.test(color)) {
        return null;
      }
      return {
        x,
        y,
        code: `${x.toString(36)}${y.toString(36)}${color.slice(1).toLowerCase()}`,
      };
    })
    .filter((tile): tile is NonNullable<typeof tile> => tile != null)
    .sort((a, b) => a.y - b.y || a.x - b.x)
    .map(({ code }) => code)
    .join('');
