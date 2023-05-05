import { SubmitHandler, useForm } from "react-hook-form";
import { Options, TForm } from "./types";
import {
  Checkbox,
  CheckboxGroup,
  FormControl,
  FormLabel,
  Stack,
} from "@chakra-ui/react";
import { ColumnValues } from "../../Types";

type IProps = {
  onSubmit: SubmitHandler<TForm>;
  cols: ColumnValues;
  formId: string;
  defaultValues: TForm;
};

function StatForm({ onSubmit, cols, formId, defaultValues }: IProps) {
  const { handleSubmit, register } = useForm<TForm>({ defaultValues });

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

export { StatForm };
