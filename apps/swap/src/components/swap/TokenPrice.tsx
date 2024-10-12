import { useMemo } from "react";
import { Typography, TypographyProps } from "components/Mui";
import { BigNumber, toSignificantWithGroupSeparator } from "@icpswap/utils";
import { Token } from "@icpswap/swap-sdk";
import { Null } from "@icpswap/types";

export interface TokenPriceProps {
  price: string | Null;
  baseToken: Token | Null;
  quoteToken: Token | Null;
  convert?: boolean;
  sx?: TypographyProps["sx"];
  onClick?: TypographyProps["onClick"];
}

export function TokenPrice({ baseToken, quoteToken, convert, price, sx, onClick }: TokenPriceProps) {
  const __price = useMemo(() => {
    if (!price) return undefined;

    return convert ? new BigNumber(1).dividedBy(price).toString() : price;
  }, [price, convert]);

  return (
    <Typography
      sx={{
        ...sx,
      }}
      onClick={onClick}
    >
      {__price && baseToken && quoteToken
        ? convert
          ? `1 ${quoteToken.symbol} = ${toSignificantWithGroupSeparator(__price)} ${baseToken.symbol}`
          : `1 ${baseToken.symbol} = ${toSignificantWithGroupSeparator(__price)} ${quoteToken.symbol}`
        : "--"}
    </Typography>
  );
}
