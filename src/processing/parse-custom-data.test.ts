import { loadRemoteData } from './load-remote-data';
import { parseCustomData } from './parse-custom-data';

vi.mock('./load-remote-data', () => ({
  loadRemoteData: vi.fn(),
}));

describe('parseCustomData', () => {
  it('parses local blocks directly into config and task data', async () => {
    await expect(
      parseCustomData('# Science\n\nWhat is gravity?\nA force that pulls objects together.'),
    ).resolves.toEqual([
      {},
      { topic: 'Science', task: 'What is gravity?', solution: 'A force that pulls objects together.' },
    ]);
  });

  it('loads and merges remote blocks in addition to local blocks', async () => {
    vi.mocked(loadRemoteData).mockResolvedValue([
      { title: 'Remote deck' },
      { task: 'Remote question?', solution: 'Remote answer.' },
    ]);

    await expect(parseCustomData('https://example.com/cards.k\n\n# Math\n\n2 + 2\n4')).resolves.toEqual([
      { title: 'Remote deck' },
      { task: 'Remote question?', solution: 'Remote answer.' },
      { topic: 'Math', task: '2 + 2', solution: '4' },
    ]);
  });
});
