import { Alert, AlertDescription, AlertIcon } from '@chakra-ui/react';

const EmptyTableAlert = (): JSX.Element => {
  return (
    <Alert status='warning'>
      <AlertIcon />
      <AlertDescription>
        No Uploads Yet! Click the &quot;Upload&quot; button below to upload your
        first dataset
      </AlertDescription>
    </Alert>
  );
};

export { EmptyTableAlert };
