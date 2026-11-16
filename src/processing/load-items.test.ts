import { loadItems } from './load-items';

const createResponse = (body: string, status = 200, contentType = 'text/plain') =>
  ({
    ok: status >= 200 && status < 300,
    status,
    headers: new Headers({ 'content-type': contentType }),
    text: async () => body,
  }) as Response;

const originalFetch = globalThis.fetch;

describe('loadItems', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    globalThis.fetch = originalFetch;
  });

  it('loads a deck file for each matching route segment without requesting a manifest', async () => {
    const fetchMock = vi
      .fn<typeof fetch>()
      .mockResolvedValueOnce(createResponse('# Science\n\nWhat is a cell?\nA basic unit of life.'))
      .mockResolvedValueOnce(createResponse('', 404))
      .mockResolvedValueOnce(createResponse('# Dev\n\nWhat is JSX?\nA syntax extension.'))
      .mockResolvedValueOnce(createResponse('', 404));
    vi.stubGlobal('fetch', fetchMock);

    const [, ...items] = await loadItems('/science/dev');

    expect(fetchMock.mock.calls.map(([url]) => url)).toEqual([
      '/data/science.k',
      '/data/science.index.k',
      '/data/dev.k',
      '/data/dev.index.k',
    ]);
    expect(items.map(({ topic, task }) => ({ topic, task }))).toEqual([
      { topic: 'Science', task: 'What is a cell?' },
      { topic: 'Dev', task: 'What is JSX?' },
    ]);
  });

  it('loads an index file after each non-namespaced route segment', async () => {
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(createResponse('', 404));
    vi.stubGlobal('fetch', fetchMock);

    await loadItems('/science/dev:math/missing');

    expect(fetchMock.mock.calls.map(([url]) => url)).toEqual([
      '/data/science.k',
      '/data/science.index.k',
      '/data/dev.k',
      '/data/dev.math.k',
      '/data/missing.k',
      '/data/missing.index.k',
    ]);
  });

  it('preserves interface message properties from the loaded K-format config', async () => {
    const configData = {
      homeMessage: 'Home',
      preloadedDataHeading: 'Decks',
      startButton: 'Begin',
      ratingLabel5: 'Excellent',
      resultsMessage: 'Results',
    };
    vi.stubGlobal('fetch', vi.fn<typeof fetch>().mockResolvedValue(createResponse(JSON.stringify(configData))));

    await expect(loadItems('/science')).resolves.toEqual([configData]);
  });

  it('ignores route segments without a matching deck file', async () => {
    const fetchMock = vi
      .fn<typeof fetch>()
      .mockResolvedValueOnce(createResponse('', 403))
      .mockResolvedValueOnce(createResponse('', 404))
      .mockResolvedValueOnce(createResponse('', 404))
      .mockResolvedValueOnce(createResponse('', 404));
    vi.stubGlobal('fetch', fetchMock);

    expect(await loadItems('/missing/not-found')).toEqual([{}]);
    expect(fetchMock.mock.calls.map(([url]) => url)).toEqual([
      '/data/missing.k',
      '/data/missing.index.k',
      '/data/not-found.k',
      '/data/not-found.index.k',
    ]);
  });

  it('loads remote K data when a URL appears in its own block and ignores failed loads', async () => {
    const fetchMock = vi.fn<typeof fetch>().mockImplementation(async (input) => {
      switch (String(input)) {
        case '/data/remote.k':
          return createResponse('https://example.com/remote.k');
        case '/data/remote.index.k':
        case '/data/broken.index.k':
          return createResponse('', 404);
        case 'https://example.com/remote.k':
          return createResponse('{ title: "Remote" }\n# Remote\n\nWhat is the answer?\n42');
        case '/data/broken.k':
          return createResponse('https://example.com/bad.k');
        case 'https://example.com/bad.k':
          throw new Error('network down');
        default:
          return createResponse('', 404);
      }
    });
    vi.stubGlobal('fetch', fetchMock);

    expect(await loadItems('/remote')).toEqual([
      { title: 'Remote' },
      expect.objectContaining({
        topic: 'Remote',
        task: 'What is the answer?',
        solution: '42',
        type: 'question',
        id: 0,
        rating: 0,
        responses: [],
      }),
    ]);

    fetchMock.mockClear();

    expect(await loadItems('/broken')).toEqual([{}]);
  });

  it('ignores SPA fallback HTML returned for a missing deck file', async () => {
    const fetchMock = vi
      .fn<typeof fetch>()
      .mockResolvedValueOnce(createResponse('<!doctype html><html><body>App</body></html>'))
      .mockResolvedValueOnce(createResponse('', 404));
    vi.stubGlobal('fetch', fetchMock);

    expect(await loadItems('/missing')).toEqual([{}]);
    expect(fetchMock).toHaveBeenCalledWith('/data/missing.k');
  });

  it('ignores HTML deck file responses even when their content type is incorrect', async () => {
    const fetchMock = vi
      .fn<typeof fetch>()
      .mockResolvedValueOnce(createResponse('<html><body>App</body></html>', 200, 'text/plain'))
      .mockResolvedValueOnce(createResponse('', 404));
    vi.stubGlobal('fetch', fetchMock);

    expect(await loadItems('/missing')).toEqual([{}]);
  });

  it('does not fetch traversal segments or decoded path separators', async () => {
    const fetchMock = vi
      .fn<typeof fetch>()
      .mockResolvedValueOnce(createResponse('', 404))
      .mockResolvedValueOnce(createResponse('Dev\n\nQuestion?\nAnswer.'))
      .mockResolvedValueOnce(createResponse('', 404));
    vi.stubGlobal('fetch', fetchMock);

    await loadItems('/%2e%2e/%2Fsecret/dev');

    expect(fetchMock.mock.calls.map(([url]) => url)).toEqual(['/data/index.k', '/data/dev.k', '/data/dev.index.k']);
  });

  it('reports errors other than a missing deck file', async () => {
    globalThis.fetch = vi.fn<typeof fetch>().mockResolvedValue(createResponse('', 500));

    await expect(loadItems('/dev')).rejects.toThrow('Unable to load "dev.k": 500.');
  });
});
