import { Controller, SubmitHandler, useForm } from "react-hook-form";
import {
  Checkbox,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Radio,
  RadioGroup,
} from "@chakra-ui/react";

import { GridColumnName } from "../../Types";
import { BinMethod, FreqDist } from "src/features/GroupNumericData/types";
import { CheckboxGroupWrapper } from "../../components/CheckboxGroupWrapper";
import { getVarName } from "../../utils/getColumnNameAndValues";
import { InputField } from "../../components/InputField";
import { isFiniteNumber } from "../../utils/validators";
import { useContext } from "react";
import { DataColumnsContext } from "../../contexts/DataColumnsContext";
import { TForm } from "./types";

type Props = {
  onSubmit: SubmitHandler<TForm>;
  formId: string;
  defaultValues: TForm;
};

export const StatForm = ({ onSubmit, formId, defaultValues }: Props) => {
  const { columnData } = useContext(DataColumnsContext);

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
        data={(Object.keys(columnData) as GridColumnName[])
          .sort()
          .map((colHeader) => ({
            title: getVarName(columnData, colHeader, watch("withLabel")),
            value: colHeader,
          }))}
        control={control}
        defaultValue={defaultValues.columns}
        rules={{ required: "Select at least one column" }}
        error={errors["columns"]}
      />

      {Object.keys(columnData).length > 0 && (
        <Controller
          name="withLabel"
          control={control}
          defaultValue={defaultValues.withLabel}
          render={({ field: { onChange, value } }) => (
            <Checkbox
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
          render={({ field }) => (
            <RadioGroup {...field} display={"flex"} flexDirection={"column"}>
              {FreqDist.map((opt) => (
                <Radio value={opt}>{opt}</Radio>
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
          render={({ field }) => (
            <RadioGroup {...field}>
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
                    validate: (value) => value === "" || isFiniteNumber(value),
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
                    validate: isFiniteNumber,
                  }}
                />
              </HStack>

              {/* <Radio value={BinMethod.OTHER}>Other</Radio> */}
            </RadioGroup>
          )}
        />
        <FormErrorMessage as="span">{errors.method?.message}</FormErrorMessage>
      </FormControl>
    </form>
  );
};
