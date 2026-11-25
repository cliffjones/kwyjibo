import { formatTooltipLabel } from './format-tooltip-label';

describe('formatTooltipLabel', () => {
  it('lists every value on a separate line', () => {
    expect(formatTooltipLabel('Science', ['first response', '75%'])).toEqual(['Science: first response', '75%']);
  });

  it('truncates each value to 50 characters with an ellipsis', () => {
    expect(formatTooltipLabel('Science', ['x'.repeat(40), 'y'.repeat(41)])).toEqual([
      `Science: ${'x'.repeat(40)}`,
      `${'y'.repeat(39)}…`,
    ]);
    expect(formatTooltipLabel('Science', ['😀'.repeat(41)])).toEqual([`Science: ${'😀'.repeat(39)}…`]);
  });

  it('limits values to eight and marks omitted values unless truncation already adds an ellipsis', () => {
    expect(formatTooltipLabel('Science', ['1', '2', '3', '4', '5', '6', '7', '8', '9'])).toEqual([
      'Science: 1',
      '2',
      '3',
      '4',
      '5',
      '6',
      '7',
      '8…',
    ]);
    expect(formatTooltipLabel('Science', ['1', '2', '3', '4', 'x'.repeat(41), '6', '7', 'y'.repeat(41), '9'])).toEqual([
      'Science: 1',
      '2',
      '3',
      '4',
      `${'x'.repeat(39)}…`,
      '6',
      '7',
      `${'y'.repeat(39)}…`,
    ]);
  });
});
