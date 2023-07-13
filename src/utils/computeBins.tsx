import stdlibMax from "@stdlib/stats-base-max";
import stdlibMin from "@stdlib/stats-base-min";
import { BinMethod } from "~/Types";
import { roundToPrecision } from "./parseNumber";

export const computeBins = (
  arr: number[],
  start: number,
  width: number
): { values: number[][]; l: number; u: number } => {
  const max = Math.max(...arr);
  const bins: number[][] = [];

  let i = 0;
  while (start + i * width <= max) {
    bins.push([start + i * width, start + (i + 1) * width]);
    i += 1;
  }
  return { values: bins, l: start, u: start + i * width };
};

type Manual = {
  dataset: number[];
  method: BinMethod.MANUAL;
  start: number;
  width: number;
};

type SquareRoot = {
  dataset: number[];
  method: BinMethod.SQUARE_ROOT;
  start: number;
};

// type Other = {
//   dataset: number[];
//   method: BinMethod.OTHER;
//   n: number;
// };

export type HistogramTableParameters = Manual | SquareRoot;

type Config = {
  allowHidden?: boolean;
  showHidden?: boolean;
  hideEmpty?: boolean;
  precision?: number; // data precision subtracted from upper limits
};

export type Bin = {
  limits: [number, number];
  midpoint?: number;
  Frequency: number;
  "Relative Frequency"?: number;
  "Cumulative Frequency"?: number;
  "Cumulative Relative Frequency"?: number;
};

export class Tabulate {
  config: {
    allowHidden: boolean; // allow starting value to be less than datasetMin
    showHidden: boolean; // show additional bin before starting value it it's greater than datasetMin (allowHidden should be true to use this property)
    hideEmpty: boolean; // show bins with 0 height
    precision: number; // data precision. lower limit of next class can be greater than upper limit of the previous one
  };
  dataset: number[];
  datasetMin: number;
  datasetMax: number;
  countTotal = 0;
  countVisible = 0;
  method: BinMethod;
  start = NaN; // form
  width = NaN; // form
  showWarning = false; // flag if not all bins are visible
  bins: Bin[] = [];
  ticks: number[] = [];
  domain: [number, number] = [NaN, NaN]; // lower limit of first class, upper limit of last class

  constructor(paramObj: HistogramTableParameters, config: Config) {
    this.config = {
      allowHidden: config.allowHidden ?? false,
      showHidden: config.showHidden ?? true,
      hideEmpty: config.hideEmpty ?? false,
      precision: config.precision ?? 0,
    };

    const { dataset, method } = paramObj;
    this.method = method;
    this.dataset = dataset;
    this.datasetMin = stdlibMin(this.dataset.length, this.dataset, 1);
    this.datasetMax = stdlibMax(this.dataset.length, this.dataset, 1);
    this.countTotal = this.dataset.length;

    if (method === BinMethod.MANUAL) {
      const { start, width } = paramObj;
      this.width = width;
      this.createBinsManual(start);
    } else if (method === BinMethod.SQUARE_ROOT) {
      const { start } = paramObj;
      const k = Math.ceil(Math.sqrt(this.dataset.length));
      // w = (max + w - min) / k
      this.width = (this.datasetMax - this.datasetMin) / (k - 1) || 1;
      this.createBinsManual(start);
    }

    this.allocate();
    this.getTicks();
    this.getMidpoints();
  }

  createBinsManual(start: number) {
    if (Object.is(start, NaN)) {
      this.start = this.datasetMin;
    } else if (this.datasetMin < start) {
      this.start = this.config.allowHidden ? start : this.datasetMin;
    } else {
      this.start = start;
    }

    if (
      this.config.allowHidden &&
      !this.config.showHidden &&
      this.datasetMin < this.start
    ) {
      this.showWarning = true;
    }

    if (this.datasetMin < this.start && this.config.showHidden) {
      this.bins.push({ limits: [-Infinity, start], Frequency: 0 });
    }

    let i = 0;
    while (roundToPrecision(this.start + i * this.width) <= this.datasetMax) {
      const lowerLimit = roundToPrecision(this.start + i * this.width);
      const upperLimit = roundToPrecision(
        this.start + (i + 1) * this.width - this.config.precision
      );
      this.bins.push({
        limits: [lowerLimit, upperLimit],
        Frequency: 0,
      });
      i += 1;
    }

    const domainStart =
      this.datasetMin < this.start && this.config.showHidden
        ? roundToPrecision(this.start - this.width)
        : this.start;
    const domainEnd = roundToPrecision(this.start + i * this.width);
    this.domain = [domainStart, domainEnd];
  }

  allocate() {
    this.dataset.forEach((num) => {
      const idx = Math.floor(
        roundToPrecision(
          (this.bins.length * (num - this.domain[0])) /
            (this.domain[1] - this.domain[0])
        )
      );
      if (this.config.showHidden) {
        this.bins[idx >= 0 ? idx : 0]["Frequency"] += 1;
        this.countVisible += 1;
      } else if (idx >= 0) {
        this.bins[idx]["Frequency"] += 1;
        this.countVisible += 1;
      }
    });

    if (this.config.hideEmpty) {
      this.bins = this.bins.filter((bin) => bin["Frequency"] !== 0);
    }
  }

  computeRelativeFrequency() {
    this.bins.forEach((bin) => {
      bin["Relative Frequency"] = (bin["Frequency"] ?? 0) / this.countVisible;
    });
  }

  computeCumulativeFrequency() {
    let currentTotal = 0;
    this.bins.forEach((bin) => {
      bin["Cumulative Frequency"] = (bin["Frequency"] ?? 0) + currentTotal;
      currentTotal = bin["Cumulative Frequency"];
    });
  }

  computeCumulativeRelativeFrequency() {
    let currentTotal = 0;
    this.bins.forEach((bin) => {
      bin["Cumulative Relative Frequency"] = roundToPrecision(
        (bin["Frequency"] ?? 0) / this.countVisible + currentTotal
      );
      currentTotal = bin["Cumulative Relative Frequency"];
    });
  }

  getTicks() {
    this.ticks = [
      ...this.bins.map(({ limits }) => limits[0]),
      this.bins[this.bins.length - 1].limits[1],
    ];
  }

  getMidpoints() {
    this.bins.forEach((bin) => {
      const [a, b] = bin.limits;
      bin.midpoint = (a + b - this.config.precision) / 2;
    });
  }
}
