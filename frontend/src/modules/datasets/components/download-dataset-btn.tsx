import { CheckIcon, DownloadIcon, SmallCloseIcon } from '@chakra-ui/icons';
import {
  CircularProgress,
  CircularProgressLabel,
  IconButton,
  Tooltip,
} from '@chakra-ui/react';

import { useDownloadDataset } from '../hooks';

type Props = {
  id: string;
};

const DownloadDatasetBtn = ({ id }: Props): JSX.Element => {
  const { isFetching, download, cancelQuery, progress, ProgressLimits } =
    useDownloadDataset({ id });

  if (isFetching || progress !== ProgressLimits.MIN) {
    return (
      <CircularProgress
        min={ProgressLimits.MIN}
        max={ProgressLimits.MAX}
        value={progress}
        color='green.400'
        size={8}
      >
        <CircularProgressLabel>
          <Tooltip
            hasArrow
            label={
              progress === ProgressLimits.MAX
                ? 'Download finished'
                : 'Cancel download'
            }
            placement='top'
            fontSize='xs'
          >
            <IconButton
              isRound
              variant='ghost'
              size='sm'
              minWidth={0}
              width={6}
              height={6}
              aria-label='Cancel download'
              icon={
                progress === ProgressLimits.MAX ? (
                  <CheckIcon />
                ) : (
                  <SmallCloseIcon />
                )
              }
              onClick={cancelQuery}
            />
          </Tooltip>
        </CircularProgressLabel>
      </CircularProgress>
    );
  }

  return (
    <Tooltip hasArrow label='Download file' placement='top' fontSize='xs'>
      <IconButton
        variant='ghost'
        size='sm'
        aria-label='Download file'
        icon={<DownloadIcon />}
        onClick={download}
      />
    </Tooltip>
  );
};

export { DownloadDatasetBtn };
