import { useState, useCallback, useMemo } from "react";
import { Typography } from "components/Mui";
import { BigNumber, formatTokenPrice, isUndefinedOrNull } from "@icpswap/utils";
import { Flex } from "@icpswap/ui";
import { Null } from "@icpswap/types";
import { SyncAlt as SyncAltIcon } from "@mui/icons-material";
import { PoolCurrentPrice } from "components/swap/PoolCurrentPrice";
import { Pool, Price, Token } from "@icpswap/swap-sdk";

export interface LimitAndCurrentPriceProps {
  inputToken: Token | Null;
  outputToken: Token | Null;
  limitPrice: Price<Token, Token> | Null;
  pool: Pool | Null;
}

export function LimitAndCurrentPrice({ inputToken, outputToken, limitPrice, pool }: LimitAndCurrentPriceProps) {
  const [invertPrice, setInvertPrice] = useState(false);

  const handleInvert = useCallback(() => {
    setInvertPrice(!invertPrice);
  }, [invertPrice, setInvertPrice]);

  const isSorted = useMemo(() => {
    if (isUndefinedOrNull(inputToken) || isUndefinedOrNull(outputToken)) return undefined;
    return inputToken.sortsBefore(outputToken);
  }, [inputToken, outputToken]);

  return (
    <>
      <Flex gap="0 2px" sx={{ margin: "0 0 12px 0" }}>
        <Typography
          sx={{
            color: "text.primary",
            cursor: "pointer",
            fontSize: "16px",
            textAlign: "right",
          }}
          onClick={handleInvert}
        >
          {limitPrice && outputToken && inputToken ? (
            <>
              {invertPrice
                ? `1 ${outputToken.symbol} = ${formatTokenPrice(
                    new BigNumber(1).dividedBy(limitPrice.toFixed(inputToken.decimals)).toString(),
                  )} ${inputToken.symbol}`
                : `1 ${inputToken.symbol} = ${formatTokenPrice(limitPrice.toFixed(inputToken.decimals))} ${
                    outputToken.symbol
                  }`}
              <SyncAltIcon sx={{ fontSize: "1rem", margin: "0 0 0 2px", verticalAlign: "middle" }} />
            </>
          ) : (
            "--"
          )}
        </Typography>
      </Flex>

      <PoolCurrentPrice
        pool={pool}
        fontSize="16px"
        usdValueColor="text.primary"
        symbolColor="text.primary"
        showUsdValue={false}
        iconColor="#ffffff"
        per={false}
        outerInvert={isUndefinedOrNull(isSorted) ? undefined : isSorted ? invertPrice : !invertPrice}
      />
    </>
  );
}
