import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { Checkbox } from "@chakra-ui/react";

import { ColumnValues, GridColumnName } from "../../Types";
import { TForm } from "./types";
import { SampleStatistics } from "./types";
import { CheckboxGroupWrapper } from "../../components/CheckboxGroupWrapper";

type Props = {
  onSubmit: SubmitHandler<TForm>;
  cols: ColumnValues;
  formId: string;
  defaultValues: TForm;
};

export const StatForm = ({ onSubmit, cols, formId, defaultValues }: Props) => {
  const {
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<TForm>({ defaultValues });

  return (
    <form onSubmit={handleSubmit(onSubmit)} id={formId}>
      <CheckboxGroupWrapper
        label="Choose columns"
        name="columns"
        data={
          watch("withLabel")
            ? Object.keys(cols)
                .sort()
                .map((colHeader) => ({
                  title: `${
                    cols[colHeader as GridColumnName][0]
                  } (${colHeader})`,
                  value: colHeader,
                }))
            : Object.keys(cols).sort()
        }
        control={control}
        defaultValue={defaultValues.columns}
        rules={{ required: "Select at least one column" }}
        error={errors["columns"]}
      />

      {Object.keys(cols).length > 0 && (
        <Controller
          name="withLabel"
          control={control}
          defaultValue={defaultValues.withLabel}
          render={({ field: { onChange, value } }) => (
            <Checkbox
              pl={2}
              display={"flex"}
              isChecked={value}
              onChange={(e) => {
                onChange(e);
                // setLabel(e.target.checked);
              }}
            >
              Labels in first row
            </Checkbox>
          )}
        />
      )}

      <CheckboxGroupWrapper
        label="Statistics"
        name="options"
        data={[...SampleStatistics]}
        control={control}
        defaultValue={defaultValues.options}
        rules={{ required: "Select at least one statistic" }}
        error={errors["options"]}
      />
    </form>
  );
};
