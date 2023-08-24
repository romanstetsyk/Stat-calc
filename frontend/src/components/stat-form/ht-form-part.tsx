import type { FlexProps } from '@chakra-ui/react';
import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Select,
} from '@chakra-ui/react';
import { useId, useState } from 'react';
import type {
  Control,
  FieldError,
  FieldValues,
  Path,
  PathValue,
  RegisterOptions,
  UseFormSetValue,
} from 'react-hook-form';
import { Controller } from 'react-hook-form';

import { H0Sign, H1Sign, HypothesisSignMap } from '~/types';
import { isFiniteNumber } from '~/utils/validators';

import { FieldStack } from './field-stack';

type Props<T extends FieldValues> = {
  param: JSX.Element;
  alternative: Path<T>;
  alternativeDefault: PathValue<T, Path<T>>;
  nullValue: Path<T>;
  nullValueDefault: PathValue<T, Path<T>>;
  nullValueRules?: RegisterOptions;
  disabled: boolean;
  control: Control<T>;
  setValue: UseFormSetValue<T>;
  nullError?: FieldError;
  children?: React.ReactNode;
} & FlexProps;

const HTFormPart = <T extends FieldValues>({
  param,
  alternative,
  alternativeDefault,
  nullValue,
  nullValueDefault,
  disabled,
  control,
  nullError,
  children,
  setValue,
  ...restProps
}: Props<T>): JSX.Element => {
  const [nullSign, setNullSign] = useState<H0Sign>(
    HypothesisSignMap[alternativeDefault],
  );
  const [nullVal, setNullVal] = useState<string>(nullValueDefault);

  const nullId = useId();
  const direrctionId = useId();

  const onSelectChange = (event: React.ChangeEvent): void => {
    const { value } = event.target as HTMLInputElement;
    switch (value as H0Sign | H1Sign) {
      case 'equal': {
        setNullSign('equal');
        setValue(alternative, 'notEqual' as PathValue<T, Path<T>>);
        break;
      }
      case 'greaterThanEqual': {
        setNullSign('greaterThanEqual');
        setValue(alternative, 'lessThan' as PathValue<T, Path<T>>);
        break;
      }
      case 'lessThanEqual': {
        setNullSign('lessThanEqual');
        setValue(alternative, 'greaterThan' as PathValue<T, Path<T>>);
        break;
      }
      case 'notEqual': {
        setNullSign(HypothesisSignMap.notEqual);
        break;
      }
      case 'greaterThan': {
        setNullSign(HypothesisSignMap.greaterThan);
        break;
      }
      case 'lessThan': {
        setNullSign(HypothesisSignMap.lessThan);
        break;
      }
      default: {
        throw new Error('Unknown hypothesis test sign');
      }
    }
  };

  const onNullValueChange = (e: React.ChangeEvent): void => {
    const { value } = e.target as HTMLInputElement;
    setNullVal(value);
    setValue(nullValue, value as PathValue<T, Path<T>>);
  };

  return (
    <FieldStack
      disabled={disabled}
      opacity={disabled ? '0.5' : '1'}
      {...restProps}
    >
      <FormControl display='flex' gap={2} alignItems='start'>
        <FormLabel m={0} htmlFor={nullId} whiteSpace='nowrap'>
          H<sub>0</sub>: {param}
        </FormLabel>
        <Select
          name='nullSign'
          value={nullSign}
          minWidth={14}
          width={14}
          size='xs'
          onChange={onSelectChange}
        >
          {Object.entries(H0Sign).map(([key, value]) => (
            <option key={key} value={key}>
              {value}
            </option>
          ))}
        </Select>

        <Input
          id={nullId}
          value={nullVal}
          onChange={onNullValueChange}
          size='sm'
          height={6}
          width={20}
        />
      </FormControl>

      <FormControl display='flex' gap={2} alignItems='start'>
        <FormLabel m={0} htmlFor={direrctionId} whiteSpace='nowrap'>
          H<sub>a</sub>: {param}
        </FormLabel>

        <Controller
          defaultValue={alternativeDefault}
          name={alternative}
          control={control}
          rules={{
            required: { value: !disabled, message: 'This value is required' },
          }}
          render={({ field: { onChange, ...rest } }): JSX.Element => (
            <Select
              id={direrctionId}
              minWidth={14}
              width={14}
              size='xs'
              onChange={(e): void => {
                onSelectChange(e);
                onChange(e);
              }}
              {...rest}
            >
              {Object.entries(H1Sign).map(([key, value]) => (
                <option key={key} value={key}>
                  {value}
                </option>
              ))}
            </Select>
          )}
        />

        <FormControl
          isInvalid={Boolean(nullError)}
          display='flex'
          flexDirection='column'
          alignItems='baseline'
          width='auto'
        >
          <Controller
            defaultValue={nullValueDefault}
            name={nullValue}
            control={control}
            rules={{
              required: { value: !disabled, message: 'This value is required' },
              validate: (value) => disabled || isFiniteNumber(value),
            }}
            render={({ field: { onChange, ...rest } }): JSX.Element => (
              <Input
                width={20}
                size='sm'
                height={6}
                onChange={(e): void => {
                  onNullValueChange(e);
                  onChange(e);
                }}
                {...rest}
              />
            )}
          />
          <FormErrorMessage as='span'>
            {nullError?.type === 'required' && nullError.message}
            {nullError?.type === 'validate' &&
              `This value ${nullError.message}`}
          </FormErrorMessage>
        </FormControl>
      </FormControl>

      {children}
    </FieldStack>
  );
};

export { HTFormPart };
