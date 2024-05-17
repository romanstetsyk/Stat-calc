import type { IconButtonProps } from '@chakra-ui/react';
import { IconButton as IconButtonChakra, Tooltip } from '@chakra-ui/react';
import { forwardRef } from 'react';

type Props = Omit<IconButtonProps, 'aria-label'> & {
  label: string;
};

const IconButtonTooltip = forwardRef<HTMLButtonElement, Props>(
  ({ label, ...iconButtonProps }, ref): JSX.Element => {
    return (
      <Tooltip hasArrow label={label} placement='top' fontSize='xs'>
        <IconButtonChakra
          ref={ref}
          variant='ghost'
          size='sm'
          {...iconButtonProps}
          aria-label={label}
        />
      </Tooltip>
    );
  },
);

IconButtonTooltip.displayName = 'IconButtonTooltip';

export { IconButtonTooltip };
