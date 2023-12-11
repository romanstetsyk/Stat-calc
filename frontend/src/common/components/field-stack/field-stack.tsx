import type { BoxProps } from '@chakra-ui/react';
import { Box, forwardRef } from '@chakra-ui/react';

type Props = BoxProps;

const FieldStack = forwardRef<BoxProps, 'fieldset'>(
  ({ children, ...boxProps }: Props, ref): JSX.Element => {
    return (
      <Box
        ref={ref} // ref needed to use 'as' prop
        as='fieldset'
        display='flex'
        flexDirection='column'
        {...boxProps}
      >
        {children}
      </Box>
    );
  },
);

FieldStack.displayName = 'FieldStack';

export { FieldStack };
