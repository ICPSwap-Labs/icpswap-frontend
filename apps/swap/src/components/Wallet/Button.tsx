import { Typography, Box, BoxProps } from "components/Mui";
import { Override } from "@icpswap/types";
import { forwardRef } from "react";

export type ButtonProps = Override<BoxProps, { label: string }>;

export const Button = forwardRef(({ label, onClick, ...props }: ButtonProps, ref) => {
  return (
    <Box
      ref={ref}
      sx={{
        display: "flex",
        padding: "9px 12px",
        justifyContent: "center",
        alignItems: "center",
        background: "#4F5A84",
        borderRadius: "8px",
        cursor: "pointer",
      }}
      onClick={onClick}
      {...props}
    >
      <Typography color="text.primary">{label}</Typography>
    </Box>
  );
});
