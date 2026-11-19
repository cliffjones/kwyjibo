import type { HistoryItem } from '../../processing/types';
import { bucketItems } from './bucket-items';
import { LINE_ALPHA } from './constants';
import { shiftColor } from './shift-color';
import './style.scss';
import type { GraphData } from './types';

export const getGraphData = (history: HistoryItem[], color: string): GraphData => {
  // Divide up the history items by topic label.
  const itemsByLabel: Record<string, HistoryItem[]> = {};
  history.forEach((item) => {
    const label = item.topic || item.task;
    if (!itemsByLabel[label]) {
      itemsByLabel[label] = [];
    }
    itemsByLabel[label].push(item);
  });

  // Generate a line graph for each topic label.
  const datasets: GraphData['datasets'] = [];
  let newColor = color;
  Object.entries(itemsByLabel).forEach(([label, items]) => {
    datasets.push({
      label,
      data: bucketItems(items),
      borderColor: `${newColor}${LINE_ALPHA}`,
      backgroundColor: newColor,
    });
    newColor = shiftColor(newColor);
  });

  return { datasets };
};
