import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import type { IconButtonProps } from '@chakra-ui/react';
import { IconButton } from '@chakra-ui/react';

type Props = Omit<IconButtonProps, 'aria-label'> & {
  placement: 'left' | 'right';
};

const ArrowButton = ({ placement, ...iconButtonProps }: Props): JSX.Element => {
  return (
    <IconButton
      zIndex={1}
      position='fixed'
      top='50%'
      left={placement === 'left' ? '0' : undefined}
      right={placement === 'right' ? '0' : undefined}
      icon={placement === 'left' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
      aria-label={placement === 'left' ? 'Show dataset' : 'Show session'}
      variant='solid'
      {...iconButtonProps}
    />
  );
};

export { ArrowButton };
