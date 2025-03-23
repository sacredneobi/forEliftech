import {
  createTheme,
  CssBaseline,
  Divider,
  Grow,
  ThemeProvider,
} from "@mui/material";

const defTheme = createTheme({
  palette: { mode: "dark" },
});

const theme = createTheme({
  palette: { mode: "dark" },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          padding: 0,
          minWidth: 40,
          minHeight: 40,
          borderRadius: 8,
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          borderRadius: `8px !important`,
          paddingRight: `6px !important`,
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          borderRadius: 16,
          backgroundColor: "#1e2734",
          backgroundImage: "unset",
          boxShadow: defTheme.shadows[10],
          border: `1px solid ${defTheme.palette.divider}`,
        },
      },
    },
  },
});

export * from "./box";
export * from "./event";
export * from "./text";
export * from "./icon";
export * from "./button";
export * from "./loading";
export * from "./dnd";
export * from "./input";
export * from "./select";
export * from "./checkbox";
export * from "./utils";

export { theme, CssBaseline, Divider, Grow, ThemeProvider };
