import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setMosaicTile, type AppDispatch, type RootState } from '../../store';
import { Button } from '../../ui/button';
import { Icon } from '../../ui/icon';
import { MOSAIC_GRID_SIZE } from './constants';
import { getRandomColor } from './get-random-color';
import './style.scss';

export const Mosaic = () => {
  const dispatch = useDispatch<AppDispatch>();
  const tiles = useSelector((state: RootState) => state.mosaic.tiles);
  const currentColor = useSelector((state: RootState) => state.mosaic.currentColor);
  const [hoveredTile, setHoveredTile] = useState<string | null>(null);

  return (
    <div className="mosaic">
      <div className="mosaic-grid">
        {Array.from({ length: MOSAIC_GRID_SIZE * 2 - 1 }, (_, y) => (
          <div className={`mosaic-row${y % 2 ? ' mosaic-row--offset' : ''}`} key={y}>
            {Array.from({ length: y % 2 ? MOSAIC_GRID_SIZE - 1 : MOSAIC_GRID_SIZE }, (_, x) => {
              const tileKey = `${x},${y}`;
              return (
                <Button
                  key={tileKey}
                  variant="text"
                  style={{ color: hoveredTile === tileKey ? currentColor : (tiles[tileKey] ?? 'transparent') }}
                  onClick={() => dispatch(setMosaicTile({ tileKey, nextColor: getRandomColor() }))}
                  onMouseEnter={() => setHoveredTile(tileKey)}
                  onMouseLeave={() => setHoveredTile(null)}
                >
                  <Icon name="tile" />
                </Button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};
