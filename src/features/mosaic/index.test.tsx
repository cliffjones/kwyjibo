import { fireEvent, render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { createAppStore } from '../../store';
import { STORAGE_KEY } from '../../store/constants';
import { MOSAIC_GRID_SIZE } from './constants';
import { Mosaic } from './index';

describe('Mosaic', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders the configured tile rows with alternating column counts', () => {
    const store = createAppStore('/mosaic');
    const { container } = render(
      <Provider store={store}>
        <Mosaic />
      </Provider>,
    );

    const rows = container.querySelectorAll('.mosaic-row');
    expect(rows).toHaveLength(MOSAIC_GRID_SIZE * 2 - 1);

    rows.forEach((row, index) => {
      expect(row.querySelectorAll('button')).toHaveLength(index % 2 ? MOSAIC_GRID_SIZE - 1 : MOSAIC_GRID_SIZE);
      expect(row.classList.contains('mosaic-row--offset')).toBe(Boolean(index % 2));
    });
  });

  it('previews mouse hover, previews touch drags, and persists the tile on pointer-up', () => {
    const store = createAppStore('/mosaic-color', {}, [
      {
        id: 0,
        type: 'question',
        topic: 'Science',
        task: 'Question?',
        solution: 'Answer.',
        responses: [],
        rating: 0,
      },
    ]);

    const { container } = render(
      <Provider store={store}>
        <Mosaic />
      </Provider>,
    );

    const initialColor = store.getState().mosaic.currentColor;
    const tiles = container.querySelectorAll<HTMLButtonElement>('.mosaic-grid button');
    const tile = tiles[0];
    const draggedTile = tiles[1];
    const keyboardTile = tiles[2];
    expect(tile.style.color).toBe('transparent');

    fireEvent.pointerEnter(tile, { pointerType: 'mouse' });
    expect(tile).toHaveStyle({ color: initialColor });
    fireEvent.pointerLeave(tile, { pointerType: 'mouse' });
    expect(tile.style.color).toBe('transparent');

    vi.spyOn(Math, 'random').mockReturnValue(0.5);
    fireEvent.pointerDown(tile, { pointerType: 'touch', pointerId: 1 });
    expect(tile).toHaveStyle({ color: initialColor });

    fireEvent.pointerMove(draggedTile, { pointerType: 'touch', pointerId: 1 });
    expect(draggedTile).toHaveStyle({ color: initialColor });

    fireEvent.pointerUp(document.querySelector('.mosaic-grid')!, { pointerType: 'touch', pointerId: 1 });
    expect(store.getState().mosaic).toEqual({
      tiles: { '1,0': initialColor },
      currentColor: '#800000',
    });
    expect(draggedTile).toHaveStyle({ color: initialColor });

    expect(JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? '{}').mosaic).toEqual(store.getState().mosaic);

    const restoredStore = createAppStore('/mosaic-color');
    expect(restoredStore.getState().mosaic).toEqual(store.getState().mosaic);

    fireEvent.click(keyboardTile);
    expect(store.getState().mosaic.tiles['2,0']).toBe('#800000');
  });
});
