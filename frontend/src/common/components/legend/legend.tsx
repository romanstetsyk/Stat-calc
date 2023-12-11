import type { TextProps } from '@chakra-ui/react';
import { Text } from '@chakra-ui/react';

type Props = TextProps;

const Legend = ({ children, ...textProps }: Props): JSX.Element => {
  return (
    <Text as='legend' fontWeight={700} mb={2} {...textProps}>
      {children}
    </Text>
  );
};

export { Legend };
