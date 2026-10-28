// Returns the next ID in an already sorted/shuffled list.
export const getNextId = (
  ids: number[],
  previousId?: number | null
): number | null => {
  if (!ids.length) {
    return null;
  }

  if (previousId == null) {
    console.log('STARTING at 0:', ids[0]);
    return ids[0];
  }

  const currentIndex = ids.indexOf(previousId);
  if (currentIndex === -1) {
    console.log(previousId, 'NOT FOUND, SO NULL');
    return null;
  }

  const nextIndex = currentIndex + 1;
  console.log(currentIndex, '+ 1 =', nextIndex, 'OF LENGTH', ids.length);
  if (nextIndex >= ids.length) {
    return null;
  }

  console.log('INDEX', nextIndex, '=', ids[nextIndex]);
  return ids[nextIndex];
};
