import { Flex, Text } from '@chakra-ui/react';

import type { HypothesisType } from '~/modules/application/enums';
import { H0Sign, H1Sign } from '~/modules/application/enums';

type Props = {
  param: JSX.Element;
  h1dir: HypothesisType;
  h1val: number | string;
};

const HypothesisNotationDisplay = ({
  param,
  h1dir,
  h1val,
}: Props): JSX.Element => {
  return (
    <Flex flexDirection='column'>
      <Text as='samp'>
        H<Text as='sub'>0</Text>: {param} {H0Sign[h1dir]} {h1val}
      </Text>
      <Text as='samp'>
        H<Text as='sub'>a</Text>: {param} {H1Sign[h1dir]} {h1val}
      </Text>
    </Flex>
  );
};

export { HypothesisNotationDisplay };
