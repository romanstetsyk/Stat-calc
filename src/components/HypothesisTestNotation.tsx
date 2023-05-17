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

type Props = {
  mu0dir: H0Sign;
  mu1dir: H1Sign;
  mu0val: string;
  mu1val: string;
};

export const HypothesisTestNotation = ({
  mu0dir,
  mu1dir,
  mu0val,
  mu1val,
}: Props) => {
  return (
    <div>
      <p>
        H<sub>0</sub>: &mu; {String.fromCharCode(codes[mu0dir])} {mu0val}
      </p>
      <p>
        H<sub>a</sub>: &mu; {String.fromCharCode(codes[mu1dir])} {mu1val}
      </p>
    </div>
  );
};
