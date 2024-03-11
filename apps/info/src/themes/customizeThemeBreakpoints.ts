import { createTheme } from "@mui/material/styles";

export const customizeTheme = createTheme({
  breakpoints: {
    values: {
      md: 960,
      md1: 1400,
      "1120": 1120,
    },
  },
});

export const customizeBreakPoints = customizeTheme.breakpoints;
