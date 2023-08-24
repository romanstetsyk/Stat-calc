import { H0Sign, H1Sign, HypothesisSignMap } from '~/types';
import { parseNumber } from '~/utils/parse-number';

const PopulationMean = (): JSX.Element => {
  return <>&mu;</>;
};

const PopulationMeanDiff = (): JSX.Element => {
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

const HypothesisNotation = ({ param, h1dir, h1val }: Props): JSX.Element => {
  return (
    <div>
      <p>
        H<sub>0</sub>: {param} {H0Sign[HypothesisSignMap[h1dir]]}{' '}
        {parseNumber(h1val)}
      </p>
      <p>
        H<sub>a</sub>: {param} {H1Sign[h1dir]} {parseNumber(h1val)}
      </p>
    </div>
  );
};

export { HypothesisNotation, PopulationMean, PopulationMeanDiff };
