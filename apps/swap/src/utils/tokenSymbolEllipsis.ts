import { Null } from "@icpswap/types";
import { isUndefinedOrNull, nonUndefinedOrNull } from "@icpswap/utils";

interface TokenSymbolEllipsisProps {
  symbol: string | Null;
  symbolLength?: number;
  windowScreenWith?: number;
}

export function tokenSymbolEllipsis({ symbol, symbolLength = 10, windowScreenWith }: TokenSymbolEllipsisProps) {
  const mq = window.matchMedia(`(max-width: ${windowScreenWith}px)`);

  if (isUndefinedOrNull(symbol)) return "";

  const ellipsisSymbol = symbol.length > 10 ? `${symbol.slice(0, symbolLength)}...` : symbol;

  if (nonUndefinedOrNull(windowScreenWith) && mq) {
    return ellipsisSymbol;
  }

  return ellipsisSymbol;
}
