import { Flex } from "@icpswap/ui";
import { Link } from "components/index";
import { Typography, useTheme } from "components/Mui";
import type { ReactNode } from "react";
import { ArrowUpRight } from "react-feather";

export interface LinkButtonProps {
  label: ReactNode;
  link: string;
}

export function LinkButton({ label, link }: LinkButtonProps) {
  const theme = useTheme();

  return (
    <Link link={link}>
      <Flex
        gap="0 4px"
        sx={{
          borderRadius: "40px",
          cursor: "pointer",
          padding: "4px 12px",
          border: `1px solid ${theme.palette.background.level4}`,
        }}
      >
        <Typography sx={{ fontSize: "12px" }} component="div">
          {label}
        </Typography>
        <ArrowUpRight color={theme.colors.secondaryMain} size={16} />
      </Flex>
    </Link>
  );
}
