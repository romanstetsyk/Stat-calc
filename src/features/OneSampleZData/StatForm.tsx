import { useContext, useState } from "react";
import {
  Box,
  Checkbox,
  FormControl,
  FormErrorMessage,
  Radio,
  RadioGroup,
  Stack,
} from "@chakra-ui/react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { CheckboxGroupWrapper } from "~/components/CheckboxGroupWrapper";
import { HTFormPart } from "~/components/HTFormPart";
import { PopulationMean } from "~/components/HypothesisNotation";
import { InputField } from "~/components/InputField";
import { DataColumnsContext } from "~/contexts/DataColumnsContext";
import { GridColumnName, Perform } from "~/Types";
import { getVarName } from "~/utils/getColumnNameAndValues";
import { isPositiveNumber, isValidLevel } from "~/utils/validators";
import { TForm } from "./types";

type Props = {
  formId: string;
  onSubmit: SubmitHandler<TForm>;
  defaultValues: TForm;
};

export const StatForm = ({ formId, onSubmit, defaultValues }: Props) => {
  const { columnData } = useContext(DataColumnsContext);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm<TForm>({ defaultValues });

  const [perform, setPerform] = useState<Perform>(defaultValues.perform);

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

      <InputField
        label="Std. dev. (optional)"
        name="knownStdev"
        register={register}
        rules={{ validate: (value) => value === "" || isPositiveNumber(value) }}
        error={errors.knownStdev}
      />

      <FormControl isInvalid={Boolean(errors.perform)}>
        <Controller
          name="perform"
          control={control}
          rules={{ required: "This field is required" }}
          defaultValue={perform}
          render={({ field: { onChange, ...rest } }) => (
            <RadioGroup
              onChange={(value: Perform) => {
                setPerform(
                  value === Perform.HypothesisTest
                    ? Perform.HypothesisTest
                    : Perform.ConfidenceInerval
                );
                onChange(value);
              }}
              {...rest}
            >
              <Box display="flex" flexDirection="row">
                <Box flex="1">
                  <Radio value={Perform.HypothesisTest}>Hypothesis Test</Radio>

                  <HTFormPart
                    param={<PopulationMean />}
                    alternative="alternative"
                    alternativeDefault={defaultValues.alternative}
                    nullValue="nullValue"
                    nullValueDefault={defaultValues.nullValue}
                    disabled={perform !== Perform.HypothesisTest}
                    control={control}
                    setValue={setValue}
                    nullError={errors.nullValue}
                  >
                    <InputField
                      label="&alpha;"
                      name="alpha"
                      register={register}
                      rules={{
                        required: "This value is required",
                        validate: (value) =>
                          perform !== Perform.HypothesisTest ||
                          isValidLevel(value),
                      }}
                      error={errors.alpha}
                    />
                  </HTFormPart>
                </Box>
                <Box flex="1">
                  <>
                    <Radio value={Perform.ConfidenceInerval}>
                      Confidence Interval
                    </Radio>
                    <Stack
                      disabled={perform !== Perform.ConfidenceInerval}
                      as="fieldset"
                      ml={5}
                      opacity={
                        perform === Perform.ConfidenceInerval ? "1" : "0.5"
                      }
                    >
                      <InputField
                        label="Level"
                        name="level"
                        register={register}
                        rules={{
                          required: "This value is required",
                          validate: (value) =>
                            perform !== Perform.ConfidenceInerval ||
                            isValidLevel(value),
                        }}
                        error={errors.level}
                      />
                    </Stack>
                  </>
                </Box>
              </Box>
            </RadioGroup>
          )}
        />
        <FormErrorMessage as="span">{errors.perform?.message}</FormErrorMessage>
      </FormControl>
    </form>
  );
};
