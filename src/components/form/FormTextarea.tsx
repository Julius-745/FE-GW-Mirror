import {
  Textarea,
  TextareaProps,
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
} from "react-hook-form";

export interface FormTextareaProps
  extends Omit<TextareaProps, "value" | "defaultValue" | "onChange" | "name">,
    Omit<ControllerProps, "render"> {
  label?: string;
  helperText?: string;
  // TODO: replace any with generic type
  control: Control<any, object>;
}

export const FormTextarea = forwardRef<FormTextareaProps, "textarea">(
  (props, ref) => {
    const { name, rules, control, defaultValue, label, helperText, ...rest } =
      props;
    const error: FieldError | null = control._formState.errors?.[name];
    return (
      <FormControl isInvalid={!!error} isRequired={!!rules?.required}>
        <FormLabel textTransform="capitalize">{label ?? name}</FormLabel>
        <Controller
          name={name}
          rules={rules}
          control={control}
          defaultValue={defaultValue}
          render={({ field: { onChange, onBlur, value } }) => (
            <Textarea
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
