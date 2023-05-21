import { H0Sign, H1Sign } from "../Types";

// ASCII codes of comparison signs
const codes = {
  eq: 61,
  ge: 8805,
  le: 8804,
  ne: 8800,
  gt: 62,
  lt: 60,
};

export const PopulationMean = () => {
  return <>&mu;</>;
};

export const PopulationMeanDiff = () => {
  return (
    <>
      &mu;<sub>1</sub> - &mu;<sub>2</sub>
    </>
  );
};

type Props = {
  param: JSX.Element;
  h0dir: H0Sign;
  h1dir: H1Sign;
  h0val: string;
  h1val: string;
};

export const HypothesisNotation = ({
  param,
  h0dir,
  h1dir,
  h0val,
  h1val,
}: Props) => {
  return (
    <div>
      <p>
        H<sub>0</sub>: {param} {String.fromCharCode(codes[h0dir])} {h0val}
      </p>
      <p>
        H<sub>a</sub>: {param} {String.fromCharCode(codes[h1dir])} {h1val}
      </p>
    </div>
  );
};
