import {
  InputProps,
  FormControl,
  FormLabel,
  FormHelperText,
  FormErrorMessage,
} from "@chakra-ui/react";
import { forwardRef } from "@chakra-ui/system";
import {
  Controller,
  ControllerProps,
  Control,
  FieldError,
  useFormState,
} from "react-hook-form";
import { CurrencyInput } from "@components";

export interface FormCurrencyProps
  extends Omit<InputProps, "value" | "defaultValue" | "onChange" | "name">,
    Omit<ControllerProps, "render"> {
  label?: string;
  helperText?: string;
  // TODO: replace any with generic type
  control: Control<any, object>;
}

export const FormCurrency = forwardRef<FormCurrencyProps, "input">(
  (props, ref) => {
    const { name, rules, control, defaultValue, label, helperText, ...rest } =
      props;
    const { errors } = useFormState({ control });
    const error: FieldError | null = errors?.[name];
    return (
      <FormControl isInvalid={!!error} isRequired={!!rules?.required}>
        <FormLabel textTransform="capitalize">{label ?? name}</FormLabel>
        <Controller
          name={name}
          rules={rules}
          control={control}
          defaultValue={defaultValue}
          render={({ field: { onChange, onBlur, value } }) => (
            <CurrencyInput
              {...rest}
              onChange={(event: any) => {
                const e = {
                  target: {
                    value: Number(
                      event.target.value
                        ?.replace("Rp. ", "")
                        .replace(/\./g, "")
                        .replace(/\,/g, ".")
                    ),
                  },
                };
                onChange(e);
              }}
              ref={ref}
              value={value ?? ""}
              onBlur={onBlur}
            />
          )}
        />
        <FormErrorMessage>{error?.message ?? "Invalid Value"}</FormErrorMessage>
        {helperText ? <FormHelperText>{helperText}</FormHelperText> : null}
      </FormControl>
    );
  }
);
