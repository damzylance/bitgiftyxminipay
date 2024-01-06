import {
  extendTheme,
  theme as base,
  withDefaultColorScheme,
} from "@chakra-ui/react";
const theme = extendTheme(
  {
    fonts: {
      heading: `Inter, ${base.fonts?.heading} `,
      body: `Inter, ${base.fonts?.heading}`,
    },
    colors: {
      brand: {
        50: "#EDFAFD",
        100: "#BFEDF7",
        200: "#92E0F2",
        300: "#38C7E7",
        400: "#A3BFF5",
        500: "#477FEB",
        600: "#144CB8",
        700: "#103D96",
        bg1: "#FFFFFF",
        bg2: "#FAFAFA",
        tx1: "#000000",
        tx2: "#333333",
      },
    },
  },
  withDefaultColorScheme({ colorScheme: "brand", components: ["Button"] })
);

export default theme;
