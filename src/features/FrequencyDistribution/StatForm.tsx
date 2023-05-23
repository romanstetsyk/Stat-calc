import { Controller, SubmitHandler, useForm } from "react-hook-form";
import {
  Box,
  Checkbox,
  CheckboxGroup,
  FormControl,
  FormLabel,
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
      <FormControl as="fieldset">
        <FormLabel as="legend" m={0}>
          Choose columns
        </FormLabel>

        <Box p={2}>
          {Object.keys(cols)
            .sort()
            .map((colHeader) => (
              <Checkbox
                display={"flex"}
                key={colHeader}
                value={colHeader}
                {...register("columns")}
              >
                {label
                  ? `${cols[colHeader as GridColumnName][0]} (${colHeader})`
                  : colHeader}
              </Checkbox>
            ))}

          <Controller
            name="label"
            control={control}
            defaultValue={label}
            render={({ field: { onChange, value } }) => (
              <Checkbox
                mt={4}
                display={"flex"}
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
        </Box>
      </FormControl>

      <FormControl as="fieldset">
        <FormLabel as="legend" m={0}>
          Statistics
        </FormLabel>
        <Box p={2}>
          <CheckboxGroup defaultValue={defaultValues.options}>
            {FreqDist.map((opt) => (
              <Checkbox
                display="flex"
                key={opt}
                value={opt}
                {...register("options")}
                size={"md"}
              >
                {opt}
              </Checkbox>
            ))}
          </CheckboxGroup>
        </Box>
      </FormControl>
    </form>
  );
};
