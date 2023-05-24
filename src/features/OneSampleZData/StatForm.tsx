import * as React from "react";
import { useState } from "react";
import {
  Box,
  Checkbox,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
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
import { TForm } from "./types";
import { ColumnValues, Perform } from "../../Types";

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

  const [perform, setPerform] = useState<Perform>(defaultValues.perform);

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
      <FormControl>
        <FormLabel>Choose columns</FormLabel>
        <Stack direction="column">
          {Object.keys(cols)
            .sort()
            .map((col) => (
              <Checkbox key={col} value={col} {...register("columns")}>
                {col}
              </Checkbox>
            ))}
        </Stack>
      </FormControl>

      <InputField
        label="Std. dev. (optional)"
        name="pstdev"
        register={register}
        rules={{ validate: (value) => value === "" || isPositiveNumber(value) }}
        error={errors.pstdev}
      />

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
                  <Stack
                    disabled={perform !== Perform.HypothesisTest}
                    as="fieldset"
                    ml={5}
                    opacity={perform === Perform.HypothesisTest ? "1" : "0.5"}
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
                            perform !== Perform.HypothesisTest ||
                            isFiniteNumber(value),
                          onChange: onMuValueChange,
                        }}
                        error={errors.mu0val}
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
                            perform !== Perform.HypothesisTest ||
                            isFiniteNumber(value),
                          onChange: onMuValueChange,
                        }}
                        error={errors.mu1val}
                      />
                    </Flex>
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
                  </Stack>
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
