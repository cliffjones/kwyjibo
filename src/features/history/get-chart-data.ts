import { type ChartData } from 'chart.js';
import type { HistoryItem } from '../../processing/types';
import { LINE_ALPHA } from './constants';
import { shiftColor } from './shift-color';
import './style.scss';

// Reduces a given history item to a timestamp and a single numeric value.
const itemToCoords = (item: HistoryItem) => {
  let value = item.rating;
  if (item.type === 'input' && item.response) {
    const responseValue = parseFloat(item.response);
    if (Number.isFinite(responseValue)) {
      value = responseValue;
    }
  }
  return {
    x: item.time,
    y: value,
  };
};

export const getChartData = (history: HistoryItem[], color: string): ChartData<'line', { x: number; y: number }[]> => {
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
  const datasets: ChartData<'line', { x: number; y: number }[]>['datasets'] = [];
  let newColor = color;
  Object.entries(itemsByLabel).forEach(([label, items]) => {
    datasets.push({
      label,
      data: items.map(itemToCoords).sort((first, second) => first.x - second.x),
      borderColor: `${newColor}${LINE_ALPHA}`,
      backgroundColor: newColor,
    });
    newColor = shiftColor(newColor);
  });

  return { datasets };
};
