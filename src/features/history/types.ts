import { ChartData, ChartOptions } from 'chart.js';

export type Point = { x: number; y: number };
export type GraphData = ChartData<'line', Point[]>;
export type GraphOptions = ChartOptions<'line'>;
