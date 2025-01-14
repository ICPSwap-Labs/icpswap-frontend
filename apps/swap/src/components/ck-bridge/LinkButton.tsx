import { ArrowUpRight } from "react-feather";
import { Flex } from "@icpswap/ui";
import { useTheme, Typography } from "components/Mui";
import { ReactNode } from "react";
import { Link } from "components/index";

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
