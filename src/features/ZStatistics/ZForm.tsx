import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  Radio,
  RadioGroup,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import {
  isFiniteNumber,
  isIntegerGreaterThanOne,
  isPositiveNumber,
} from "../../utils/validators";
import InputField from "../../components/InputField";
import * as React from "react";

enum PerformType {
  hypothesisTest = "hypothesisTest",
  confidenceInterval = "confidenceInterval",
}

type Inputs = {
  xbar: string;
  stdev: string;
  n: string;
  perform: PerformType;
};

function ZForm() {
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = (data) => console.log(data);

  const [perform, setPerform] = React.useState<PerformType>(
    PerformType.hypothesisTest
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <InputField
        label="Sample mean"
        name="xbar"
        register={register}
        rules={{
          required: "This value is required",
          validate: isFiniteNumber,
        }}
        errors={errors}
      />

      <InputField
        label="Std. dev."
        name="stdev"
        register={register}
        rules={{
          required: "This value is required",
          validate: isPositiveNumber,
        }}
        errors={errors}
      />

      <InputField
        label="Sample size"
        name="n"
        register={register}
        rules={{
          required: "This value is required",
          validate: isIntegerGreaterThanOne,
        }}
        errors={errors}
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
                  <Text
                    ml="4"
                    opacity={
                      perform === PerformType.hypothesisTest ? "1" : "0.5"
                    }
                  >
                    Some text here
                  </Text>
                </Box>
                <Box flex="1">
                  <>
                    <Radio value={PerformType.confidenceInterval}>
                      Confidence Interval
                    </Radio>
                    <Text
                      ml="4"
                      opacity={
                        perform === PerformType.confidenceInterval ? "1" : "0.5"
                      }
                    >
                      Some text here
                    </Text>
                  </>
                </Box>
              </Box>
            </RadioGroup>
          )}
        />
        <FormErrorMessage as="span">{errors.perform?.message}</FormErrorMessage>
      </FormControl>

      <Button type="submit" colorScheme="teal">
        Calculate
      </Button>
    </form>
  );
}

export default ZForm;
