import { Box, useRadio, UseRadioProps } from "@chakra-ui/react";

export const RadioCard: React.FC<UseRadioProps> = (props) => {
  const { getInputProps, getCheckboxProps } = useRadio(props);

  const input = getInputProps();
  const checkbox = getCheckboxProps();

  return (
    <Box as="label">
      <input {...input} />
      <Box
        {...checkbox}
        textTransform="capitalize"
        cursor="pointer"
        borderWidth="1px"
        borderRadius="md"
        boxShadow="md"
        _checked={{
          bg: "brand.500",
          color: "white",
          borderColor: "brand.600",
        }}
        _focus={{
          boxShadow: "outline",
        }}
        px={5}
        py={2}
      >
        {props.children}
      </Box>
    </Box>
  );
};
