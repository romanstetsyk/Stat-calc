import {
  Stack,
  FormControl,
  Select,
  Input,
  FormErrorMessage,
  FormLabel,
} from "@chakra-ui/react";
import { useId, useState } from "react";

import {
  Control,
  Controller,
  FieldError,
  FieldValues,
  Path,
  PathValue,
  RegisterOptions,
  UseFormSetValue,
} from "react-hook-form";
import { H0Sign, H1Sign, HypothesisSignMap } from "../Types";
import { isFiniteNumber } from "../utils/validators";

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
};

export const HTFormPart = <T extends FieldValues>({
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
}: Props<T>) => {
  const [nullSign, setNullSign] = useState<H0Sign>(
    HypothesisSignMap[alternativeDefault]
  );
  const [nullVal, setNullVal] = useState<string>(nullValueDefault);

  const nullId = useId();
  const direrctionId = useId();

  const onSelectChange = (event: React.ChangeEvent) => {
    const { value } = event.target as HTMLInputElement;
    switch (value) {
      case "eq":
        setNullSign("eq");
        setValue(alternative, "ne" as PathValue<T, Path<T>>);
        break;
      case "ge":
        setNullSign("ge");
        setValue(alternative, "lt" as PathValue<T, Path<T>>);
        break;
      case "le":
        setNullSign("le");
        setValue(alternative, "gt" as PathValue<T, Path<T>>);
        break;
      case "ne":
        setNullSign("eq");
        break;
      case "gt":
        setNullSign("le");
        break;
      case "lt":
        setNullSign("ge");
        break;
      default:
        throw new Error("Unknown hypothesis test sign");
    }
  };

  const onNullValueChange = (e: React.ChangeEvent) => {
    const { value } = e.target as HTMLInputElement;
    setNullVal(value);
    setValue(nullValue, value as PathValue<T, Path<T>>);
  };

  return (
    <Stack
      disabled={disabled}
      as="fieldset"
      ml={5}
      opacity={disabled ? "0.5" : "1"}
    >
      <FormControl display="flex" gap={2} alignItems="start">
        <FormLabel m={0} htmlFor={nullId}>
          H<sub>0</sub>: {param}
        </FormLabel>
        <Select
          name="nullSign"
          value={nullSign}
          width="50px"
          size="xs"
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
          name={"asd"}
          value={nullVal}
          onChange={onNullValueChange}
          size="sm"
          height={6}
          width="80px"
        />
      </FormControl>

      <FormControl display="flex" gap={2} alignItems="start">
        <FormLabel m={0} htmlFor={direrctionId}>
          H<sub>a</sub>: {param}
        </FormLabel>

        <Controller
          defaultValue={alternativeDefault}
          name={alternative}
          control={control}
          render={({ field: { onBlur, onChange, value, name } }) => (
            <Select
              id={direrctionId}
              width="50px"
              size="xs"
              onBlur={onBlur}
              onChange={(e) => {
                onSelectChange(e);
                onChange(e);
              }}
              value={value}
              name={name}
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
          display="flex"
          flexDirection="column"
          alignItems="baseline"
          width="auto"
        >
          <Controller
            defaultValue={nullValueDefault}
            name={nullValue}
            control={control}
            rules={{
              required: "This value is required",
              validate: (value) => disabled || isFiniteNumber(value),
            }}
            render={({ field: { onBlur, onChange, value, name } }) => (
              <Input
                width="80px"
                size="sm"
                height={6}
                onBlur={onBlur}
                onChange={(e) => {
                  onNullValueChange(e);
                  onChange(e);
                }}
                value={value}
                name={name}
              />
            )}
          />
          <FormErrorMessage as="span">
            {nullError?.type === "required" && nullError?.message}
            {nullError?.type === "validate" &&
              `This value ${nullError?.message}`}
          </FormErrorMessage>
        </FormControl>
      </FormControl>

      {children}
    </Stack>
  );
};
