import type { FlexProps } from '@chakra-ui/react';
import { Flex, forwardRef } from '@chakra-ui/react';

const FieldStack = forwardRef<FlexProps, 'fieldset'>(
  (props: FlexProps, ref) => {
    return (
      <Flex
        as='fieldset'
        // flex="1"
        direction='column'
        gap={2}
        ref={ref} // ref needed to use 'as' prop
        {...props}
      >
        {props.children}
      </Flex>
    );
  },
);

export { FieldStack };
