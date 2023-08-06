import { Flex, FlexProps, forwardRef } from "@chakra-ui/react";

export const FormBlock = forwardRef<FlexProps, "fieldset">(
  ({ children, ...restProps }: FlexProps, ref) => {
    return (
      <Flex
        ref={ref}
        as="fieldset"
        flexDirection={{ base: "column", md: "row" }}
        gap={4}
        {...restProps}
      >
        {children}
      </Flex>
    );
  }
);
