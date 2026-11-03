import { ResponseData } from './types';

// Sorts a given list of responses by their order values, shuffling items with equal orders.
export const sortResponses = (items: ResponseData[]) =>
  [...items].sort((a, b) => {
    // Sort in ascending order.
    const orderDifference = a.order - b.order;
    if (orderDifference !== 0) {
      return orderDifference;
    }

    // Where the order values are equal, shuffle the items.
    return Math.random() - 0.5;
  });
