import { ReactNode } from "react";
import { Box, Typography, BoxProps } from "@mui/material";
import { Theme } from "@mui/material/styles";
import { useTheme } from "@mui/styles";
import { Override } from "@icpswap/types";

export enum ChartView {
  TVL,
  VOL,
  PRICE,
  FEES,
  LIQUIDITY,
  TRANSACTIONS,
}

export type ChartViewButton = { label: string; key: ChartView };

export interface ChartToggleButtonProps {
  children: ReactNode;
  active?: boolean;
  onClick: React.MouseEventHandler<HTMLSpanElement>;
}

export function ChartToggleButton({ children, active, onClick }: ChartToggleButtonProps) {
  const theme = useTheme() as Theme;

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

export type ChartToggleProps = Override<
  BoxProps,
  {
    setActiveChartView: (view: ChartView) => void;
    activeView: ChartView;
    chartViews: ChartViewButton[];
  }
>;

export function ChartToggle({ setActiveChartView, activeView, chartViews, ...rest }: ChartToggleProps) {
  const theme = useTheme() as Theme;

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
        <ChartToggleButton
          key={chartView.key}
          active={chartView.key === activeView}
          onClick={() => setActiveChartView(chartView.key)}
        >
          {chartView.label}
        </ChartToggleButton>
      ))}
    </Box>
  );
}
