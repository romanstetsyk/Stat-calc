import { Button } from '@chakra-ui/react';
import { joiResolver } from '@hookform/resolvers/joi';
import type { DatasetUploadRequestDTO } from '@shared/build/esm/index';
import { UPLOAD_FIELD_NAME } from '@shared/build/esm/index';
import { useEffect } from 'react';
import type { SubmitHandler } from 'react-hook-form';

import { Form, InputControlledDropzone } from '~/common/components';
import { useForm } from '~/common/hooks';

import { DEFAULT_FILE_UPLOAD_PAYLOAD } from './default-values';
import { datasetSchema } from './validation-schemas';

const resolver = joiResolver(datasetSchema, {
  abortEarly: false,
  errors: { wrap: { label: false } },
});

type Props = {
  onSubmit: SubmitHandler<DatasetUploadRequestDTO>;
};

const FileUploadForm = ({ onSubmit }: Props): JSX.Element => {
  const {
    handleSubmit,
    control,
    reset,
    formState: { isSubmitSuccessful },
  } = useForm<DatasetUploadRequestDTO>({
    defaultValues: DEFAULT_FILE_UPLOAD_PAYLOAD,
    resolver,
  });

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
    }
  }, [isSubmitSuccessful, reset]);

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <InputControlledDropzone<DatasetUploadRequestDTO>
        name={UPLOAD_FIELD_NAME}
        control={control}
        multiple={false}
      />

      <Button type='submit'>Upload</Button>
    </Form>
  );
};

export { FileUploadForm };
