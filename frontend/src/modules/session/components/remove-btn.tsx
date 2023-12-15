import { CloseButton, Tooltip } from '@chakra-ui/react';

import { useSessionData } from '../store';

type Props = {
  id: string;
};

const RemoveBtn = ({ id }: Props): JSX.Element => {
  const { removeSessionItem } = useSessionData();

  return (
    <Tooltip hasArrow label='Remove from session' placement='top' fontSize='xs'>
      <CloseButton
        size='sm'
        p={4}
        // visibility={"hidden"}
        // _groupHover={{ visibility: "visible" }}
        onClick={(): void => {
          removeSessionItem(id);
        }}
      />
    </Tooltip>
  );
};

export { RemoveBtn };
