import { ReactNode } from "react";
import { Box, keyframes } from "@mui/material";
import { useTheme } from "@mui/styles";
import { Theme } from "@mui/material/styles";

const loadingAnimation = keyframes`
  0% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
`;

export function LoadingSingleRow() {
  const theme = useTheme() as Theme;

  return (
    <Box
      sx={{
        display: "grid",
        minWidth: "75%",
        maxWidth: "1400px",
        gridColumnGap: "0.5em",
        gridRowGap: "0.8em",
        gridTemplateColumns: "repeat(3, 1fr)",
        "& > div": {
          animation: `${loadingAnimation} 1.5s infinite`,
          animationFillMode: "both",
          background: `linear-gradient(
            to left,
            ${theme.palette.background.level2} 25%,
            ${theme.palette.background.level3} 50%,
            ${theme.palette.background.level4} 75%
          )`,
          backgroundSize: "400%",
          borderRadius: "12px",
          height: " 2.4em",
          willChange: "background-position",
        },
        "& > div:nth-of-type(4n + 1)": {
          gridColumn: "1 / 3",
        },
        " & > div:nth-of-type(4n)": {
          gridColumn: "3 / 4",
          marginBottom: "16px",
        },
      }}
    >
      <div />
      <div />
    </Box>
  );
}

export function LoadingRow({ children }: { children: ReactNode }) {
  const theme = useTheme() as Theme;

  return (
    <Box
      sx={{
        display: "grid",
        minWidth: "75%",
        maxWidth: "1400px",
        gridColumnGap: "0.5em",
        gridRowGap: "0.8em",
        gridTemplateColumns: "repeat(3, 1fr)",
        "& > div": {
          animation: `${loadingAnimation} 1.5s infinite`,
          animationFillMode: "both",
          background: `linear-gradient(
            to left,
            ${theme.palette.background.level2} 25%,
            ${theme.palette.background.level3} 50%,
            ${theme.palette.background.level4} 75%
          )`,
          backgroundSize: "400%",
          borderRadius: "12px",
          height: " 2.4em",
          willChange: "background-position",
        },
        "& > div:nth-of-type(4n + 1)": {
          gridColumn: "1 / 3",
        },
        " & > div:nth-of-type(4n)": {
          gridColumn: "3 / 4",
          marginBottom: "16px",
        },
      }}
    >
      {children}
    </Box>
  );
}
