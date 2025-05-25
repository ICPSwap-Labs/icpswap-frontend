import { Null } from "@icpswap/types";
import { Typography, TypographyProps } from "components/Mui";

interface TokenPairNameProps {
  color?: string;
  width?: string;
  sx?: TypographyProps["sx"];
  symbol0: string | Null;
  symbol1: string | Null;
  typographyStyle?: "inherit" | "none";
}

export function TokenPairName({
  color,
  symbol0,
  symbol1,
  sx,
  width = "220px",
  typographyStyle = "none",
}: TokenPairNameProps) {
  return (
    <Typography
      className="text-overflow-ellipsis"
      sx={{
        color: typographyStyle === "inherit" ? "inherit" : color,
        fontSize: typographyStyle === "inherit" ? "inherit" : "initial",
        fontWeight: typographyStyle === "inherit" ? "inherit" : "initial",
        ...sx,
        maxWidth: width,
      }}
    >
      {symbol0 && symbol1 ? `${symbol0} / ${symbol1}` : ""}
    </Typography>
  );
}
