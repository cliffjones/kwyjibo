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
import { decodeMosaic } from './decode-mosaic';
import { getRandomColor } from './get-random-color';
import { MosaicEditorOptions } from './mosaic-editor-options';
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

export const Mosaic = ({ code = '', editable = false }: { code?: string; editable?: boolean }) => {
  const dispatch = useDispatch<AppDispatch>();
  const storedTiles = useSelector((state: RootState) => state.mosaic.tiles);
  const currentColor = useSelector((state: RootState) => state.mosaic.currentColor);
  const decodedTiles = code ? decodeMosaic(code) : null;
  const tiles = decodedTiles ?? storedTiles;
  const [hoveredTile, setHoveredTile] = useState<string | null>(null);
  const activePointer = useRef<ActivePointer | null>(null);

  return (
    <div className="mosaic">
      {editable && <MosaicEditorOptions />}

      <div
        className={`mosaic-grid${editable ? ' mosaic-grid--editable' : ''}`}
        onPointerMove={editable ? (event) => handleGridPointerMove(event, activePointer, setHoveredTile) : undefined}
        onPointerUp={
          editable ? (event) => handleGridPointerUp(event, activePointer, setHoveredTile, dispatch) : undefined
        }
        onPointerCancel={editable ? () => handleGridPointerCancel(activePointer, setHoveredTile) : undefined}
      >
        {Array.from({ length: MOSAIC_GRID_SIZE }, (_, y) => (
          <div className={`mosaic-row${y % 2 ? ' mosaic-row--offset' : ''}`} key={y}>
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
                  onClick={editable ? (event) => handleTileClick(event, tileKey, dispatch) : undefined}
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
