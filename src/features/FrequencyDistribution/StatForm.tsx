import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { Checkbox } from "@chakra-ui/react";

import { GridColumnName } from "../../Types";
import { TForm } from "./types";
import { FreqDist } from "./types";
import { CheckboxGroupWrapper } from "../../components/CheckboxGroupWrapper";
import { getVarName } from "../../utils/getColumnNameAndValues";
import { useContext } from "react";
import { DataColumnsContext } from "../../contexts/DataColumnsContext";

type Props = {
  onSubmit: SubmitHandler<TForm>;
  formId: string;
  defaultValues: TForm;
};

export const StatForm = ({ onSubmit, formId, defaultValues }: Props) => {
  const cols = useContext(DataColumnsContext);

  const {
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<TForm>({
    defaultValues,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} id={formId}>
      <CheckboxGroupWrapper
        label="Choose columns"
        name="columns"
        data={(Object.keys(cols) as GridColumnName[])
          .sort()
          .map((colHeader) => ({
            title: getVarName(cols, colHeader, watch("withLabel")),
            value: colHeader,
          }))}
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
              onChange={onChange}
            >
              Labels in first row
            </Checkbox>
          )}
        />
      )}

      <CheckboxGroupWrapper
        label="Statistics"
        name="options"
        data={[...FreqDist]}
        control={control}
        defaultValue={defaultValues.options}
        rules={{ required: "Select at least one statistic" }}
        error={errors["options"]}
      />
    </form>
  );
};
