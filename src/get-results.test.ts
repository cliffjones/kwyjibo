import { getResults } from './get-results';

describe('getResults', () => {
  it('returns a no-cards message when no cards are selected', () => {
    expect(getResults(0, 0, 0, 0, 0)).toBe('No cards selected.');
  });

  it('formats a mastery summary from the deck stats', () => {
    expect(getResults(3, 4, 2, 0, 0)).toBe('You mastered 3 cards with 50% accuracy over 0 seconds.');
  });

  it('uses configured no-cards and results messages', () => {
    expect(getResults(0, 0, 0, 0, 0, { noCardsMessage: 'Nothing here.' })).toBe('Nothing here.');
    expect(
      getResults(2, 4, 1, 0, 0, { resultsMessage: 'Solved {} {card|cards} at {}% in {}.' }),
    ).toBe('Solved 2 cards at 100% in 0 seconds.');
  });
});
