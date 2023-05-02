import { SubmitHandler, useForm } from "react-hook-form";
import { TFormSummary } from "./types";
import { Checkbox, FormControl, FormLabel, Stack } from "@chakra-ui/react";
import { ColumnValues } from "../../Types";

type IProps = {
  onSubmit: SubmitHandler<TFormSummary>;
  cols: ColumnValues;
  formId: string;
  defaultValues: TFormSummary;
};

function DescriptiveForm({ onSubmit, cols, formId, defaultValues }: IProps) {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<TFormSummary>({ defaultValues });

  return (
    <form onSubmit={handleSubmit(onSubmit)} id={formId}>
      <FormControl>
        <FormLabel>Choose columns</FormLabel>
        <Stack direction="column">
          {Object.keys(cols).map((col) => (
            <Checkbox key={col} value={col} {...register("columns")}>
              {col}
            </Checkbox>
          ))}
        </Stack>
      </FormControl>
    </form>
  );
}

export default DescriptiveForm;
