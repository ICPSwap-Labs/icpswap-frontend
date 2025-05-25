import { Null } from "@icpswap/types";
import { isNullArgs, nonNullArgs } from "@icpswap/utils";
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

interface TokenSymbolEllipsisProps {
  symbol: string | Null;
  symbolLength?: number;
  windowScreenWith?: number;
}

export function tokenSymbolEllipsis({ symbol, symbolLength = 10, windowScreenWith }: TokenSymbolEllipsisProps) {
  const mq = window.matchMedia(`(max-width: ${windowScreenWith}px)`);

  if (isNullArgs(symbol)) return "";

  const ellipsisSymbol = symbol.length > 10 ? `${symbol.slice(0, symbolLength)}...` : symbol;

  if (nonNullArgs(windowScreenWith) && mq) {
    return ellipsisSymbol;
  }

  return ellipsisSymbol;
}
