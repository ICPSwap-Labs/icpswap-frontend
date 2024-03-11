import React from "react";
import { Box } from "@mui/material";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles(() => {
  return {
    img: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      transformOrigin: "center",
      "&.loading": {
        animation: `$loading 1000ms`,
        animationIterationCount: "infinite",
      },
    },
    "@keyframes loading": {
      "0%": {
        transform: "rotate(0deg)",
      },
      "100%": {
        transform: "rotate(360deg)",
      },
    },
  };
});

export interface RotateWrapperProps {
  loading?: boolean;
  children: React.ReactNode;
}

export default function RotateWrapper({ loading, children }: RotateWrapperProps) {
  const classes = useStyles();

  return (
    <Box className={`${classes.img}${loading ? " loading" : ""}`} sx={{ width: "42px", height: "42px" }}>
      {children}
    </Box>
  );
}
