import { loadItems } from '../src/store/load-items';

const createResponse = (
  body: string,
  status = 200,
  contentType = 'text/plain'
) => ({
  ok: status >= 200 && status < 300,
  status,
  headers: new Headers({ 'content-type': contentType }),
  text: async () => body
}) as Response;

const originalFetch = globalThis.fetch;

describe('loadItems', () => {
  afterEach(() => {
    jest.restoreAllMocks();
    globalThis.fetch = originalFetch;
  });

  it('loads a quiz file for each matching route segment without requesting a manifest', async () => {
    const fetchMock = jest.fn<ReturnType<typeof fetch>, Parameters<typeof fetch>>()
      .mockResolvedValueOnce(createResponse('Science\n\nWhat is a cell?\nA basic unit of life.'))
      .mockResolvedValueOnce(createResponse('Dev\n\nWhat is JSX?\nA syntax extension.'));
    globalThis.fetch = fetchMock;

    const items = await loadItems('/science/dev');

    expect(fetchMock.mock.calls.map(([url]) => url)).toEqual([
      '/data/science.kwyz',
      '/data/dev.kwyz'
    ]);
    expect(items.map(({ topic, question }) => ({ topic, question }))).toEqual([
      { topic: 'Science', question: 'What is a cell?' },
      { topic: 'Dev', question: 'What is JSX?' }
    ]);
  });

  it('ignores route segments without a matching quiz file', async () => {
    const fetchMock = jest.fn<ReturnType<typeof fetch>, Parameters<typeof fetch>>()
      .mockResolvedValueOnce(createResponse('', 403))
      .mockResolvedValueOnce(createResponse('', 404));
    globalThis.fetch = fetchMock;

    expect(await loadItems('/missing/not-found')).toEqual([]);
    expect(fetchMock.mock.calls.map(([url]) => url)).toEqual([
      '/data/missing.kwyz',
      '/data/not-found.kwyz'
    ]);
  });

  it('ignores SPA fallback HTML returned for a missing quiz file', async () => {
    const fetchMock = jest.fn<ReturnType<typeof fetch>, Parameters<typeof fetch>>()
      .mockResolvedValueOnce(createResponse('<!doctype html><html><body>App</body></html>'));
    globalThis.fetch = fetchMock;

    expect(await loadItems('/missing')).toEqual([]);
    expect(fetchMock).toHaveBeenCalledWith('/data/missing.kwyz');
  });

  it('ignores HTML quiz responses even when their content type is incorrect', async () => {
    const fetchMock = jest.fn<ReturnType<typeof fetch>, Parameters<typeof fetch>>()
      .mockResolvedValueOnce(createResponse('<html><body>App</body></html>', 200, 'text/plain'));
    globalThis.fetch = fetchMock;

    expect(await loadItems('/missing')).toEqual([]);
  });

  it('does not fetch traversal segments or decoded path separators', async () => {
    const fetchMock = jest.fn<ReturnType<typeof fetch>, Parameters<typeof fetch>>()
      .mockResolvedValueOnce(createResponse('Dev\n\nQuestion?\nAnswer.'));
    globalThis.fetch = fetchMock;

    await loadItems('/%2e%2e/%2Fsecret/dev');

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith('/data/dev.kwyz');
  });

  it('reports errors other than a missing quiz file', async () => {
    globalThis.fetch = jest.fn<ReturnType<typeof fetch>, Parameters<typeof fetch>>()
      .mockResolvedValue(createResponse('', 500));

    await expect(loadItems('/dev')).rejects.toThrow('Unable to load dev.kwyz: 500');
  });
});
