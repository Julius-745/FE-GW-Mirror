import React from "react";
import { Box, Text } from "@chakra-ui/react";

export const Footer: React.FC = (props) => {
  return (
    <Box w="full" pt="16">
      <Box
        as="footer"
        width="full"
        bgGradient="linear(to-r, teal.500, green.500)"
        textAlign="center"
        p={3}
      >
        <Text fontSize="md" color="white" as="abbr">
          {props.children}
        </Text>
      </Box>
    </Box>
  );
};
