import { Null } from "@icpswap/types";
import { Typography, TypographyProps } from "components/Mui";
import { ReactNode } from "react";

interface TokenSymbolProps {
  color?: string;
  symbol: ReactNode | Null;
  width?: number;
  sx?: TypographyProps["sx"];
  typographyStyle?: "inherit" | "none";
}

export function TokenSymbol({ color, symbol, sx, typographyStyle = "inherit", width = 96 }: TokenSymbolProps) {
  return (
    <Typography
      className="text-overflow-ellipsis"
      sx={{
        ...sx,
        maxWidth: width,
        color: typographyStyle === "inherit" ? "inherit" : color,
        fontSize: typographyStyle === "inherit" ? "inherit" : "initial",
        fontWeight: typographyStyle === "inherit" ? "inherit" : "initial",
      }}
    >
      {symbol}
    </Typography>
  );
}
