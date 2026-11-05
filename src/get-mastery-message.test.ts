import { getMasteryMessage } from './get-mastery-message';

describe('getMasteryMessage', () => {
  it('returns a no-cards message when no cards are selected', () => {
    expect(getMasteryMessage(0, 0, 0, 0, 0)).toBe('No cards selected.');
  });

  it('formats a mastery summary from the deck stats', () => {
    expect(getMasteryMessage(3, 4, 2, 0, 0)).toBe('You mastered 3 cards with 50% accuracy over 0 seconds.');
  });
});
