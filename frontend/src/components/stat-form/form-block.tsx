import type { FlexProps } from '@chakra-ui/react';
import { Flex, forwardRef } from '@chakra-ui/react';

const FormBlock = forwardRef<FlexProps, 'fieldset'>(
  ({ children, ...restProps }: FlexProps, ref) => {
    return (
      <Flex
        ref={ref}
        flexDirection={{ base: 'column', md: 'row' }}
        gap={4}
        {...restProps}
      >
        {children}
      </Flex>
    );
  },
);

export { FormBlock };
