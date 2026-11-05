import { loadRemoteText } from './load-remote-text';

describe('loadRemoteText', () => {
  it('returns null for invalid URLs', async () => {
    await expect(loadRemoteText('not a url')).resolves.toBeNull();
  });

  it('returns text for successful non-HTML responses', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        headers: { get: vi.fn().mockReturnValue('text/plain') },
        text: async () => 'Question?\nAnswer.',
      }),
    );

    await expect(loadRemoteText('https://example.com/cards.k')).resolves.toBe('Question?\nAnswer.');
  });

  it('returns null when the remote response is not OK', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        headers: { get: vi.fn() },
        text: async () => 'not used',
      }),
    );

    await expect(loadRemoteText('https://example.com/cards.k')).resolves.toBeNull();
  });

  it('returns null when the remote response is HTML', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        headers: { get: vi.fn().mockReturnValue('text/html') },
        text: async () => '<html><body>Not a deck</body></html>',
      }),
    );

    await expect(loadRemoteText('https://example.com/cards.k')).resolves.toBeNull();
  });
});
