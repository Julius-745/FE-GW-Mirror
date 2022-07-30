import { extendTheme } from "@chakra-ui/react";

const config = {
  initialColorMode: "light",
  useSystemColorMode: false,
};

const theme = extendTheme({
  config,
  colors: {
    brand: {
      50: "#e2fbef",
      100: "#c1ecd7",
      200: "#9edfbe",
      300: "#79d1a6",
      400: "#55c38c",
      500: "#3caa73",
      600: "#2c8458",
      700: "#1d5e3f",
      800: "#0d3a24",
      900: "#001508",
    },
  },
  components: {
    Modal: {
      defaultProps: {
        isCentered: true,
      },
      baseStyle: {
        body: {
          maxH: "calc(100vh - 200px)",
          overflowY: "scroll",
          borderBottomWidth: "1px",
          borderBottomColor: "gray.300",
          borderTopWidth: "1px",
          borderTopColor: "gray.300",
          borderStyle: "solid",
          pb: "8",
        },
      },
    },
  },
});

export default theme;
