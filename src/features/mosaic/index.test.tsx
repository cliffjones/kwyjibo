import { fireEvent, render, screen } from '@testing-library/react';
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

  it('previews the current color on hover and persists clicked tile colors', () => {
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

    render(
      <Provider store={store}>
        <Mosaic />
      </Provider>,
    );

    const initialColor = store.getState().mosaic.currentColor;
    const tile = screen.getAllByRole('button')[0];
    expect(tile.style.color).toBe('transparent');

    fireEvent.mouseEnter(tile);
    expect(tile).toHaveStyle({ color: initialColor });

    vi.spyOn(Math, 'random').mockReturnValue(0.5);
    fireEvent.click(tile);
    expect(store.getState().mosaic).toEqual({
      tiles: { '0,0': initialColor },
      currentColor: '#800000',
    });
    expect(tile).toHaveStyle({ color: '#800000' });

    fireEvent.mouseLeave(tile);
    expect(tile).toHaveStyle({ color: initialColor });
    expect(JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? '{}').mosaic).toEqual(store.getState().mosaic);

    const restoredStore = createAppStore('/mosaic-color');
    expect(restoredStore.getState().mosaic).toEqual(store.getState().mosaic);
  });
});
