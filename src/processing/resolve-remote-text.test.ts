import { loadRemoteText } from './load-remote-text';
import { resolveRemoteText } from './resolve-remote-text';

vi.mock('./load-remote-text', () => ({
  loadRemoteText: vi.fn(),
}));

describe('resolveRemoteText', () => {
  it('returns the original text when there are no remote blocks', async () => {
    await expect(resolveRemoteText('Local question?\nAnswer.')).resolves.toBe('Local question?\nAnswer.');
  });

  it('replaces remote blocks with the downloaded text', async () => {
    vi.mocked(loadRemoteText).mockImplementation(async (url: string) => {
      if (url === 'https://example.com/cards.k') {
        return 'Remote question?\nRemote answer.';
      }
      return null;
    });

    await expect(resolveRemoteText('https://example.com/cards.k\n\n# Math\n\n2 + 2\n4')).resolves.toBe(
      'Remote question?\nRemote answer.\n\n# Math\n\n2 + 2\n4',
    );
  });
});
