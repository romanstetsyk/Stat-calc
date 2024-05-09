import type { HeadingProps } from '@chakra-ui/react';
import { Heading } from '@chakra-ui/react';

import { useGridData } from '../hooks';

type Props = HeadingProps;

const DataGridTitle = (props: Props): JSX.Element => {
  const { title } = useGridData();

  return <Heading {...props}>{title}</Heading>;
};

export { DataGridTitle };
