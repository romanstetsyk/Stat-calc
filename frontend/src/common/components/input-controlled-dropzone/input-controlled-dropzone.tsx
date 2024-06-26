import { Button, Flex, FormControl, FormErrorMessage } from '@chakra-ui/react';
import type { WithRequired } from '@shared/build/esm/index';
import { nanoid } from 'nanoid';
import { useCallback, useEffect, useState } from 'react';
import type { DropzoneOptions } from 'react-dropzone';
import { useDropzone } from 'react-dropzone';
import type { FieldValues, UseControllerProps } from 'react-hook-form';

import { useController } from '~/common/hooks';

import { SelectedFileList } from './selected-file-list';
import type { FileWithKey } from './types';

type Props<T extends FieldValues> = WithRequired<
  UseControllerProps<T>,
  'control'
> &
  Pick<DropzoneOptions, 'multiple'>;

const InputControlledDropzone = <T extends FieldValues>({
  name,
  control,
  defaultValue,
  rules,
  shouldUnregister,
  disabled,
  multiple = false,
}: Props<T>): JSX.Element => {
  const [files, setFiles] = useState<FileWithKey[]>([]);

  const {
    field: { onChange, ...restField },
    fieldState: { error, invalid },
    formState: { isSubmitSuccessful },
  } = useController({
    name,
    control,
    defaultValue,
    rules,
    shouldUnregister,
    disabled,
  });

  const onDrop = useCallback(
    (acceptedFiles: File[]): void => {
      const newFiles = acceptedFiles.map((file) => ({ key: nanoid(), file }));
      multiple
        ? setFiles((prev) => [...prev, ...newFiles])
        : setFiles(newFiles);
    },
    [multiple],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    multiple,
    onDrop,
  });

  const handleDelete = useCallback((key: FileWithKey['key']) => {
    return () => {
      setFiles((prev) => prev.filter((file) => file.key !== key));
    };
  }, []);

  useEffect(() => {
    onChange(files.map(({ file }) => file));
  }, [files, onChange]);

  useEffect(() => {
    if (isSubmitSuccessful) {
      setFiles([]);
    }
  }, [isSubmitSuccessful]);

  return (
    <FormControl isInvalid={invalid}>
      <Flex
        justifyContent='center'
        p={8}
        color='gray.600'
        borderWidth='1px'
        borderStyle='dashed'
        borderColor='gray.600'
        backgroundColor={isDragActive ? `#808080` : 'transparent'}
        _hover={{ backgroundColor: '#F2F2F2' }}
        cursor='pointer'
        {...getRootProps()}
      >
        {/**
         * Overwrite value with empty string because input type file
         * can only be set programmatically to empty string.
         * The actual value is set using `onChange` method from `useController`
         */}
        <input {...getInputProps({ onChange, ...restField })} value='' />
        <Button
          type='button'
          variant='link'
          fontWeight='normal'
          _hover={{ color: 'gray.600' }}
        >
          Choose a file or drag and drop
        </Button>
      </Flex>

      {error && !Array.isArray(error) && (
        <FormErrorMessage as='span'>{error.message}</FormErrorMessage>
      )}

      {files.length > 0 && (
        <SelectedFileList files={files} onDelete={handleDelete} error={error} />
      )}
    </FormControl>
  );
};

export { InputControlledDropzone };
