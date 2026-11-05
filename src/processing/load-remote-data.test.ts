import { loadRemoteData } from './load-remote-data';
import { loadRemoteText } from './load-remote-text';
import { parseFileData } from './parse-file-data';

vi.mock('./load-remote-text', () => ({
  loadRemoteText: vi.fn(),
}));

vi.mock('./parse-file-data', () => ({
  parseFileData: vi.fn(),
}));

describe('loadRemoteData', () => {
  it('returns null when the remote text cannot be loaded', async () => {
    vi.mocked(loadRemoteText).mockResolvedValue(null);

    await expect(loadRemoteData('https://example.com/cards.k')).resolves.toBeNull();
  });

  it('parses a successful remote text response into config and task data', async () => {
    vi.mocked(loadRemoteText).mockResolvedValue('Question?\n\nAnswer.');
    vi.mocked(parseFileData).mockReturnValue([
      { title: 'Deck title' },
      { task: 'Question?', solution: 'Answer.' },
    ] as any);

    await expect(loadRemoteData('https://example.com/cards.k')).resolves.toEqual([
      { title: 'Deck title' },
      { task: 'Question?', solution: 'Answer.' },
    ]);
    expect(parseFileData).toHaveBeenCalledWith('Question?\n\nAnswer.');
  });
});
