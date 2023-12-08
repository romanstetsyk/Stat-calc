import type { FlexProps } from '@chakra-ui/react';
import { Flex, forwardRef } from '@chakra-ui/react';

const FieldStack = forwardRef<FlexProps, 'fieldset'>(
  (props: FlexProps, ref) => {
    return (
      <Flex
        as='fieldset'
        direction='column'
        ref={ref} // ref needed to use 'as' prop
        {...props}
      >
        {props.children}
      </Flex>
    );
  },
);

export { FieldStack };
