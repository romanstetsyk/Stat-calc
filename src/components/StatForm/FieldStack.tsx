import { Flex, FlexProps, forwardRef } from "@chakra-ui/react";

export const FieldStack = forwardRef<FlexProps, "fieldset">(
  (props: FlexProps, ref) => {
    return (
      <Flex
        as="fieldset"
        // flex="1"
        direction={"column"}
        gap={2}
        ref={ref} // ref needed to use 'as' prop
        {...props}
      >
        {props.children}
      </Flex>
    );
  }
);
