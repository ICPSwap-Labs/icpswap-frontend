import { Null } from "@icpswap/types";
import { isNullArgs, nonNullArgs } from "@icpswap/utils";

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
