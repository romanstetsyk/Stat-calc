import type { UseEditableProps, UseEditableReturn } from '@chakra-ui/react';
import { useEditable as useEditableChakra } from '@chakra-ui/react';
import { joiResolver } from '@hookform/resolvers/joi';
import type { Schema } from 'joi';
import { useEffect, useState } from 'react';
import type {
  DefaultValues,
  FieldValues,
  Path,
  PathValue,
  SubmitHandler,
  UseFormProps,
  UseFormReturn,
} from 'react-hook-form';

import { useForm } from '~/common/hooks';

type Params<T extends FieldValues> = UseEditableProps &
  UseFormProps<T> & {
    fieldName: Path<T>;
    defaultValue: string;
    validationSchema: Schema;
    onFormSubmit: SubmitHandler<T>;
  };

const useEditable = <T extends FieldValues>({
  defaultValue,
  fieldName,
  validationSchema,
  onSubmit: onSubmitEditable,
  onFormSubmit,
  submitOnBlur,
}: Params<T>): UseEditableReturn & UseFormReturn<T> & { value: string } => {
  const [value, setValue] = useState(defaultValue);

  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  const resolver = joiResolver(validationSchema, {
    abortEarly: false,
    errors: { wrap: { label: false } },
  });

  const useFormReturn = useForm<T>({
    defaultValues: { [fieldName]: defaultValue } as DefaultValues<T>,
    mode: 'onSubmit',
    resolver,
  });

  const onChange = (nextValue: string): void => {
    setValue(nextValue);
  };

  const onSubmit: UseEditableProps['onSubmit'] = async (nextValue: string) => {
    if (onSubmitEditable) {
      onSubmitEditable(nextValue);
    }

    useFormReturn.setValue(fieldName, nextValue as PathValue<T, Path<T>>);

    const isValid = await useFormReturn.trigger(fieldName);

    if (isValid) {
      void useFormReturn.handleSubmit(onFormSubmit)();
      return;
    }

    setValue(defaultValue);
  };

  const useEditableReturn = useEditableChakra({
    defaultValue,
    isPreviewFocusable: true,
    onSubmit,
    onChange,
    submitOnBlur,
  });

  return { ...useEditableReturn, ...useFormReturn, value };
};

export { useEditable };
