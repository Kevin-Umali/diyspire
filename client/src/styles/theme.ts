import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  colors: {
    text: {
      light: "#0d0702",
      dark: "#fdf7f2",
    },
    background: {
      light: "#ffffff",
      dark: "#000000",
    },
    primary: {
      light: "#6aabec",
      dark: "#135495",
    },
    secondary: {
      light: "#c5c5f7",
      dark: "#08083a",
    },
    accent: {
      light: "#1cd4d4",
      dark: "#2be3e3",
    },
    border: {
      light: "#e0e0e0",
      dark: "#1a1a1a",
    },
  },
  styles: {
    global: ({ colorMode }: { colorMode: string }) => ({
      "html, body": {
        bg: colorMode === "dark" ? "background.dark" : "background.light",
        lineHeight: "1.5",
      },
      "*": {
        color: colorMode === "dark" ? "text.dark" : "text.light",
        transition: "color 0.2s",
      },
      "button, input, textarea, select": {
        transition: "all 0.2s",
      },
      hr: {
        borderColor: colorMode === "dark" ? "border.dark" : "border.light",
      },
    }),
  },
  fonts: {
    body: "Segoe UI, Poppins, Noto Sans Old North Arabian, sans-serif",
    heading: "Segoe UI, Poppins, Noto Sans Old North Arabian, sans-serif",
    mono: "Segoe UI, Poppins, Noto Sans Old North Arabian, sans-serif",
  },
  components: {
    Divider: {
      baseStyle: ({ colorMode }: { colorMode: string }) => ({
        borderColor: colorMode === "dark" ? "border.dark" : "border.light",
      }),
    },
  },
  config: {
    initialColorMode: "light",
    useSystemColorMode: false,
  },
});

export default theme;
