import * as React from "react";
import { useState } from "react";
import {
  Box,
  Flex,
  FormControl,
  FormErrorMessage,
  Radio,
  RadioGroup,
  Select,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import {
  isFiniteNumber,
  isPositiveNumber,
  isValidLevel,
} from "../../utils/validators";
import { InputField } from "../../components/InputField";
import { TForm, PerformType } from "./types";
import { ColumnValues } from "../../Types";
import { SelectField } from "../../components/SelectField";

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
    trigger,
    formState: { errors },
  } = useForm<TForm>({ defaultValues });

  const [perform, setPerform] = useState<PerformType>(defaultValues.perform);

  const onSelectChange = (event: React.ChangeEvent) => {
    const value = (event.target as HTMLInputElement).value;
    switch (value) {
      case "eq":
        setValue("mu1dir", "ne");
        break;
      case "ge":
        setValue("mu1dir", "lt");
        break;
      case "le":
        setValue("mu1dir", "gt");
        break;
      case "ne":
        setValue("mu0dir", "eq");
        break;
      case "gt":
        setValue("mu0dir", "le");
        break;
      case "lt":
        setValue("mu0dir", "ge");
        break;
      default:
        throw new Error("Unknown hypothesis test sign combination");
    }
  };

  const onMuValueChange = (event: React.ChangeEvent) => {
    const { value } = event.target as HTMLInputElement;
    setValue("mu0val", value);
    trigger("mu0val");
    setValue("mu1val", value);
    trigger("mu1val");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} id={formId}>
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
            {Object.keys(cols)
              .sort()
              .map((col) => (
                <option key={col} value={col}>
                  {col}
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
            errors={errors}
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
            {Object.keys(cols)
              .sort()
              .map((col) => (
                <option key={col} value={col}>
                  {col}
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
            errors={errors}
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
                  value === PerformType.hypothesisTest
                    ? PerformType.hypothesisTest
                    : PerformType.confidenceInterval
                );
                onChange(value);
              }}
              value={value}
            >
              <Box display="flex" flexDirection="row">
                <Box flex="1">
                  <Radio value={PerformType.hypothesisTest}>
                    Hypothesis Test
                  </Radio>
                  <Stack
                    disabled={perform !== PerformType.hypothesisTest}
                    as="fieldset"
                    ml={5}
                    opacity={
                      perform === PerformType.hypothesisTest ? "1" : "0.5"
                    }
                  >
                    <Flex gap={2} alignItems="baseline">
                      <Text as="label" htmlFor="mu0val">
                        H<sub>0</sub>: &mu;
                      </Text>
                      <FormControl width="50px">
                        <Select
                          {...register("mu0dir")}
                          size="xs"
                          defaultValue="eq"
                          width="50px"
                          onChange={onSelectChange}
                        >
                          <option value="eq">=</option>
                          <option value="ge">&ge;</option>
                          <option value="le">&le;</option>
                        </Select>
                      </FormControl>
                      <InputField
                        name="mu0val"
                        register={register}
                        rules={{
                          required: "This value is required",
                          validate: (value) =>
                            perform !== PerformType.hypothesisTest ||
                            isFiniteNumber(value),
                          onChange: onMuValueChange,
                        }}
                        errors={errors}
                      />
                    </Flex>

                    <Flex gap={2}>
                      <Text>
                        H<sub>a</sub>: &mu;
                      </Text>
                      <FormControl width="50px">
                        <Select
                          {...register("mu1dir")}
                          size="xs"
                          defaultValue="ne"
                          width="50px"
                          onChange={onSelectChange}
                        >
                          <option value="ne">&ne;</option>
                          <option value="gt">&gt;</option>
                          <option value="lt">&lt;</option>
                        </Select>
                      </FormControl>
                      <InputField
                        onChange={onMuValueChange}
                        name="mu1val"
                        register={register}
                        rules={{
                          required: "This value is required",
                          validate: (value) =>
                            perform !== PerformType.hypothesisTest ||
                            isFiniteNumber(value),
                          onChange: onMuValueChange,
                        }}
                        errors={errors}
                      />
                    </Flex>
                    <InputField
                      label="&alpha;"
                      name="alpha"
                      register={register}
                      rules={{
                        required: "This value is required",
                        validate: (value) =>
                          perform !== PerformType.hypothesisTest ||
                          isValidLevel(value),
                      }}
                      errors={errors}
                    />
                  </Stack>
                </Box>
                <Box flex="1">
                  <>
                    <Radio value={PerformType.confidenceInterval}>
                      Confidence Interval
                    </Radio>
                    <Stack
                      disabled={perform !== PerformType.confidenceInterval}
                      as="fieldset"
                      ml={5}
                      opacity={
                        perform === PerformType.confidenceInterval ? "1" : "0.5"
                      }
                    >
                      <InputField
                        label="Level"
                        name="level"
                        register={register}
                        rules={{
                          required: "This value is required",
                          validate: (value) =>
                            perform !== PerformType.confidenceInterval ||
                            isValidLevel(value),
                        }}
                        errors={errors}
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
