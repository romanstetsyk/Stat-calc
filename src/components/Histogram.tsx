import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
// import ChartDataLabels from "chartjs-plugin-datalabels";

ChartJS.register(
  // ChartDataLabels,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

type Props<T> = {
  table: T[];
  parsing: {
    xAxisKey: Extract<keyof T, string>;
    yAxisKey: Extract<keyof T, string>;
  };
  datalabel?: string;
};

export const Histogram = <T,>({ table, parsing, datalabel }: Props<T>) => {
  const options = {
    maintainAspectRatio: false,
    scales: {
      xAxis: {
        title: {
          display: true,
          text: datalabel,
        },
      },
    },
    plugins: {
      legend: {
        display: false,
        position: "top" as const,
      },
      title: {
        display: false,
        text: "Histogram",
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
        categoryPercentage: 1,
        barPercentage: 1,
        label: datalabel || "Dataset 1",
        data: table,
        xAxisID: "xAxis",
      },
    ],
  };

  return (
    <div
      style={{
        overflow: "scroll",
        resize: "both",
        minHeight: "100%",
        aspectRatio: 2,
      }}
    >
      <Bar options={options} data={chartData} />
    </div>
  );
};
