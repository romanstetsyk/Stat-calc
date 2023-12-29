import { Card, CardHeader, Flex, Heading } from '@chakra-ui/react';
import useResizeObserver from '@react-hook/resize-observer';
import debounce from 'lodash-es/debounce';
import { useRef } from 'react';
import type { DraggableGridHandle } from 'ruuri';

import { RefreshBtn } from './refresh-btn';
import { RemoveBtn } from './remove-btn';
import { UpdateBtn } from './update-btn';

type Props = {
  children: React.ReactNode;
  id: string;
  title: string;
  gridRef?: React.MutableRefObject<DraggableGridHandle | null>;
};

const SessionItemWrapper = ({
  id,
  title,
  children,
  gridRef,
}: Props): JSX.Element => {
  // Update chached dimensions of items
  const ref = useRef<HTMLDivElement | null>(null);
  useResizeObserver(
    ref,
    // eslint-disable-next-line @typescript-eslint/no-magic-numbers
    debounce(() => gridRef?.current?.grid?.refreshItems(), 300),
  );

  return (
    <Card
      userSelect='text'
      ref={ref}
      mx={2}
      my={1}
      data-group
      cursor='auto'
      boxShadow='xs'
      transitionDuration='200ms'
      transitionProperty='boxShadow'
      _hover={{
        boxShadow: 'var(--chakra-shadows-base), var(--chakra-shadows-xs)',
      }}
      resize='both'
      overflow='auto'
    >
      <Flex alignItems='flex-start'>
        <CardHeader className='draggableHeader' flexGrow={1} p={3}>
          <Heading as='h4' size='sm' whiteSpace='nowrap'>
            {title}
          </Heading>
          {/* <Text fontSize="md">
            {new Date(timestamp).toLocaleString()}
          </Text> */}
        </CardHeader>

        <RefreshBtn id={id} />
        <UpdateBtn id={id} />
        <RemoveBtn id={id} />
      </Flex>
      {children}
    </Card>
  );
};

export { SessionItemWrapper };
