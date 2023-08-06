import { useSyncExternalStore } from "react";
import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Radio,
} from "@chakra-ui/react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import {
  AskLabelCheckbox,
  BinManual,
  BinSquareRoot,
  CheckboxGroupWrapper,
  FormWraper,
  LegendWrapper,
  RadioGroupWrapper,
} from "~/components/StatForm";
import { dataStore } from "~/dataStore";
import { BinMethod } from "~/Types";
import { getVarName } from "~/utils/getColumnNameAndValues";
import { FrequencyDistribution, TForm } from "./types";

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
    register,
    watch,
    formState: { errors },
  } = useForm<TForm>({
    defaultValues,
  });

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
        label="Choose columns"
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

      <FormControl isInvalid={Boolean(errors.method)} as={"fieldset"}>
        <LegendWrapper elem={FormLabel} legend="Statiscics:" />

        <Controller
          name="options"
          control={control}
          rules={{ required: "This field is required" }}
          defaultValue={defaultValues.options}
          render={({ field }) => (
            <RadioGroupWrapper<FrequencyDistribution>
              {...field}
              flexDirection="column"
              gap={0}
            >
              {FrequencyDistribution.map((opt) => (
                <Radio key={opt} value={opt}>
                  {opt}
                </Radio>
              ))}
            </RadioGroupWrapper>
          )}
        />
        <FormErrorMessage as="span">{errors.method?.message}</FormErrorMessage>
      </FormControl>

      <FormControl isInvalid={Boolean(errors.method)} as={"fieldset"}>
        <LegendWrapper elem={FormLabel} legend="Binning method:" />

        <Controller
          name="method"
          control={control}
          rules={{ required: "This field is required" }}
          defaultValue={defaultValues.method}
          render={({ field }) => (
            <RadioGroupWrapper<BinMethod>
              {...field}
              flexDirection="column"
              gap={0}
            >
              <Radio value={BinMethod.MANUAL}>Manual</Radio>

              <BinManual
                ml={6}
                register={register}
                disabled={watch("method") !== BinMethod.MANUAL}
                start="manual.start"
                startError={errors.manual?.start}
                width="manual.width"
                widthError={errors.manual?.width}
              />

              <Radio value={BinMethod.SQUARE_ROOT}>Square Root</Radio>

              <BinSquareRoot
                ml={6}
                register={register}
                disabled={watch("method") !== BinMethod.SQUARE_ROOT}
                start="squareRoot.start"
                startError={errors.squareRoot?.start}
              />
            </RadioGroupWrapper>
          )}
        />
        <FormErrorMessage as="span">{errors.method?.message}</FormErrorMessage>
      </FormControl>
    </FormWraper>
  );
};
