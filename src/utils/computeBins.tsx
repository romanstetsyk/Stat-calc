import stdlibMin from "@stdlib/stats-base-min";
import stdlibMax from "@stdlib/stats-base-max";
import { roundToPrecision } from "./parseNumber";
import { BinMethod } from "src/features/GroupNumericData/types";

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

type Other = {
  dataset: number[];
  method: BinMethod.OTHER;
  n: number;
};

type HistogramTableParameters = Manual | Other;

type Config = {
  allowHidden?: boolean;
  showHidden?: boolean;
  hideEmpty?: boolean;
};

type Bin = {
  limits: [number, number];
  values: {
    freq: number;
    relFreq?: number;
    cumulFreq?: number;
    cumulRelFreq?: number;
  };
};

export class Tabulate {
  dataset: number[];
  datasetMin: number;
  datasetMax: number;
  countTotal = 0;
  countVisible = 0;
  method: BinMethod;
  start = NaN; // form
  width = NaN; // form
  showHidden: boolean; // show additional bin before starting value
  allowHidden: boolean; // allow starting value to be less than datasetMin
  hideEmpty: boolean; // show bins with 0 height
  showWarning = false; // flag if not all bins are visible
  bins: Bin[] = [];
  l = NaN; // lower limit of first class
  u = NaN; // upper limit of last class

  constructor(paramObj: HistogramTableParameters, config: Config) {
    this.allowHidden = config.allowHidden ?? false;
    this.showHidden = config.showHidden ?? true;
    this.hideEmpty = config.hideEmpty ?? false;

    const { dataset, method } = paramObj;
    this.method = method;
    this.dataset = dataset;
    this.datasetMin = stdlibMin(this.dataset.length, this.dataset, 1);
    this.datasetMax = stdlibMax(this.dataset.length, this.dataset, 1);
    this.countTotal = this.dataset.length;

    if (method === BinMethod.MANUAL) {
      this.createBinsManual(paramObj);
      this.allocate();
    }
  }

  createBinsManual({ start, width }: Manual) {
    this.width = width;

    if (Object.is(start, NaN)) {
      this.start = this.datasetMin;
    } else if (this.datasetMin < start) {
      this.start = this.allowHidden ? start : this.datasetMin;
    } else {
      this.start = start;
    }

    if (this.allowHidden && !this.showHidden && this.datasetMin < this.start) {
      this.showWarning = true;
    }

    if (this.datasetMin < this.start && this.showHidden) {
      this.bins.push({ limits: [-Infinity, start], values: { freq: 0 } });
    }

    let i = 0;
    while (roundToPrecision(this.start + i * this.width) <= this.datasetMax) {
      const lowerLimit = roundToPrecision(this.start + i * this.width);
      const upperLimit = roundToPrecision(this.start + (i + 1) * this.width);
      this.bins.push({ limits: [lowerLimit, upperLimit], values: { freq: 0 } });
      i += 1;
    }

    this.l =
      this.datasetMin < this.start && this.showHidden
        ? roundToPrecision(this.start - this.width)
        : this.start;
    this.u = roundToPrecision(this.start + i * this.width);
  }

  allocate() {
    this.dataset.forEach((num) => {
      const idx = Math.floor(
        roundToPrecision(
          (this.bins.length * (num - this.l)) / (this.u - this.l)
        )
      );
      if (this.showHidden) {
        this.bins[idx >= 0 ? idx : 0].values.freq += 1;
        this.countVisible += 1;
      } else if (idx >= 0) {
        this.bins[idx].values.freq += 1;
        this.countVisible += 1;
      }
    });

    if (this.hideEmpty) {
      this.bins = this.bins.filter((bin) => bin.values.freq !== 0);
    }
  }

  computeRelativeFrequency() {
    this.bins.forEach(({ values }) => {
      values.relFreq = (values.freq ?? 0) / this.countVisible;
    });
  }

  computeCumulativeFrequency() {
    let currentTotal = 0;
    this.bins.forEach(({ values }) => {
      values.cumulFreq = (values.freq ?? 0) + currentTotal;
      currentTotal = values.cumulFreq;
    });
  }

  computeCumulativeRelativeFrequency() {
    let currentTotal = 0;
    this.bins.forEach(({ values }) => {
      values.cumulRelFreq = roundToPrecision(
        (values.freq ?? 0) / this.countVisible + currentTotal
      );
      currentTotal = values.cumulRelFreq;
    });
  }
}
