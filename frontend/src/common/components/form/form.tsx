import type { FlexProps } from '@chakra-ui/react';
import { Flex } from '@chakra-ui/react';
import type { ComponentProps } from 'react';

// FlexProps includes 'onSubmit'
type Props = FlexProps & ComponentProps<'form'>;

const Form = ({ children, ...formProps }: Props): JSX.Element => {
  return (
    <Flex as='form' direction='column' gap={6} {...formProps}>
      {children}
    </Flex>
  );
};

export { Form };
