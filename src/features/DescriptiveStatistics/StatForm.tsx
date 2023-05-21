import { SubmitHandler, useForm } from "react-hook-form";
import {
  Checkbox,
  CheckboxGroup,
  FormControl,
  FormLabel,
  Stack,
} from "@chakra-ui/react";

import { ColumnValues } from "../../Types";
import { TForm } from "./types";
import { SampleStatistics } from "./types";

type Props = {
  onSubmit: SubmitHandler<TForm>;
  cols: ColumnValues;
  formId: string;
  defaultValues: TForm;
};

export const StatForm = ({ onSubmit, cols, formId, defaultValues }: Props) => {
  const { handleSubmit, register } = useForm<TForm>({ defaultValues });

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
      <FormControl>
        <FormLabel>Statistics</FormLabel>
        <CheckboxGroup defaultValue={defaultValues.options}>
          <Stack direction="column">
            {SampleStatistics.map((opt) => (
              <Checkbox key={opt} value={opt} {...register("options")}>
                {opt}
              </Checkbox>
            ))}
          </Stack>
        </CheckboxGroup>
      </FormControl>
    </form>
  );
};
