import { ReactNode, useCallback } from "react";
import { Override } from "@icpswap/types";

import { Box, Typography, BoxProps, useTheme } from "../Mui";

export enum ChartView {
  TVL,
  VOL,
  PRICE,
  FEES,
  LIQUIDITY,
  TRANSACTIONS,
}

export type ButtonElementProps = { label: string; value: any };

export interface MultipleSmallButtonProps {
  children: ReactNode;
  active?: boolean;
  onClick: React.MouseEventHandler<HTMLSpanElement>;
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

export type MultipleSmallButtonsProps = Override<
  BoxProps,
  {
    onClick: (ele: ButtonElementProps) => void;
    active: any;
    buttons: ButtonElementProps[];
  }
>;

export function MultipleSmallButtons({ onClick, active, buttons, ...rest }: MultipleSmallButtonsProps) {
  const theme = useTheme();

  const handleClick = useCallback(
    (button: ButtonElementProps) => {
      onClick(button);
    },
    [onClick],
  );

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
      {buttons.map((button) => (
        <MultipleSmallButton key={button.value} active={button.value === active} onClick={() => handleClick(button)}>
          {button.label}
        </MultipleSmallButton>
      ))}
    </Box>
  );
}
