import { normalizeDataText } from './normalize-data-text';

describe('normalizeDataText', () => {
  it('trims and normalizes line endings', () => {
    expect(normalizeDataText('  A\r\nB\n\nC  ')).toBe('A\nB\n\nC');
  });

  it('turns single-line data into block-separated entries', () => {
    expect(normalizeDataText('Alpha\nBeta')).toBe('Alpha\n\nBeta');
  });

  it('expands tab-delimited compact data into separate blocks', () => {
    expect(normalizeDataText('Alpha\tBeta')).toBe('Alpha\nBeta');
  });
});
