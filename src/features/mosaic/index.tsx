import {
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
  type RefObject,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { countDaysSince } from '../../processing/count-days-since';
import { setMosaicTile, type AppDispatch, type RootState } from '../../store';
import { Button } from '../../ui/button';
import { Icon } from '../../ui/icon';
import { MAX_MOSAIC_COLOR_OPTIONS, MIN_MOSAIC_COLOR_OPTIONS, MOSAIC_GRID_SIZE } from './constants';
import { decodeMosaic } from './decode-mosaic';
import { getRandomColor } from './get-random-color';
import { MosaicOptions } from './mosaic-options';
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

const setTile = (dispatch: AppDispatch, tileKey: string, colorOptionCount: number) => {
  dispatch(
    setMosaicTile({
      tileKey,
      colorOptions: Array.from({ length: colorOptionCount }, getRandomColor),
    }),
  );
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
  colorOptionCount: number,
) => {
  const pointer = activePointer.current;
  if (!pointer || pointer.id !== event.pointerId) {
    return;
  }

  if (pointer.tileKey) {
    setTile(dispatch, pointer.tileKey, colorOptionCount);
  }
  activePointer.current = null;
  setHoveredTile(pointer.type === 'touch' ? null : pointer.tileKey);
};

const handleGridPointerCancel = (activePointer: RefObject<ActivePointer | null>, setHoveredTile: SetHoveredTile) => {
  activePointer.current = null;
  setHoveredTile(null);
};

const handleTileClick = (
  event: ReactMouseEvent<HTMLButtonElement>,
  tileKey: string,
  dispatch: AppDispatch,
  colorOptionCount: number,
) => {
  if (event.detail === 0) {
    setTile(dispatch, tileKey, colorOptionCount);
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

export const Mosaic = ({ code = '', editable = false }: { code?: string; editable?: boolean }) => {
  const dispatch = useDispatch<AppDispatch>();
  const storedTiles = useSelector((state: RootState) => state.mosaic.tiles);
  const currentColor = useSelector((state: RootState) => state.mosaic.currentColor);
  const colorOptionCount = useSelector((state: RootState) =>
    Math.max(MIN_MOSAIC_COLOR_OPTIONS, Math.min(countDaysSince(state.activeSince), MAX_MOSAIC_COLOR_OPTIONS)),
  );
  const decodedTiles = code ? decodeMosaic(code) : null;
  const tiles = decodedTiles ?? storedTiles;
  const [hoveredTile, setHoveredTile] = useState<string | null>(null);
  const activePointer = useRef<ActivePointer | null>(null);

  return (
    <div className="mosaic">
      {editable && <MosaicOptions />}

      <div
        className={`mosaic-grid${editable ? ' mosaic-grid--editable' : ''}`}
        onPointerMove={editable ? (event) => handleGridPointerMove(event, activePointer, setHoveredTile) : undefined}
        onPointerUp={
          editable
            ? (event) => handleGridPointerUp(event, activePointer, setHoveredTile, dispatch, colorOptionCount)
            : undefined
        }
        onPointerCancel={editable ? () => handleGridPointerCancel(activePointer, setHoveredTile) : undefined}
      >
        {Array.from({ length: MOSAIC_GRID_SIZE }, (_, y) => (
          <div className={`mosaic-grid-row${y % 2 ? ' mosaic-grid-row--offset' : ''}`} key={y}>
            {Array.from({ length: y % 2 ? MOSAIC_GRID_SIZE - 1 : MOSAIC_GRID_SIZE }, (_, x) => {
              const tileKey = `${x},${y}`;
              return (
                <Button
                  aria-disabled={!editable}
                  data-mosaic-tile={tileKey}
                  key={tileKey}
                  variant="text"
                  style={{
                    color: editable && hoveredTile === tileKey ? currentColor : (tiles[tileKey] ?? 'transparent'),
                  }}
                  onClick={
                    editable ? (event) => handleTileClick(event, tileKey, dispatch, colorOptionCount) : undefined
                  }
                  onPointerDown={
                    editable
                      ? (event) => handleTilePointerDown(event, tileKey, activePointer, setHoveredTile)
                      : undefined
                  }
                  onPointerEnter={
                    editable
                      ? (event) => handleTilePointerEnter(event, tileKey, activePointer, setHoveredTile)
                      : undefined
                  }
                  onPointerLeave={
                    editable
                      ? (event) => handleTilePointerLeave(event, tileKey, activePointer, setHoveredTile)
                      : undefined
                  }
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
