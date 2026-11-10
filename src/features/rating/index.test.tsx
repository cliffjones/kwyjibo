import { fireEvent, render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { createAppStore } from '../../store';
import { Rating } from './index';

describe('Rating', () => {
  it('uses configured prompt and rating labels', () => {
    const store = createAppStore('/custom-rating', {
      ratingPrompt: 'How was that?',
      ratingLabel1: 'Custom one',
      ratingLabel2: 'Custom two',
      ratingLabel3: 'Custom three',
      ratingLabel4: 'Custom four',
      ratingLabel5: 'Custom five',
    });

    render(
      <Provider store={store}>
        <Rating handleRating={vi.fn()} />
      </Provider>,
    );

    expect(screen.getByText('How was that?')).toBeInTheDocument();
    expect(screen.getByTitle('Custom one')).toBeInTheDocument();
    expect(screen.getByTitle('Custom two')).toBeInTheDocument();
    expect(screen.getByTitle('Custom three')).toBeInTheDocument();
    expect(screen.getByTitle('Custom four')).toBeInTheDocument();
    expect(screen.getByTitle('Custom five')).toBeInTheDocument();
  });

  it.each([
    ['No.', 1],
    ['Not really.', 2],
    ['Kind of.', 3],
    ['Pretty much.', 4],
    ['Yes!', 5],
  ])('reports the selected confidence rating "%s"', (label, rating) => {
    const handleRating = vi.fn();
    const store = createAppStore('/rating-defaults');
    render(
      <Provider store={store}>
        <Rating handleRating={handleRating} />
      </Provider>,
    );

    fireEvent.click(screen.getByTitle(label));
    expect(handleRating).toHaveBeenCalledWith(rating);
  });
});
