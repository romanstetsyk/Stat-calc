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
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Chart.js Bar Chart",
      },
      // datalabels: {
      //   display: true,
      //   color: "black",
      //   // formatter: (ths: unknown) => {
      //   //   return JSON.stringify(ths);
      //   // },
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
