import { CheckIcon, DownloadIcon, SmallCloseIcon } from '@chakra-ui/icons';
import { CircularProgress, CircularProgressLabel } from '@chakra-ui/react';

import { IconButtonTooltip } from '~/common/components';

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
          <IconButtonTooltip
            isRound
            minWidth={0}
            width={6}
            height={6}
            label={
              progress === ProgressLimits.MAX
                ? 'Download finished'
                : 'Cancel download'
            }
            icon={
              progress === ProgressLimits.MAX ? (
                <CheckIcon />
              ) : (
                <SmallCloseIcon />
              )
            }
            onClick={cancelQuery}
          />
        </CircularProgressLabel>
      </CircularProgress>
    );
  }

  return (
    <IconButtonTooltip
      label='Download file'
      icon={<DownloadIcon />}
      onClick={download}
    />
  );
};

export { DownloadDatasetBtn };
