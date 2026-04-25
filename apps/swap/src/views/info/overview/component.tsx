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

export interface ItemProps {
  label: ReactNode;
  value: number | string | undefined;
  tooltip?: string;
}

export function Item({ label, value, tooltip }: ItemProps) {
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

export interface CardProps {
  children: ReactNode;
  title: ReactNode;
}

export function Card({ title, children }: CardProps) {
  const theme = useTheme();

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
