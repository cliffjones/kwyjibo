import { MOSAIC_PATH } from '../../constants';
import { K_DELIMS } from '../../processing/constants';
import { encodeMosaic } from './encode-mosaic';

export const createMosaicUrl = (tiles: Record<string, string>, href: string) => {
  const url = new URL(href);
  const segments = url.pathname
    .split('/')
    .filter(Boolean)
    .filter(
      (segment) => segment !== MOSAIC_PATH && !segment.startsWith(`${MOSAIC_PATH}${K_DELIMS.namespace}`),
    );
  const code = encodeMosaic(tiles);
  url.pathname = `/${[...segments, `${MOSAIC_PATH}${K_DELIMS.namespace}${code}`].join('/')}`;
  return url.toString();
};
