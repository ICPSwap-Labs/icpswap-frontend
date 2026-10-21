import { Flex, Tooltip } from "@icpswap/ui";
import { Box, Typography, useTheme } from "components/Mui";
import type { ReactNode } from "react";
import { ArrowRight } from "react-feather";

export interface RowProps {
  children: ReactNode;
}

export function Row({ children }: RowProps) {
  return (
    <Flex
      sx={{
        margin: "0 0 24px 0",
        gap: "24px",
        width: "100%",
        "@media(max-width: 640px)": {
          flexDirection: "column",
          gap: "24px 0",
          alignItems: "flex-start",
        },
      }}
    >
      {children}
    </Flex>
  );
}

export interface ItemProps {
  label: ReactNode;
  value: number | string | undefined;
  tooltip?: string;
}

export function Item({ label, value, tooltip }: ItemProps) {
  return (
    <Box className="ics-stat tabular-nums" sx={{ flex: 1, minWidth: 0 }}>
      <Flex gap="0 5px">
        <Typography component="div" sx={{ fontSize: "12px", lineHeight: 1.5 }}>
          {label}
        </Typography>
        {tooltip ? <Tooltip tips={tooltip} /> : null}
      </Flex>
      <Typography
        color="text.primary"
        sx={{
          fontSize: "22px",
          fontWeight: 600,
          margin: "8px 0 0 0",
          letterSpacing: "-0.04em",
          fontVariantNumeric: "tabular-nums",
          lineHeight: 1.3,
        }}
      >
        {value}
      </Typography>
    </Box>
  );
}

export interface CardProps {
  children: ReactNode;
  title: ReactNode;
}

export function Card({ title, children }: CardProps) {
  const theme = useTheme();

  return (
    <Box
      className="ics-overview-card"
      sx={{
        width: "100%",
        borderRadius: "16px",
        border: "1px solid color-mix(in srgb, var(--color-base-content) 8%, transparent)",
        background: "var(--color-base-200)",
        padding: "24px",
        cursor: "pointer",
        height: "100%",
        boxShadow: "inset 0 1px 0 color-mix(in srgb, var(--color-base-content) 3%, transparent)",
        transition: "border-color 180ms ease, background 180ms ease, box-shadow 180ms ease",
        [theme.breakpoints.down("sm")]: {
          padding: "16px 15px",
        },
        "&.footer": {
          padding: "16px 24px",
          [theme.breakpoints.down("sm")]: {
            padding: "16px 24px",
          },
        },
        "& .arrow": {
          opacity: 0,
          transform: "translateX(-4px)",
          transition: "opacity 180ms ease, transform 180ms ease",
        },
        "&:hover": {
          borderColor: "color-mix(in srgb, var(--color-primary) 35%, transparent)",
          background: "color-mix(in srgb, var(--color-primary) 4%, var(--color-base-200))",
          boxShadow: "0 8px 32px color-mix(in srgb, var(--color-primary) 5%, transparent)",
          "& .arrow": {
            opacity: 1,
            transform: "translateX(0)",
          },
        },
      }}
    >
      <Flex justify="space-between">
        {title}

        <Box className="arrow">
          <ArrowRight color="var(--color-primary)" size={18} />
        </Box>
      </Flex>
      {children}
    </Box>
  );
}
