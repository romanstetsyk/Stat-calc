/* eslint-disable @typescript-eslint/no-magic-numbers */
import { Box } from '@chakra-ui/react';
import type { TooltipItem } from 'chart.js';
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

import type { Bin } from '~/utils/tabulate';
// import ChartDataLabels from "chartjs-plugin-datalabels";

ChartJS.register(
  // ChartDataLabels,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

type Props<T> = {
  table: T[];
  parsing: {
    xAxisKey: Extract<keyof T, string>;
    yAxisKey: Extract<keyof T, string>;
  };
  datalabel?: string;
  domain: [number, number];
  classWidth: number;
};

const Histogram = <T,>({
  table,
  parsing,
  datalabel,
  domain,
  classWidth,
}: Props<T>): JSX.Element => {
  const options = {
    maintainAspectRatio: false,
    scales: {
      x: {
        bounds: 'data' as const,
        display: true,
        type: 'linear' as const,
        offset: false,
        grid: {
          drawOnChartArea: false,
          offset: false,
        },
        ticks: {
          stepSize: classWidth, // class width
          callback: (tickValue: string | number): number | string =>
            typeof tickValue === 'number'
              ? Number(tickValue.toFixed(6))
              : tickValue,
        },
        suggestedMin: domain[0],
        suggestedMax: domain[1],
        // grace: '20%',

        // ticks: {
        //   display: true,
        //   callback: (a, b, c) => {
        //     console.log(a, b, JSON.stringify(c));
        //     return a;
        //   },
        //   // stepSize: 1.2,
        //   // includeBounds: true,
        //   // maxTicksLimit: xLabels.length,
        // },
      },

      y: {
        // grace: '20%',
        // suggestedMin: -2,
        // suggestedMax: 1.3999,
        beginAtZero: true,
        title: {
          display: true,
          text: parsing.yAxisKey,
        },
        ticks: {
          // stepSize: 0.15,
          display: true,
          autoSkipPadding: 15,
        },
      },
    },
    plugins: {
      legend: {
        display: false,
        position: 'top' as const,
      },
      title: {
        display: false,
        text: 'Histogram',
      },
      tooltip: {
        // TODO: extract this callback
        callbacks: {
          title: (items: TooltipItem<'bar'>[]): string => {
            if (items.length === 0) {
              return '';
            }
            const [item] = items;
            if (!item.raw) {
              return '';
            }
            return '[' + (item.raw as Bin).limits.join(', ') + ')';
          },
        },
      },
      // datalabels: {
      //   display: true,
      //   color: "black",
      //   formatter: ({ Frequency }: { Frequency: number }) => {
      //     // console.log(a, b, c);
      //     return Frequency;
      //   },
      //   anchor: "end" as const,
      //   offset: -20,
      //   align: "start" as const,
      // },
    },
    parsing: parsing,
  };

  const chartData = {
    datasets: [
      {
        barThickness: 'flex' as const,
        categoryPercentage: 1,
        barPercentage: 1,
        label: datalabel ?? 'Dataset 1',
        data: table,
        xAxisID: 'x',
        yAxisID: 'y',
      },
    ],
  };

  return (
    <Box overflow='scroll' resize='both' aspectRatio={2}>
      <Bar options={options} data={chartData} />
    </Box>
  );
};

export { Histogram };
