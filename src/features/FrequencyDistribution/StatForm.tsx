import { Controller, SubmitHandler, useForm } from "react-hook-form";
import {
  Checkbox,
  CheckboxGroup,
  FormControl,
  FormLabel,
  Stack,
} from "@chakra-ui/react";

import { ColumnValues, GridColumnName } from "../../Types";
import { TForm } from "./types";
import { FreqDist } from "./types";
import { useState } from "react";

type Props = {
  onSubmit: SubmitHandler<TForm>;
  cols: ColumnValues;
  formId: string;
  defaultValues: TForm;
};

export const StatForm = ({ onSubmit, cols, formId, defaultValues }: Props) => {
  const { handleSubmit, register, control } = useForm<TForm>({ defaultValues });

  const [label, setLabel] = useState<boolean>(defaultValues.label);

  return (
    <form onSubmit={handleSubmit(onSubmit)} id={formId}>
      <FormControl>
        <FormLabel>Choose columns</FormLabel>
        <Stack direction="column">
          {Object.keys(cols)
            .sort()
            .map((colHeader) => (
              <Checkbox
                key={colHeader}
                value={colHeader}
                {...register("columns")}
              >
                {label
                  ? `${cols[colHeader as GridColumnName][0]} (${colHeader})`
                  : colHeader}
              </Checkbox>
            ))}
        </Stack>
      </FormControl>

      <FormControl>
        <Controller
          name="label"
          control={control}
          defaultValue={label}
          render={({ field: { onChange, value } }) => (
            <Checkbox
              isChecked={value}
              onChange={(e) => {
                onChange(e);
                setLabel(e.target.checked);
              }}
            >
              Labels in first row
            </Checkbox>
          )}
        />
      </FormControl>

      <FormControl>
        <FormLabel>Statistics</FormLabel>
        <CheckboxGroup defaultValue={defaultValues.options}>
          <Stack direction="column">
            {FreqDist.map((opt) => (
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
