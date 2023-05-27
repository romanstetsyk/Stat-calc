import { useState } from "react";
import {
  Box,
  Checkbox,
  FormControl,
  FormErrorMessage,
  Radio,
  RadioGroup,
  Stack,
} from "@chakra-ui/react";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { isPositiveNumber, isValidLevel } from "../../utils/validators";
import { InputField } from "../../components/InputField";
import { TForm } from "./types";
import { ColumnValues, GridColumnName, Perform } from "../../Types";
import { SelectField } from "../../components/SelectField";
import { getVarName } from "../../utils/getColumnNameAndValues";
import { HTFormPart } from "../../components/HTFormPart";
import { PopulationMean } from "../../components/HypothesisNotation";

type Props = {
  formId: string;
  onSubmit: SubmitHandler<TForm>;
  defaultValues: TForm;
  cols: ColumnValues;
};

export const StatForm = ({ formId, onSubmit, defaultValues, cols }: Props) => {
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

      <Box display="flex" flexDirection="row">
        <Box flex="1">
          <SelectField
            name="sample1"
            label="Sample 1"
            placeholder="Select column"
            register={register}
            rules={{ required: "This value is required" }}
            errors={errors}
          >
            {(Object.keys(cols) as GridColumnName[]).sort().map((colHeader) => (
              <option key={colHeader} value={colHeader}>
                {getVarName(cols, colHeader, watch("withLabel"))}
              </option>
            ))}
          </SelectField>

          <InputField
            label="Std. dev."
            name="stdev1"
            register={register}
            rules={{
              validate: (value) => value === "" || isPositiveNumber(value),
            }}
            error={errors.stdev1}
          />
        </Box>
        <Box flex="1">
          <SelectField
            name="sample2"
            label="Sample 2"
            placeholder="Select column"
            register={register}
            rules={{ required: "This value is required" }}
            errors={errors}
          >
            {(Object.keys(cols) as GridColumnName[]).sort().map((colHeader) => (
              <option key={colHeader} value={colHeader}>
                {getVarName(cols, colHeader, watch("withLabel"))}
              </option>
            ))}
          </SelectField>
          <InputField
            label="Std. dev."
            name="stdev2"
            register={register}
            rules={{
              validate: (value) => value === "" || isPositiveNumber(value),
            }}
            error={errors.stdev2}
          />
        </Box>
      </Box>

      <FormControl isInvalid={Boolean(errors.perform)}>
        <Controller
          name="perform"
          control={control}
          rules={{ required: "This field is required" }}
          defaultValue={perform}
          render={({ field: { onChange, value } }) => (
            <RadioGroup
              onChange={(value) => {
                setPerform(
                  value === Perform.HypothesisTest
                    ? Perform.HypothesisTest
                    : Perform.ConfidenceInerval
                );
                onChange(value);
              }}
              value={value}
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
