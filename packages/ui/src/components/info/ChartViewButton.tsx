import { ReactNode } from "react";
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

export type ChartViewsProps = { label: string; key: ChartView };

export interface ChartViewButtonProps {
  children: ReactNode;
  active?: boolean;
  onClick: React.MouseEventHandler<HTMLSpanElement>;
}

export function ChartViewButton({ children, active, onClick }: ChartViewButtonProps) {
  const theme = useTheme();

  return (
    <Typography
      component="span"
      color={active ? "text.primary" : "text.secondary"}
      sx={{
        background: active ? theme.palette.background.level3 : "transparent",
        borderRadius: "12px",
        display: "flex",
        justifyContent: "center",
        fontSize: "12px",
        fontWeight: 500,
        padding: "2px 10px",
      }}
      onClick={onClick}
    >
      {children}
    </Typography>
  );
}

export type ChartViewButtonsProps = Override<
  BoxProps,
  {
    setActiveChartView: (view: ChartView) => void;
    activeView: ChartView;
    chartViews: ChartViewsProps[];
  }
>;

export function ChartViewButtons({ setActiveChartView, activeView, chartViews, ...rest }: ChartViewButtonsProps) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        padding: "1px",
        background: theme.palette.background.level4,
        borderRadius: "12px",
        ...(rest.sx ?? {}),
      }}
    >
      {chartViews.map((chartView) => (
        <ChartViewButton
          key={chartView.key}
          active={chartView.key === activeView}
          onClick={() => setActiveChartView(chartView.key)}
        >
          {chartView.label}
        </ChartViewButton>
      ))}
    </Box>
  );
}
