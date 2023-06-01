import { Controller, SubmitHandler, useForm } from "react-hook-form";
import {
  Checkbox,
  FormControl,
  FormErrorMessage,
  HStack,
  Radio,
  RadioGroup,
} from "@chakra-ui/react";

import { GridColumnName } from "../../Types";
import { BinSize, TForm } from "./types";
import { FreqDist } from "./types";
import { CheckboxGroupWrapper } from "../../components/CheckboxGroupWrapper";
import { getVarName } from "../../utils/getColumnNameAndValues";
import { InputField } from "../../components/InputField";
import { isFiniteNumber } from "../../utils/validators";
import { useContext } from "react";
import { DataColumnsContext } from "../../contexts/DataColumnsContext";

type Props = {
  onSubmit: SubmitHandler<TForm>;
  formId: string;
  defaultValues: TForm;
};

export const StatForm = ({ onSubmit, formId, defaultValues }: Props) => {
  const cols = useContext(DataColumnsContext);

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
        data={(Object.keys(cols) as GridColumnName[])
          .sort()
          .map((colHeader) => ({
            title: getVarName(cols, colHeader, watch("withLabel")),
            value: colHeader,
          }))}
        control={control}
        defaultValue={defaultValues.columns}
        rules={{ required: "Select at least one column" }}
        error={errors["columns"]}
      />

      {Object.keys(cols).length > 0 && (
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

      <CheckboxGroupWrapper
        label="Statistics"
        name="options"
        data={[...FreqDist]}
        control={control}
        defaultValue={defaultValues.options}
        rules={{ required: "Select at least one statistic" }}
        error={errors["options"]}
      />

      <FormControl isInvalid={Boolean(errors.method)}>
        <Controller
          name="method"
          control={control}
          rules={{ required: "This field is required" }}
          defaultValue={defaultValues.method}
          render={({ field }) => (
            <RadioGroup {...field}>
              <Radio value={BinSize.MANUAL}>Manual</Radio>

              <HStack
                ml={8}
                as="fieldset"
                disabled={watch("method") !== BinSize.MANUAL}
                opacity={watch("method") !== BinSize.MANUAL ? 0.5 : 1}
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
                      value: watch("method") === BinSize.MANUAL,
                      message: "This value is required",
                    },
                    validate: isFiniteNumber,
                  }}
                />
              </HStack>

              {/* <Radio value={BinSize.OTHER}>Other</Radio> */}
            </RadioGroup>
          )}
        />
        <FormErrorMessage as="span">{errors.method?.message}</FormErrorMessage>
      </FormControl>
    </form>
  );
};
