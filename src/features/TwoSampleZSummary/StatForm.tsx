import { useState } from "react";
import {
  Box,
  FormControl,
  FormErrorMessage,
  Radio,
  RadioGroup,
  Stack,
} from "@chakra-ui/react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { HTFormPart } from "~/components/HTFormPart";
import { PopulationMean } from "~/components/HypothesisNotation";
import { InputField } from "~/components/InputField";
import { Perform } from "~/Types";
import {
  isFiniteNumber,
  isIntegerGreaterThanOne,
  isPositiveNumber,
  isValidLevel,
} from "~/utils/validators";
import { TForm } from "./types";

type Props = {
  formId: string;
  onSubmit: SubmitHandler<TForm>;
  defaultValues: TForm;
};

export const StatForm = ({ formId, onSubmit, defaultValues }: Props) => {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<TForm>({ defaultValues });

  const [perform, setPerform] = useState<Perform>(defaultValues.perform);

  return (
    <form onSubmit={handleSubmit(onSubmit)} id={formId}>
      <Box display="flex" flexDirection="row">
        <Box flex="1">
          <InputField
            label="Sample mean"
            name="xbar1"
            register={register}
            rules={{
              required: "This value is required",
              validate: isFiniteNumber,
            }}
            error={errors.xbar1}
          />

          <InputField
            label="Std. dev."
            name="stdev1"
            register={register}
            rules={{
              required: "This value is required",
              validate: isPositiveNumber,
            }}
            error={errors.stdev1}
          />

          <InputField
            label="Sample size"
            name="n1"
            register={register}
            rules={{
              required: "This value is required",
              validate: isIntegerGreaterThanOne,
            }}
            error={errors.n1}
          />
        </Box>
        <Box flex="1">
          <InputField
            label="Sample mean"
            name="xbar2"
            register={register}
            rules={{
              required: "This value is required",
              validate: isFiniteNumber,
            }}
            error={errors.xbar2}
          />

          <InputField
            label="Std. dev."
            name="stdev2"
            register={register}
            rules={{
              required: "This value is required",
              validate: isPositiveNumber,
            }}
            error={errors.stdev2}
          />

          <InputField
            label="Sample size"
            name="n2"
            register={register}
            rules={{
              required: "This value is required",
              validate: isIntegerGreaterThanOne,
            }}
            error={errors.n2}
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
