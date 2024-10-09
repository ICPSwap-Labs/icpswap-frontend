import { ReactNode } from "react";

import { Box, Typography, BoxProps, useTheme } from "../Mui";

export enum ChartView {
  TVL,
  VOL,
  PRICE,
  FEES,
  LIQUIDITY,
  TRANSACTIONS,
  DexScreener,
}

export interface MultipleSmallButtonProps {
  children: ReactNode;
  active?: boolean;
  onClick?: React.MouseEventHandler<HTMLSpanElement>;
}

export function MultipleSmallButton({ children, active, onClick }: MultipleSmallButtonProps) {
  const theme = useTheme();

  return (
    <Typography
      component="span"
      color={active ? "text.primary" : "text.secondary"}
      sx={{
        background: active ? theme.palette.background.level3 : "transparent",
        borderRadius: "50px",
        display: "flex",
        justifyContent: "center",
        fontSize: "12px",
        fontWeight: 500,
        padding: "0 10px",
        height: "24px",
        lineHeight: "24px",
      }}
      onClick={onClick}
    >
      {children}
    </Typography>
  );
}

export function MultipleSmallButtonsWrapper({ onClick, children, ...rest }: BoxProps) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        padding: "2px",
        background: theme.palette.background.level4,
        borderRadius: "50px",
        ...(rest.sx ?? {}),
      }}
    >
      {children}
    </Box>
  );
}
