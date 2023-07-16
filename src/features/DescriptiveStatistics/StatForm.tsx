import { useSyncExternalStore } from "react";
import { Checkbox } from "@chakra-ui/react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { CheckboxGroupWrapper } from "~/components/CheckboxGroupWrapper";
import { dataStore } from "~/dataStore";
import { GridColumnName } from "~/Types";
import { getVarName } from "~/utils/getColumnNameAndValues";
import { SampleStatistics, TForm } from "./types";

type Props = {
  onSubmit: SubmitHandler<TForm>;
  formId: string;
  defaultValues: TForm;
};

export const StatForm = ({ onSubmit, formId, defaultValues }: Props) => {
  // const { columnData } = useContext(DataColumnsContext);
  const { columnData } = useSyncExternalStore(
    dataStore.subscribe,
    dataStore.getSnapshot
  );
  console.log(columnData);

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
        data={(Object.keys(columnData) as GridColumnName[])
          .sort()
          .map((colHeader) => ({
            title: getVarName(columnData, colHeader, watch("withLabel")),
            value: colHeader,
          }))}
        control={control}
        defaultValue={defaultValues.columns}
        rules={{ required: "Select at least one column" }}
        error={errors["columns"]}
      />

      {Object.keys(columnData).length > 0 && (
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
        data={[...SampleStatistics]}
        control={control}
        defaultValue={defaultValues.options}
        rules={{ required: "Select at least one statistic" }}
        error={errors["options"]}
      />
    </form>
  );
};
