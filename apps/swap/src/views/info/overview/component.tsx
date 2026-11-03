import { useDesignVersion } from "hooks/useDesignVersion";
import { Flex, Tooltip } from "@icpswap/ui";
import { Box, Typography, useTheme } from "components/Mui";
import type { ReactNode } from "react";
import { ArrowRight } from "react-feather";

export interface RowProps {
  children: ReactNode;
}

export function Row({ children }: RowProps) {
  const { isClassicDesign } = useDesignVersion();

  if (isClassicDesign) {
    return (
      <Flex
        sx={{
          margin: "0 0 32px 0",
          "@media(max-width: 640px)": {
            flexDirection: "column",
            gap: "32px 0",
            alignItems: "flex-start",
          },
        }}
      >
        {children}
      </Flex>
    );
  }

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
  const { isClassicDesign } = useDesignVersion();

  if (isClassicDesign) {
    return (
      <Box sx={{ flex: 1 }}>
        <Flex gap="0 5px">
          <Typography component="div">{label}</Typography>
          {tooltip ? <Tooltip tips={tooltip} /> : null}
        </Flex>
        <Typography color="text.primary" sx={{ fontSize: "20px", fontWeight: 500, margin: "12px 0 0 0" }}>
          {value}
        </Typography>
      </Box>
    );
  }

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
          fontFamily: "var(--font-mono, monospace)",
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
  const { isClassicDesign } = useDesignVersion();

  const theme = useTheme();

  if (isClassicDesign) {
    return (
      <Box
        sx={{
          width: "100%",
          borderRadius: "24px",
          border: `1px solid ${theme.palette.border["2"]}`,
          background: theme.palette.background.level4,
          padding: "20px 32px",
          cursor: "pointer",
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
            display: "none",
          },
          "&:hover": {
            "& .arrow": {
              display: "block",
            },
          },
        }}
      >
        <Flex justify="space-between">
          {title}

          <Box className="arrow">
            <ArrowRight color="#ffffff" />
          </Box>
        </Flex>
        {children}
      </Box>
    );
  }

  return (
    <Box
      className="ics-overview-card"
      sx={{
        width: "100%",
        borderRadius: "6px",
        border: "1px solid var(--color-base-300)",
        background: "var(--color-base-200)",
        padding: "24px",
        cursor: "pointer",
        height: "100%",
        boxShadow: "none",
        transition: "border-color 180ms ease, background 180ms ease",
        "& .ics-stat": { paddingBottom: "18px", borderBottom: "1px solid var(--color-base-300)", width: "100%" },
        "& .ics-stat:last-child": { paddingBottom: 0, borderBottom: 0 },
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
          opacity: 0.45,
          transition: "opacity 180ms ease",
        },
        "&:hover": {
          borderColor: "var(--color-secondary)",
          background: "var(--color-base-100)",
          "& .arrow": {
            opacity: 1,
          },
        },
      }}
    >
      <Flex justify="space-between" sx={{ paddingBottom: "20px", borderBottom: "1px solid var(--color-base-300)" }}>
        {title}

        <Box className="arrow">
          <ArrowRight color="var(--color-primary)" size={18} />
        </Box>
      </Flex>
      {children}
    </Box>
  );
}
