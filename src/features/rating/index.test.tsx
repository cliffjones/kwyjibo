import { fireEvent, render, screen } from '@testing-library/react';
import { Rating } from './index';

describe('Rating', () => {
  it.each([
    ['Not at all.', 1],
    ['Not really.', 2],
    ['Kind of.', 3],
    ['Pretty much.', 4],
    ['Yes!', 5]
  ])('reports the selected confidence rating "%s"', (label, rating) => {
    const handleRating = jest.fn();
    render(<Rating handleRating={handleRating} />);

    fireEvent.click(screen.getByTitle(label));
    expect(handleRating).toHaveBeenCalledWith(rating);
  });
});
