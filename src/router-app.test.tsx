import { cleanup, render, screen } from '@testing-library/react';
import { useLocation, useNavigate, type NavigateOptions, type To } from 'react-router';
import { ITEM_TYPES } from './processing/constants';
import { loadItems } from './processing/load-items';
import type { ConfigData, TaskItem } from './processing/types';
import { RouterApp } from './router-app';

vi.mock('react-router', () => ({
  useLocation: vi.fn(),
  useNavigate: vi.fn(() => vi.fn()),
}));

vi.mock('./processing/load-items', () => ({
  loadItems: vi.fn(),
}));

const mockedUseLocation = vi.mocked(useLocation);
const mockedUseNavigate = vi.mocked(useNavigate);
const mockedLoadItems = vi.mocked(loadItems);
let mockedNavigate: ReturnType<typeof vi.fn<(to: To | number, options?: NavigateOptions) => void>>;

const items: TaskItem[] = [
  {
    id: 0,
    type: ITEM_TYPES.quiz,
    topic: 'Science',
    task: 'What is a cell?',
    solution: 'A basic unit of life.',
    responses: [],
    rating: 0,
  },
];

describe('RouterApp', () => {
  beforeEach(() => {
    window.localStorage.clear();
    document.documentElement.lang = 'en';
    document.documentElement.dir = 'ltr';
    mockedUseLocation.mockReturnValue({ pathname: '/science' } as ReturnType<typeof useLocation>);
    mockedNavigate = vi.fn();
    mockedUseNavigate.mockReturnValue((to: To | number, options?: NavigateOptions) => mockedNavigate(to, options));
  });

  afterEach(() => {
    cleanup();
  });

  it('shows loading state before rendering the loaded application', async () => {
    let resolveItems!: (items: [ConfigData, ...TaskItem[]]) => void;
    mockedLoadItems.mockReturnValue(
      new Promise((resolve) => {
        resolveItems = resolve;
      }),
    );

    render(<RouterApp />);
    expect(screen.getByText('Loading…')).toBeInTheDocument();

    resolveItems([{} as ConfigData, ...items]);
    expect(await screen.findByRole('heading', { name: 'Kwyjibo' })).toBeInTheDocument();
    expect(screen.getByText('What Do You Want to Work On Today?')).toBeInTheDocument();
    expect(mockedLoadItems).toHaveBeenCalledWith('/science', []);
  });

  it('removes token segments from the route and persists non-empty tokens globally', async () => {
    window.localStorage.setItem('kwyjibo', JSON.stringify({ tokens: ['saved'], preference: 'compact' }));
    mockedUseLocation.mockReturnValue({
      pathname: '/=alpha/dev/=/=beta/=alpha',
      search: '?mode=quick',
      hash: '#cards',
    } as ReturnType<typeof useLocation>);
    mockedLoadItems.mockResolvedValue([{}, ...items]);

    const { rerender } = render(<RouterApp />);

    expect(mockedNavigate).toHaveBeenCalledWith(
      { pathname: '/dev', search: '?mode=quick', hash: '#cards' },
      { replace: true },
    );
    expect(mockedLoadItems).not.toHaveBeenCalled();
    expect(JSON.parse(window.localStorage.getItem('kwyjibo') ?? 'null')).toEqual({
      tokens: ['saved', 'alpha', 'beta'],
      preference: 'compact',
    });

    mockedUseLocation.mockReturnValue({ pathname: '/dev' } as ReturnType<typeof useLocation>);
    rerender(<RouterApp />);

    expect(await screen.findByRole('heading', { name: 'Kwyjibo' })).toBeInTheDocument();
    expect(mockedLoadItems).toHaveBeenCalledWith('/dev', ['saved', 'alpha', 'beta']);
    expect(JSON.parse(window.localStorage.getItem('kwyjibo:dev') ?? 'null').sourcePath).toBe('/dev');
  });

  it('passes padded Base64URL tokens through from the browser path', async () => {
    const token = 'u_qGpgzlqkxA1sZns1tPNRi8o6XI9ZFqu2PxwCZR60Y=';
    mockedUseLocation.mockReturnValue({ pathname: `/=${token}/test-private` } as ReturnType<typeof useLocation>);
    mockedLoadItems.mockResolvedValue([{}, ...items]);

    const { rerender } = render(<RouterApp />);

    expect(JSON.parse(window.localStorage.getItem('kwyjibo') ?? 'null').tokens).toEqual([token]);
    mockedUseLocation.mockReturnValue({ pathname: '/test-private' } as ReturnType<typeof useLocation>);
    rerender(<RouterApp />);

    expect(await screen.findByRole('heading', { name: 'Kwyjibo' })).toBeInTheDocument();
    expect(mockedLoadItems).toHaveBeenCalledWith('/test-private', [token]);
  });

  it('sets the document language from the loaded deck config', async () => {
    mockedLoadItems.mockResolvedValue([{ language: 'fr' }, ...items]);

    render(<RouterApp />);

    expect(await screen.findByRole('heading', { name: 'Kwyjibo' })).toBeInTheDocument();
    expect(document.documentElement.lang).toBe('fr');
    expect(document.documentElement.dir).toBe('ltr');
  });

  it.each(['arb', 'arz', 'fa', 'he', 'lah', 'ur'])('sets right-to-left document direction for %s', async (language) => {
    mockedLoadItems.mockResolvedValue([{ language }, ...items]);

    render(<RouterApp />);

    expect(await screen.findByRole('heading', { name: 'Kwyjibo' })).toBeInTheDocument();
    expect(document.documentElement.lang).toBe(language);
    expect(document.documentElement.dir).toBe('rtl');
  });

  it('defaults the document language to English when the deck has no language', async () => {
    document.documentElement.lang = 'fr';
    mockedLoadItems.mockResolvedValue([{}, ...items]);

    render(<RouterApp />);

    expect(await screen.findByRole('heading', { name: 'Kwyjibo' })).toBeInTheDocument();
    expect(document.documentElement.lang).toBe('en');
    expect(document.documentElement.dir).toBe('ltr');
  });

  it('renders an alert when cards fail to load', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
    mockedLoadItems.mockRejectedValue(new Error('network failure'));

    render(<RouterApp />);
    expect(await screen.findByRole('alert')).toHaveTextContent('Unable to load cards for this path.');
    expect(consoleError).toHaveBeenCalledWith('Unable to load "/science".', expect.any(Error));

    consoleError.mockRestore();
  });
});
