import { isConfigData } from './is-config-data';

describe('isConfigData', () => {
  it('accepts valid config objects and ignores extra keys', () => {
    expect(isConfigData({ title: 'Kwyjibo' })).toBe(true);
    expect(isConfigData({})).toBe(true);
  });

  it('accepts all supported interface message properties', () => {
    expect(
      isConfigData({
        homeMessage: 'Home',
        lightModeMessage: 'Change theme',
        preloadedDataHeading: 'Decks',
        customDataHeading: 'Custom',
        startButton: 'Begin',
        revealButton: 'Show',
        resetButton: 'Restart',
        yesButton: 'Yes',
        noButton: 'No',
        ratingPrompt: 'How did you do?',
        ratingLabel1: 'One',
        ratingLabel2: 'Two',
        ratingLabel3: 'Three',
        ratingLabel4: 'Four',
        ratingLabel5: 'Five',
        ratingMessage: 'Rated:',
        noCardsMessage: 'No cards.',
        resultsMessage: 'Results',
      }),
    ).toBe(true);
  });

  it('rejects null data', () => {
    expect(isConfigData(null)).toBe(false);
  });
});
