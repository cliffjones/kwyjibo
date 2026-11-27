import { NavigateFunction } from 'react-router';
import { MOSAIC_PATH } from '../../constants';
import { K_DELIMS } from '../../processing/constants';

export const hideMosaic = (path: string, navigate: NavigateFunction) => {
  const segments = path
    .split('/')
    .filter(Boolean)
    .filter((segment) => segment !== MOSAIC_PATH && !segment.startsWith(`${MOSAIC_PATH}${K_DELIMS.namespace}`));
  navigate({ pathname: `/${segments.join('/')}` });
};
