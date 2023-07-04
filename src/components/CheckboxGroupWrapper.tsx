import {
  Box,
  Checkbox,
  CheckboxGroup,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Text,
} from "@chakra-ui/react";
import {
  Control,
  Controller,
  FieldError,
  FieldValues,
  Merge,
  Path,
  PathValue,
  RegisterOptions,
} from "react-hook-form";

type Props<T extends FieldValues> = {
  name: Path<T>;
  control: Control<T>;
  data: { title: string; value: string }[] | string[];
  defaultValue: PathValue<T, Path<T>>;
  label?: string;
  rules?: RegisterOptions;
  error?: Merge<FieldError, (FieldError | undefined)[]>;
};

export const CheckboxGroupWrapper = <T extends FieldValues>({
  name,
  control,
  data,
  defaultValue,
  label,
  rules,
  error,
}: Props<T>) => {
  return (
    <FormControl isInvalid={Boolean(error)} as="fieldset" my={2}>
      {label && (
        <FormLabel as="legend" m={0}>
          {label}
        </FormLabel>
      )}
      <Box p={2}>
        {data.length > 0 ? (
          <>
            <Controller
              defaultValue={defaultValue}
              name={name}
              control={control}
              rules={rules}
              render={({
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                field: { ref: _ref, ...field },
              }) => (
                <CheckboxGroup {...field}>
                  {data
                    .map((e) =>
                      typeof e === "string" ? { title: e, value: e } : e
                    )
                    .map(({ title, value }) => (
                      <Checkbox
                        key={value}
                        name={name}
                        value={value}
                        display="flex"
                      >
                        {title}
                      </Checkbox>
                    ))}
                </CheckboxGroup>
              )}
            />

            <FormErrorMessage>
              {error?.type === "required" && error?.message}
            </FormErrorMessage>
          </>
        ) : (
          <Text>No data in the table</Text>
        )}
      </Box>
    </FormControl>
  );
};
