import {
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
  type RefObject,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setMosaicTile, type AppDispatch, type RootState } from '../../store';
import { Button } from '../../ui/button';
import { Icon } from '../../ui/icon';
import { MOSAIC_GRID_SIZE } from './constants';
import { getRandomColor } from './get-random-color';
import './style.scss';
import type { ActivePointer, SetHoveredTile } from './types';

const updateHoveredTile = (
  activePointer: RefObject<ActivePointer | null>,
  setHoveredTile: SetHoveredTile,
  tileKey: string | null,
) => {
  if (activePointer.current) {
    activePointer.current.tileKey = tileKey;
  }
  setHoveredTile(tileKey);
};

const setTile = (dispatch: AppDispatch, tileKey: string) => {
  dispatch(setMosaicTile({ tileKey, nextColor: getRandomColor() }));
};

const handleGridPointerMove = (
  event: ReactPointerEvent<HTMLDivElement>,
  activePointer: RefObject<ActivePointer | null>,
  setHoveredTile: SetHoveredTile,
) => {
  if (activePointer.current?.id !== event.pointerId) {
    return;
  }

  const elementUnderPointer =
    typeof document.elementFromPoint === 'function'
      ? document.elementFromPoint(event.clientX, event.clientY)
      : event.target instanceof Element
        ? event.target
        : null;
  const target = elementUnderPointer?.closest('[data-mosaic-tile]');
  const tileKey = target && event.currentTarget.contains(target) ? target.getAttribute('data-mosaic-tile') : null;
  updateHoveredTile(activePointer, setHoveredTile, tileKey);
};

const handleGridPointerUp = (
  event: ReactPointerEvent<HTMLDivElement>,
  activePointer: RefObject<ActivePointer | null>,
  setHoveredTile: SetHoveredTile,
  dispatch: AppDispatch,
) => {
  const pointer = activePointer.current;
  if (!pointer || pointer.id !== event.pointerId) {
    return;
  }

  if (pointer.tileKey) {
    setTile(dispatch, pointer.tileKey);
  }
  activePointer.current = null;
  setHoveredTile(pointer.type === 'touch' ? null : pointer.tileKey);
};

const handleGridPointerCancel = (activePointer: RefObject<ActivePointer | null>, setHoveredTile: SetHoveredTile) => {
  activePointer.current = null;
  setHoveredTile(null);
};

const handleTileClick = (event: ReactMouseEvent<HTMLButtonElement>, tileKey: string, dispatch: AppDispatch) => {
  if (event.detail === 0) {
    setTile(dispatch, tileKey);
  }
};

const handleTilePointerDown = (
  event: ReactPointerEvent<HTMLButtonElement>,
  tileKey: string,
  activePointer: RefObject<ActivePointer | null>,
  setHoveredTile: SetHoveredTile,
) => {
  activePointer.current = { id: event.pointerId, type: event.pointerType, tileKey };
  setHoveredTile(tileKey);
  event.currentTarget.setPointerCapture?.(event.pointerId);
};

const handleTilePointerEnter = (
  event: ReactPointerEvent<HTMLButtonElement>,
  tileKey: string,
  activePointer: RefObject<ActivePointer | null>,
  setHoveredTile: SetHoveredTile,
) => {
  if (activePointer.current?.id === event.pointerId || event.pointerType !== 'touch') {
    updateHoveredTile(activePointer, setHoveredTile, tileKey);
  }
};

const handleTilePointerLeave = (
  event: ReactPointerEvent<HTMLButtonElement>,
  tileKey: string,
  activePointer: RefObject<ActivePointer | null>,
  setHoveredTile: SetHoveredTile,
) => {
  if (activePointer.current?.id !== event.pointerId) {
    setHoveredTile((hovered) => (hovered === tileKey ? null : hovered));
  }
};

export const Mosaic = ({ code }: { code?: string }) => {
  const dispatch = useDispatch<AppDispatch>();
  const tiles = useSelector((state: RootState) => state.mosaic.tiles);
  const currentColor = useSelector((state: RootState) => state.mosaic.currentColor);
  const [hoveredTile, setHoveredTile] = useState<string | null>(null);
  const activePointer = useRef<ActivePointer | null>(null);

  return (
    <div className="mosaic">
      <div
        className="mosaic-grid"
        onPointerMove={(event) => handleGridPointerMove(event, activePointer, setHoveredTile)}
        onPointerUp={(event) => handleGridPointerUp(event, activePointer, setHoveredTile, dispatch)}
        onPointerCancel={() => handleGridPointerCancel(activePointer, setHoveredTile)}
      >
        {code}
        {Array.from({ length: MOSAIC_GRID_SIZE * 2 - 1 }, (_, y) => (
          <div className={`mosaic-row${y % 2 ? ' mosaic-row--offset' : ''}`} key={y}>
            {Array.from({ length: y % 2 ? MOSAIC_GRID_SIZE - 1 : MOSAIC_GRID_SIZE }, (_, x) => {
              const tileKey = `${x},${y}`;
              return (
                <Button
                  data-mosaic-tile={tileKey}
                  key={tileKey}
                  variant="text"
                  style={{ color: hoveredTile === tileKey ? currentColor : (tiles[tileKey] ?? 'transparent') }}
                  onClick={(event) => handleTileClick(event, tileKey, dispatch)}
                  onPointerDown={(event) => handleTilePointerDown(event, tileKey, activePointer, setHoveredTile)}
                  onPointerEnter={(event) => handleTilePointerEnter(event, tileKey, activePointer, setHoveredTile)}
                  onPointerLeave={(event) => handleTilePointerLeave(event, tileKey, activePointer, setHoveredTile)}
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
