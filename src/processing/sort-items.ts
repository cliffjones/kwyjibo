import { TaskItem } from './types';

// Sorts a given list of items by their rating values, shuffling items with equal ratings.
export const sortItems = (items: TaskItem[]) =>
  [...items].sort((a, b) => {
    // Sort by rating in ascending order.
    const ratingDifference = a.rating - b.rating;
    if (ratingDifference !== 0) {
      return ratingDifference;
    }

    // Where the ratings are equal, shuffle the items.
    return Math.random() - 0.5;
  });
