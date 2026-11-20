import { Chart, Legend, LineController, LineElement, LinearScale, PointElement, Tooltip } from 'chart.js';
import { Line } from 'react-chartjs-2';
import { useSelector } from 'react-redux';
import { LANG } from '../../constants';
import type { RootState } from '../../store';
import { DARK_MODE, LIGHT_MODE } from '../../style/constants';
import { Card } from '../card';
import { GRID_ALPHA, MAX_TIME_LABELS } from './constants';
import { formatTime } from './format-time';
import { getGraphData } from './get-graph-data';
import './style.scss';
import type { GraphOptions } from './types';

Chart.register(LineController, LinearScale, PointElement, LineElement, Tooltip, Legend);

export const History = () => {
  const configData = useSelector((state: RootState) => state.kwyjibo.configData);
  const history = useSelector((state: RootState) => state.kwyjibo.history);
  const lightMode = useSelector((state: RootState) => state.kwyjibo.lightMode);

  if (!history.length) {
    return null;
  }

  const textColor = lightMode ? LIGHT_MODE.pencil : DARK_MODE.pencil;
  const lineColor = lightMode ? LIGHT_MODE.ink : DARK_MODE.ink;

  const data = getGraphData(history, lineColor);

  const options: GraphOptions = {
    animation: false,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: textColor,
          generateLabels: (chart) => {
            const items = Chart.defaults.plugins.legend.labels.generateLabels(chart);
            items.forEach((item) => {
              item.lineWidth = 0;
            });
            return items;
          },
        },
      },
      tooltip: {
        callbacks: {
          title: (items) => formatTime(items[0]?.parsed.x),
          label: (context) => `${context.dataset.label}: ${context.parsed.y}`,
        },
      },
    },
    scales: {
      x: {
        type: 'linear',
        ticks: {
          color: textColor,
          maxTicksLimit: MAX_TIME_LABELS,
          callback: (value) => formatTime(value, true),
        },
        grid: { color: `${textColor}${GRID_ALPHA}` },
      },
      y: {
        ticks: { color: textColor },
        grid: { color: `${textColor}${GRID_ALPHA}` },
      },
    },
  };

  return (
    <Card heading={configData.historyHeading || LANG.historyHeading}>
      <div className="history-chart" role="img">
        <Line data={data} options={options} />
      </div>
    </Card>
  );
};
