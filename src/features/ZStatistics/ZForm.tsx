import { Button } from "@chakra-ui/react";
import { useForm, SubmitHandler } from "react-hook-form";
import { isFiniteNumber, isPositiveNumber } from "../../utils/validators";
import FormInput from "../../components/Input";

type Inputs = {
  sampleMean: string;
  standardDeviation: string;
};

function ZForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = (data) => console.log(data);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormInput
        label="Sample mean"
        name="sampleMean"
        register={register}
        rules={{
          required: "This value is required",
          validate: isFiniteNumber,
        }}
        errors={errors}
      />

      <FormInput
        label="Std. dev."
        name="standardDeviation"
        register={register}
        rules={{
          required: "This value is required",
          validate: isPositiveNumber,
        }}
        errors={errors}
      />

      <Button type="submit" colorScheme="teal">
        Calculate
      </Button>
    </form>
  );
}

export default ZForm;
