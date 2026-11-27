import { copyMosaicUrl } from './copy-mosaic-url';

describe('copyMosaicUrl', () => {
  it('copies the generated mosaic URL', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal('navigator', { clipboard: { writeText } });

    await copyMosaicUrl({ '0,0': '#123456' }, 'https://example.com/k/science?mode=quick');

    expect(writeText).toHaveBeenCalledWith('https://example.com/k/science/m:00123456?mode=quick');
    vi.unstubAllGlobals();
  });

  it('rejects when clipboard access is unavailable', async () => {
    vi.stubGlobal('navigator', {});

    await expect(copyMosaicUrl({}, 'https://example.com/k/science')).rejects.toThrow(
      'Clipboard access is unavailable.',
    );
    vi.unstubAllGlobals();
  });
});
