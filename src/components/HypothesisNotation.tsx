import { H0Sign, H1Sign, HypothesisSignMap } from "~/Types";
import { parseNumber } from "~/utils/parseNumber";

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
  h1dir: H1Sign;
  h1val: string;
};

export const HypothesisNotation = ({ param, h1dir, h1val }: Props) => {
  return (
    <div>
      <p>
        H<sub>0</sub>: {param} {H0Sign[HypothesisSignMap[h1dir]]}{" "}
        {parseNumber(h1val)}
      </p>
      <p>
        H<sub>a</sub>: {param} {H1Sign[h1dir]} {parseNumber(h1val)}
      </p>
    </div>
  );
};
