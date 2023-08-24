/* eslint-disable @typescript-eslint/no-magic-numbers */
import stdlibMax from '@stdlib/stats-base-max';
import stdlibMin from '@stdlib/stats-base-min';

import { BinMethod } from '~/types';

import { roundToPrecision } from './parse-number';

const computeBins = (
  arr: number[],
  start: number,
  width: number,
): { values: number[][]; l: number; u: number } => {
  const max = Math.max(...arr);
  const bins: number[][] = [];

  let i = 0;
  while (start + i * width <= max) {
    // eslint-disable-next-line @typescript-eslint/no-magic-numbers
    bins.push([start + i * width, start + (i + 1) * width]);
    // eslint-disable-next-line @typescript-eslint/no-magic-numbers
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

type TabulateParams = Manual | SquareRoot;

type Config = {
  allowHidden?: boolean;
  showHidden?: boolean;
  hideEmpty?: boolean;
  precision?: number; // data precision subtracted from upper limits
};

type Bin = {
  limits: [number, number];
  midpoint?: number;
  Frequency: number;
  'Relative Frequency'?: number;
  // eslint-disable-next-line sonarjs/no-duplicate-string
  'Cumulative Frequency'?: number;
  // eslint-disable-next-line sonarjs/no-duplicate-string
  'Cumulative Relative Frequency'?: number;
};

class Tabulate {
  public config: {
    allowHidden: boolean; // allow starting value to be less than datasetMin
    showHidden: boolean; // show additional bin before starting value it it's greater than datasetMin (allowHidden should be true to use this property)
    hideEmpty: boolean; // show bins with 0 height
    precision: number; // data precision. lower limit of next class can be greater than upper limit of the previous one
  };
  public dataset: number[];
  public datasetMin: number;
  public datasetMax: number;
  public countTotal = 0;
  public countVisible = 0;
  public method: BinMethod;
  public start = Number.NaN; // form
  public width = Number.NaN; // form
  public showWarning = false; // flag if not all bins are visible
  public bins: Bin[] = [];
  public ticks: number[] = [];
  public domain: [number, number] = [Number.NaN, Number.NaN]; // lower limit of first class, upper limit of last class

  public constructor(paramObj: TabulateParams, config: Config) {
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
    } else {
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

  public createBinsManual(start: number): void {
    if (Object.is(start, Number.NaN)) {
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
      this.bins.push({
        limits: [Number.NEGATIVE_INFINITY, start],
        Frequency: 0,
      });
    }

    let i = 0;
    while (roundToPrecision(this.start + i * this.width) <= this.datasetMax) {
      const lowerLimit = roundToPrecision(this.start + i * this.width);
      const upperLimit = roundToPrecision(
        this.start + (i + 1) * this.width - this.config.precision,
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

  public allocate(): void {
    for (const num of this.dataset) {
      const idx = Math.floor(
        roundToPrecision(
          (this.bins.length * (num - this.domain[0])) /
            (this.domain[1] - this.domain[0]),
        ),
      );
      if (this.config.showHidden) {
        this.bins[idx >= 0 ? idx : 0].Frequency += 1;
        this.countVisible += 1;
      } else if (idx >= 0) {
        this.bins[idx].Frequency += 1;
        this.countVisible += 1;
      }
    }

    if (this.config.hideEmpty) {
      this.bins = this.bins.filter((bin) => bin.Frequency !== 0);
    }
  }

  public computeRelativeFrequency(): void {
    for (const bin of this.bins) {
      bin['Relative Frequency'] = bin.Frequency / this.countVisible;
    }
  }

  public computeCumulativeFrequency(): void {
    let currentTotal = 0;
    for (const bin of this.bins) {
      bin['Cumulative Frequency'] = bin.Frequency + currentTotal;
      currentTotal = bin['Cumulative Frequency'];
    }
  }

  public computeCumulativeRelativeFrequency(): void {
    let currentTotal = 0;
    for (const bin of this.bins) {
      bin['Cumulative Relative Frequency'] = roundToPrecision(
        bin.Frequency / this.countVisible + currentTotal,
      );
      currentTotal = bin['Cumulative Relative Frequency'];
    }
  }

  public getTicks(): void {
    if (this.bins.length > 0) {
      this.ticks = [
        ...this.bins.map(({ limits }) => limits[0]),
        (this.bins.at(-1) as Bin).limits[1],
      ];
    }
  }

  public getMidpoints(): void {
    for (const bin of this.bins) {
      const [a, b] = bin.limits;
      bin.midpoint = (a + b - this.config.precision) / 2;
    }
  }
}

export type { Bin, TabulateParams };
export { computeBins, Tabulate };
