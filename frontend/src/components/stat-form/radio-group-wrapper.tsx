import type { BoxProps } from '@chakra-ui/react';
import { RadioGroup } from '@chakra-ui/react';
import type { Ref } from 'react';
import { forwardRef } from 'react';

type Props<T> = {
  children: React.ReactNode;
  onChange: (event: T | React.ChangeEvent) => void;
} & Omit<BoxProps, 'defaultValue' | 'onChange'>;

// Inner function should have a name
const RadioGroupWrapper = forwardRef(function RadioGroupWrapperInner<
  T extends string,
>({ children, onChange, ...rest }: Props<T>, ref: Ref<HTMLDivElement>) {
  return (
    <RadioGroup
      ref={ref}
      // as="fieldset"
      display='flex'
      flexDirection={{ base: 'column', md: 'row' }}
      gap={4}
      onChange={(value: T): void => {
        onChange(value);
      }}
      {...rest}
    >
      {children}
    </RadioGroup>
  );
}) as <T extends string>(
  props: Props<T> & { ref: Ref<HTMLDivElement> },
) => React.ReactNode;

export { RadioGroupWrapper };
