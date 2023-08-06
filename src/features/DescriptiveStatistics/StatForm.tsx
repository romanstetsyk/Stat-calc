import { useSyncExternalStore } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { AskLabelCheckbox, FormWraper } from "~/components/StatForm";
import { CheckboxGroupWrapper } from "~/components/StatForm/CheckboxGroupWrapper";
import { dataStore } from "~/dataStore";
import { getVarName } from "~/utils/getColumnNameAndValues";
import { SampleStatistics, TForm } from "./types";

type Props = {
  onSubmit: SubmitHandler<TForm>;
  formId: string;
  defaultValues: TForm;
};

export const StatForm = ({ onSubmit, formId, defaultValues }: Props) => {
  const { colData } = useSyncExternalStore(
    dataStore.subscribe,
    dataStore.getSnapshot
  );

  const {
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<TForm>({ defaultValues });

  return (
    <FormWraper onSubmit={handleSubmit(onSubmit)} formId={formId}>
      {colData.length > 0 && (
        <Controller
          name="withLabel"
          control={control}
          defaultValue={defaultValues.withLabel}
          render={({ field }) => <AskLabelCheckbox {...field} />}
        />
      )}

      <CheckboxGroupWrapper
        label="Choose columns:"
        name="columns"
        data={Object.keys(colData).map((colHeader) => ({
          title: getVarName(colData, Number(colHeader), watch("withLabel")),
          value: colHeader,
        }))}
        control={control}
        defaultValue={defaultValues.columns}
        rules={{ required: "Select at least one column" }}
        error={errors["columns"]}
      />

      <CheckboxGroupWrapper
        label="Statistics:"
        name="options"
        data={[...SampleStatistics]}
        control={control}
        defaultValue={defaultValues.options}
        rules={{ required: "Select at least one statistic" }}
        error={errors["options"]}
      />
    </FormWraper>
  );
};
