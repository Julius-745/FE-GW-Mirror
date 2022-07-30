import {
  InputProps,
  FormControl,
  Input,
  FormLabel,
  FormHelperText,
  FormErrorMessage,
} from "@chakra-ui/react";
import { format } from "date-fns";
import { forwardRef } from "@chakra-ui/system";
import {
  Controller,
  ControllerProps,
  Control,
  FieldError,
  useFormState,
} from "react-hook-form";

const EMAIL_RE =
  /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

export interface FormInputProps
  extends Omit<InputProps, "value" | "defaultValue" | "onChange" | "name">,
    Omit<ControllerProps, "render"> {
  label?: string;
  helperText?: string;
  // TODO: replace any with generic type
  control: Control<any, object>;
}

export const FormInput = forwardRef<FormInputProps, "input">((props, ref) => {
  const {
    name,
    rules = {},
    control,
    defaultValue,
    label,
    helperText,
    ...rest
  } = props;
  const { errors } = useFormState({ control });
  const error: FieldError | null = errors?.[name];
  return (
    <FormControl isInvalid={!!error} isRequired={!!rules?.required}>
      <FormLabel textTransform="capitalize">{label ?? name}</FormLabel>
      <Controller
        name={name}
        rules={{
          ...rules,
          pattern:
            rest.type === "email"
              ? {
                  value: EMAIL_RE,
                  message: "Email tidak valid",
                }
              : undefined,
        }}
        control={control}
        defaultValue={defaultValue}
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            {...rest}
            ref={ref}
            onChange={onChange}
            value={
              rest.type === "date" && value
                ? format(new Date(value), "yyyy-MM-dd")
                : value ?? ""
            }
            onBlur={onBlur}
          />
        )}
      />
      <FormErrorMessage>{error?.message ?? "Invalid Value"}</FormErrorMessage>
      {helperText ? (
        <FormHelperText mb="2" px="3" color="blue.500">
          {helperText}
        </FormHelperText>
      ) : null}
    </FormControl>
  );
});
