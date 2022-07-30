import {
  FormControl,
  FormLabel,
  FormHelperText,
  FormErrorMessage,
  Select,
  SelectProps,
} from "@chakra-ui/react";
import { forwardRef } from "@chakra-ui/system";
import {
  Controller,
  ControllerProps,
  Control,
  FieldError,
  useFormState,
} from "react-hook-form";

export interface FormSelectProps
  extends Omit<SelectProps, "value" | "defaultValue" | "onChange" | "name">,
    Omit<ControllerProps, "render"> {
  label?: string;
  helperText?: string;
  control: Control<any, object>;
}

export const FormSelect = forwardRef<FormSelectProps, "select">(
  (props, ref) => {
    const { name, rules, control, defaultValue, label, helperText, ...rest } =
      props;
    const { errors } = useFormState({ control });
    const error: FieldError | null = errors?.[name];
    return (
      <FormControl isInvalid={!!error} isRequired={!!rules?.required}>
        <FormLabel textTransform="capitalize" hidden={!label}>
          {label}
        </FormLabel>
        <Controller
          name={name}
          rules={rules}
          control={control}
          defaultValue={defaultValue}
          render={({ field: { onChange, onBlur, value } }) => (
            <Select
              {...rest}
              ref={ref}
              onChange={onChange}
              value={value}
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

FormSelect.defaultProps = {
  placeholder: "Select Option",
};

export default FormSelect;
