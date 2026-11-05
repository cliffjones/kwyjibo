import { expandRemoteItems } from './expand-remote-items';
import { loadRemoteData } from './load-remote-data';

vi.mock('./load-remote-data', () => ({
  loadRemoteData: vi.fn(),
}));

describe('expandRemoteItems', () => {
  it('merges remote item data into the local group', async () => {
    vi.mocked(loadRemoteData).mockResolvedValue([
      { title: 'Remote deck' },
      { task: 'Remote question?', solution: 'Remote answer.' },
    ]);

    const result = await expandRemoteItems([
      { heading: 'Local deck' },
      { task: 'https://example.com/cards.k', solution: '' },
      { task: 'Local question?', solution: 'Local answer.' },
    ] as any);

    expect(loadRemoteData).toHaveBeenCalledWith('https://example.com/cards.k');
    expect(result).toEqual([
      { heading: 'Local deck', title: 'Remote deck' },
      { task: 'Remote question?', solution: 'Remote answer.' },
      { task: 'Local question?', solution: 'Local answer.' },
    ]);
  });

  it('leaves items in place when a remote lookup fails', async () => {
    vi.mocked(loadRemoteData).mockResolvedValue(null);

    const group = [
      { heading: 'Local deck' },
      { task: 'https://example.com/cards.k', solution: '' },
      { task: 'Local question?', solution: 'Local answer.' },
    ] as any;

    await expect(expandRemoteItems(group)).resolves.toEqual([
      { heading: 'Local deck' },
      { task: 'Local question?', solution: 'Local answer.' },
    ]);
  });
});
