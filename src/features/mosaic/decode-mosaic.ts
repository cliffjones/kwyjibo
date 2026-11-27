import { MOSAIC_TILE_CODE_LENGTH } from './encode-mosaic';
import { isValidMosaicCoordinate } from './is-valid-mosaic-coordinate';

export const decodeMosaic = (code: string): Record<string, string> | null => {
  if (code.length % MOSAIC_TILE_CODE_LENGTH !== 0) {
    return null;
  }

  const tiles: Record<string, string> = {};
  for (let offset = 0; offset < code.length; offset += MOSAIC_TILE_CODE_LENGTH) {
    const tileCode = code.slice(offset, offset + MOSAIC_TILE_CODE_LENGTH);
    const x = parseInt(tileCode[0], 36);
    const y = parseInt(tileCode[1], 36);
    const color = tileCode.slice(2);
    if (!isValidMosaicCoordinate(x, y) || !/^[0-9a-f]{6}$/i.test(color)) {
      return null;
    }
    tiles[`${x},${y}`] = `#${color.toLowerCase()}`;
  }
  return tiles;
};
