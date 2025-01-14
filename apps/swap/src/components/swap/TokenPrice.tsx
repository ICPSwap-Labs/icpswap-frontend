import { useMemo } from "react";
import { Typography, TypographyProps } from "components/Mui";
import { BigNumber, formatDollarTokenPrice, formatTokenPrice } from "@icpswap/utils";
import { Token } from "@icpswap/swap-sdk";
import { Null } from "@icpswap/types";
import { useUSDPriceById } from "hooks/index";

export interface TokenPriceProps {
  price: string | Null;
  baseToken: Token | Null;
  quoteToken: Token | Null;
  inverted?: boolean;
  sx?: TypographyProps["sx"];
  onClick?: TypographyProps["onClick"];
  showUSD?: boolean;
  fontSize?: number;
}

export function TokenPrice({
  baseToken,
  quoteToken,
  inverted,
  price,
  sx,
  onClick,
  showUSD = false,
  fontSize,
}: TokenPriceProps) {
  const __price = useMemo(() => {
    if (!price) return undefined;

    return inverted ? new BigNumber(1).dividedBy(price).toString() : price;
  }, [price, inverted]);

  const { baseTokenInverted, quoteTokenInverted } = useMemo(() => {
    if (!baseToken || !quoteToken) return {};

    return inverted
      ? { baseTokenInverted: quoteToken, quoteTokenInverted: baseToken }
      : { baseTokenInverted: baseToken, quoteTokenInverted: quoteToken };
  }, [baseToken, quoteToken, inverted]);

  const inputTokenUSD = useUSDPriceById(baseTokenInverted?.address);

  return (
    <Typography
      className={fontSize ? `fontSize${fontSize}` : ""}
      sx={{
        color: "text.primary",
        ...sx,
      }}
      onClick={onClick}
    >
      {__price && baseTokenInverted && quoteTokenInverted
        ? `1 ${baseTokenInverted.symbol} = ${formatTokenPrice(__price)} ${quoteTokenInverted.symbol}`
        : "--"}

      {showUSD && inputTokenUSD ? (
        <Typography component="span" className={fontSize ? `fontSize${fontSize}` : ""}>
          ({formatDollarTokenPrice(inputTokenUSD)})
        </Typography>
      ) : null}
    </Typography>
  );
}
