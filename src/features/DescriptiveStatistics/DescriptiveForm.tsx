import { SubmitHandler, useForm } from "react-hook-form";
import { Options, TFormSummary } from "./types";
import {
  Checkbox,
  CheckboxGroup,
  FormControl,
  FormLabel,
  Stack,
} from "@chakra-ui/react";
import { ColumnValues } from "../../Types";

type IProps = {
  onSubmit: SubmitHandler<TFormSummary>;
  cols: ColumnValues;
  formId: string;
  defaultValues: TFormSummary;
};

function DescriptiveForm({ onSubmit, cols, formId, defaultValues }: IProps) {
  const { handleSubmit, register } = useForm<TFormSummary>({ defaultValues });

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
      <FormControl>
        <FormLabel>Statistics</FormLabel>
        <CheckboxGroup defaultValue={defaultValues.options}>
          <Stack direction="column">
            {Object.values(Options).map((opt) => (
              <Checkbox key={opt} value={opt} {...register("options")}>
                {opt}
              </Checkbox>
            ))}
          </Stack>
        </CheckboxGroup>
      </FormControl>
    </form>
  );
}

export default DescriptiveForm;
