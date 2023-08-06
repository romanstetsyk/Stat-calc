import {
  Box,
  Checkbox,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Radio,
  Text,
} from "@chakra-ui/react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { PopulationMean } from "~/components/HypothesisNotation";
import {
  CIFormPart,
  FieldStack,
  FormWraper,
  HTFormPart,
  InputField,
  LegendWrapper,
  RadioGroupWrapper,
} from "~/components/StatForm";
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
    watch,
    formState: { errors },
  } = useForm<TForm>({ defaultValues });

  return (
    <FormWraper onSubmit={handleSubmit(onSubmit)} formId={formId}>
      <FieldStack>
        <LegendWrapper elem={Text} legend="Sample 1" />

        <InputField
          label="Sample mean"
          name="xbar"
          register={register}
          rules={{
            required: "This value is required",
            validate: isFiniteNumber,
          }}
          error={errors.xbar}
        />

        <InputField
          label="Std. dev."
          name="stdev"
          register={register}
          rules={{
            required: "This value is required",
            validate: isPositiveNumber,
          }}
          error={errors.stdev}
        />

        <InputField
          label="Sample size"
          name="n"
          register={register}
          rules={{
            required: "This value is required",
            validate: isIntegerGreaterThanOne,
          }}
          error={errors.n}
        />
      </FieldStack>

      <FormControl as="fieldset" isInvalid={Boolean(errors.perform)}>
        <LegendWrapper elem={FormLabel} legend="Perform:" />

        <Controller
          name="perform"
          control={control}
          rules={{ required: "This field is required" }}
          defaultValue={defaultValues.perform}
          render={({ field }) => (
            <RadioGroupWrapper {...field}>
              <Box flex="1">
                <Radio value={Perform.HypothesisTest} mb={2}>
                  Hypothesis Test
                </Radio>

                <HTFormPart
                  ml={6}
                  param={<PopulationMean />}
                  alternative="alternative"
                  alternativeDefault={defaultValues.alternative}
                  nullValue="nullValue"
                  nullValueDefault={defaultValues.nullValue}
                  disabled={watch("perform") !== Perform.HypothesisTest}
                  control={control}
                  setValue={setValue}
                  nullError={errors.nullValue}
                >
                  <InputField
                    label="&alpha;"
                    name="alpha"
                    register={register}
                    rules={{
                      required: {
                        value: watch("perform") === Perform.HypothesisTest,
                        message: "This value is required",
                      },
                      validate: (value) =>
                        watch("perform") !== Perform.HypothesisTest ||
                        isValidLevel(value),
                    }}
                    error={errors.alpha}
                  />
                </HTFormPart>
              </Box>
              <Box flex="1">
                <Radio value={Perform.ConfidenceInerval} mb={2}>
                  Confidence Interval
                </Radio>

                <CIFormPart
                  ml={6}
                  register={register}
                  disabled={watch("perform") !== Perform.ConfidenceInerval}
                  level="level"
                  levelError={errors.level}
                />
              </Box>
            </RadioGroupWrapper>
          )}
        />
        <FormErrorMessage as="span">{errors.perform?.message}</FormErrorMessage>
      </FormControl>

      {watch("perform") === Perform.HypothesisTest && (
        <FieldStack>
          <LegendWrapper elem={Text} legend="Optional tables:" />

          <Checkbox {...register("optional.confidenceInterval")}>
            ConfidenceInterval
          </Checkbox>
        </FieldStack>
      )}
    </FormWraper>
  );
};
