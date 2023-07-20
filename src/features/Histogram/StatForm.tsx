import { useSyncExternalStore } from "react";
import {
  Checkbox,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Radio,
  RadioGroup,
} from "@chakra-ui/react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { CheckboxGroupWrapper } from "~/components/CheckboxGroupWrapper";
import { InputField } from "~/components/InputField";
import { dataStore } from "~/dataStore";
import { BinMethod } from "~/Types";
import { getVarName } from "~/utils/getColumnNameAndValues";
import { isFiniteNumber } from "~/utils/validators";
import { FrequencyDistribution, TForm } from "./types";

type Props = {
  onSubmit: SubmitHandler<TForm>;
  formId: string;
  defaultValues: TForm;
};

export const StatForm = ({ onSubmit, formId, defaultValues }: Props) => {
  const { colData } = useSyncExternalStore(
    dataStore.subscribe,
    dataStore.getSnapshot
  );

  const {
    handleSubmit,
    control,
    register,
    watch,
    formState: { errors },
  } = useForm<TForm>({
    defaultValues,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} id={formId}>
      <CheckboxGroupWrapper
        label="Choose columns"
        name="columns"
        data={Object.keys(colData).map((colHeader) => ({
          title: getVarName(colData, Number(colHeader), watch("withLabel")),
          value: colHeader,
        }))}
        control={control}
        defaultValue={defaultValues.columns}
        rules={{ required: "Select at least one column" }}
        error={errors["columns"]}
      />

      {Object.keys(colData).length > 0 && (
        <Controller
          name="withLabel"
          control={control}
          defaultValue={defaultValues.withLabel}
          render={({ field: { onChange, value } }) => (
            <Checkbox
              id={"withLabel" + formId}
              pl={2}
              display={"flex"}
              isChecked={value}
              onChange={onChange}
            >
              Labels in first row
            </Checkbox>
          )}
        />
      )}

      <FormControl isInvalid={Boolean(errors.method)} as={"fieldset"} my={8}>
        <FormLabel as="legend" m={0}>
          Select type
        </FormLabel>
        <Controller
          name="options"
          control={control}
          rules={{ required: "This field is required" }}
          defaultValue={defaultValues.options}
          render={({ field: { onChange, ...rest } }) => (
            <RadioGroup
              onChange={(value: FrequencyDistribution) => onChange(value)}
              {...rest}
              display={"flex"}
              flexDirection={"column"}
            >
              {FrequencyDistribution.map((opt) => (
                <Radio key={opt} value={opt}>
                  {opt}
                </Radio>
              ))}
            </RadioGroup>
          )}
        />
        <FormErrorMessage as="span">{errors.method?.message}</FormErrorMessage>
      </FormControl>

      <FormControl isInvalid={Boolean(errors.method)}>
        <Controller
          name="method"
          control={control}
          rules={{ required: "This field is required" }}
          defaultValue={defaultValues.method}
          render={({ field: { onChange, ...rest } }) => (
            <RadioGroup
              onChange={(value: BinMethod) => onChange(value)}
              {...rest}
            >
              <Radio value={BinMethod.MANUAL}>Manual</Radio>

              <HStack
                ml={8}
                as="fieldset"
                disabled={watch("method") !== BinMethod.MANUAL}
                opacity={watch("method") !== BinMethod.MANUAL ? 0.5 : 1}
              >
                <InputField
                  name="manual.start"
                  label="Start"
                  register={register}
                  error={errors?.manual?.start}
                  rules={{
                    validate: (value) =>
                      watch("method") !== BinMethod.MANUAL ||
                      value === "" ||
                      isFiniteNumber(value),
                  }}
                />
                <InputField
                  name="manual.width"
                  label="Width"
                  register={register}
                  error={errors?.manual?.width}
                  rules={{
                    required: {
                      value: watch("method") === BinMethod.MANUAL,
                      message: "This value is required",
                    },
                    validate: (value) =>
                      watch("method") !== BinMethod.MANUAL ||
                      isFiniteNumber(value),
                  }}
                />
              </HStack>

              <Radio value={BinMethod.SQUARE_ROOT}>Square Root</Radio>

              <HStack
                ml={8}
                as="fieldset"
                disabled={watch("method") !== BinMethod.SQUARE_ROOT}
                opacity={watch("method") !== BinMethod.SQUARE_ROOT ? 0.5 : 1}
              >
                <InputField
                  name="squareRoot.start"
                  label="Start"
                  register={register}
                  error={errors?.squareRoot?.start}
                  rules={{
                    validate: (value) =>
                      watch("method") !== BinMethod.SQUARE_ROOT ||
                      value === "" ||
                      isFiniteNumber(value),
                  }}
                />
              </HStack>
            </RadioGroup>
          )}
        />
        <FormErrorMessage as="span">{errors.method?.message}</FormErrorMessage>
      </FormControl>
    </form>
  );
};
