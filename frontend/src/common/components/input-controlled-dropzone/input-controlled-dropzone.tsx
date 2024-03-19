import { FormControl, FormErrorMessage } from '@chakra-ui/react';
import type { WithRequired } from '@shared/build/esm/index';
import { FILESIZE_LIMITS } from '@shared/build/esm/index';
import { useCallback, useEffect, useState } from 'react';
import type { DropzoneOptions, FileRejection } from 'react-dropzone';
import { useDropzone } from 'react-dropzone';
import type { FieldValues, UseControllerProps } from 'react-hook-form';

import { useController } from '~/common/hooks';

import { DeleteFile } from './delete-file';

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
  const [files, setFiles] = useState<File[]>([]);

  const {
    field: { onChange, ...restField },
    fieldState: { error, invalid },
  } = useController({
    name,
    control,
    defaultValue,
    rules,
    shouldUnregister,
    disabled,
  });

  const onDrop = useCallback(
    (acceptedFiles: File[], fileRejections: FileRejection[]): void => {
      setFiles((prev) => [
        ...prev,
        ...acceptedFiles,
        ...fileRejections.map((e) => e.file),
      ]);
    },
    [],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    multiple,
    onDrop,
    maxSize: FILESIZE_LIMITS.DATASET,
  });

  const deleteFile = useCallback((fileToDelete: File) => {
    return () => {
      setFiles((prev) => prev.filter((file) => file !== fileToDelete));
    };
  }, []);

  useEffect(() => {
    onChange(files);
  }, [files, onChange]);

  return (
    <FormControl isInvalid={invalid}>
      <div
        style={{
          color: 'blue',
          borderWidth: '1px',
          borderStyle: 'dashed',
          backgroundColor: isDragActive ? `#808080` : 'transparent',
          padding: '16px',
          cursor: 'pointer',
        }}
        {...getRootProps()}
      >
        {/**
         * Overwrite value with empty string because input type file
         * can only be set to empty string programmatically.
         * The actual value is set using `onChange` method from `useController`
         */}
        <input {...getInputProps({ onChange, ...restField })} value='' />
        <button type='button'>Choose a file or drag and drop</button>
      </div>

      {error && !Array.isArray(error) && (
        <FormErrorMessage as='span'>{error.message}</FormErrorMessage>
      )}

      {files.length > 0 && (
        <ul>
          {files.map((file, i) => (
            <li key={file.name + file.lastModified}>
              {file.name} <DeleteFile onClick={deleteFile(file)} />{' '}
              {Array.isArray(error) && error[i] && (
                <FormErrorMessage as='span'>
                  {error[i].message}
                </FormErrorMessage>
              )}
            </li>
          ))}
        </ul>
      )}
    </FormControl>
  );
};

export { InputControlledDropzone };
