import { TaskItem } from './types';

// Sorts a given list of items by their rating values, shuffling items with equal ratings.
export const sortItems = (items: TaskItem[]) => {
  const sortedItems = [...items].sort((a, b) => {
    // Sort by rating in ascending order.
    const ratingDifference = a.rating - b.rating;
    if (ratingDifference !== 0) {
      return ratingDifference;
    }

    // Where the ratings are equal, decide randomly.
    return Math.random() - 0.5;
  });
  console.log({ items: JSON.parse(JSON.stringify(items)), sortedItems: JSON.parse(JSON.stringify(sortedItems)) });
  return sortedItems;
};
