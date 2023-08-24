import type { CheckboxProps } from '@chakra-ui/react';
import { Checkbox } from '@chakra-ui/react';
import { forwardRef } from 'react';
import type { ControllerRenderProps } from 'react-hook-form';

type Props = ControllerRenderProps & Omit<CheckboxProps, 'value'>;

const AskLabelCheckbox = forwardRef((props: Props, ref) => {
  return (
    <Checkbox
      pl={2}
      display='flex'
      isChecked={props.value}
      {...props}
      ref={ref}
    >
      Labels in first row
    </Checkbox>
  );
});

AskLabelCheckbox.displayName = 'AskLabelCheckbox';

export { AskLabelCheckbox };
