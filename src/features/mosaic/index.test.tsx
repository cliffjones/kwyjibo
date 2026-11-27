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
        <Mosaic editable />
      </Provider>,
    );

    const rows = container.querySelectorAll('.mosaic-grid-row');
    expect(rows).toHaveLength(MOSAIC_GRID_SIZE);

    rows.forEach((row, index) => {
      expect(row.querySelectorAll('button')).toHaveLength(index % 2 ? MOSAIC_GRID_SIZE - 1 : MOSAIC_GRID_SIZE);
      expect(row.classList.contains('mosaic-grid-row--offset')).toBe(Boolean(index % 2));
    });
  });

  it('previews mouse hover, previews touch drags, and persists the tile on pointer-up', () => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ pointBalance: 2 }));
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
        <Mosaic editable />
      </Provider>,
    );

    expect(container.querySelector('.mosaic-grid')).toHaveClass('mosaic-grid--editable');
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
      colorOptions: ['#800000', '#800000', '#800000', '#800000'],
    });
    expect(store.getState().pointBalance).toBe(1);
    expect(draggedTile).toHaveStyle({ color: initialColor });

    expect(JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? '{}').mosaic).toEqual(store.getState().mosaic);

    const restoredStore = createAppStore('/mosaic-color');
    expect(restoredStore.getState().mosaic).toEqual(store.getState().mosaic);

    fireEvent.click(keyboardTile);
    expect(store.getState().mosaic.tiles['2,0']).toBe('#800000');
    expect(store.getState().pointBalance).toBe(0);
  });

  it('uses the streak to show color options and selects a painting color', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2024-01-03T00:00:00Z'));
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        activeSince: new Date('2024-01-01T00:00:00Z').getTime(),
        mosaic: {
          tiles: {},
          currentColor: '#111111',
          colorOptions: ['#111111', '#222222', '#333333', '#444444'],
        },
      }),
    );
    const store = createAppStore('/mosaic-options');
    const { container } = render(
      <Provider store={store}>
        <Mosaic editable />
      </Provider>,
    );

    const options = container.querySelectorAll('.mosaic-options button');
    expect(options).toHaveLength(2);
    expect(options[0]).toHaveClass('button--selected');
    expect(options[1]).not.toHaveClass('button--selected');
    fireEvent.click(options[1]);
    expect(store.getState().mosaic.currentColor).toBe('#222222');
    vi.useRealTimers();
  });

  it('is read-only without hover or drag previews when no tile is available', () => {
    const store = createAppStore('/mosaic-read-only');
    const { container } = render(
      <Provider store={store}>
        <Mosaic />
      </Provider>,
    );
    const tile = container.querySelector<HTMLButtonElement>('.mosaic-grid button')!;

    expect(tile).toHaveAttribute('aria-disabled', 'true');
    expect(tile).not.toBeDisabled();
    fireEvent.pointerEnter(tile, { pointerType: 'mouse' });
    fireEvent.pointerDown(tile, { pointerType: 'touch', pointerId: 1 });
    fireEvent.click(tile);

    expect(tile.style.color).toBe('transparent');
    expect(store.getState().mosaic.tiles).toEqual({});
    expect(store.getState().pointBalance).toBe(0);
  });

  it('renders decoded shared tiles without storing them', () => {
    const store = createAppStore('/mosaic-shared');
    const { container } = render(
      <Provider store={store}>
        <Mosaic code="00123456" editable />
      </Provider>,
    );

    expect(container.querySelector<HTMLButtonElement>('[data-mosaic-tile="0,0"]')).toHaveStyle({
      color: '#123456',
    });
    expect(store.getState().mosaic.tiles).toEqual({});
  });
});
