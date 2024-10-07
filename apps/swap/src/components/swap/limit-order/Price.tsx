import { useMemo } from "react";
import { Box, Typography } from "components/Mui";
import { useLimitOrderInfo } from "store/swap/limit-order/hooks";
import { Trans } from "@lingui/macro";
import { Flex, MainCard } from "@icpswap/ui";
import { SwapInput } from "components/swap/index";
import { Token, Trade } from "@icpswap/swap-sdk";
import { TradeType } from "@icpswap/constants";
import { Null } from "@icpswap/types";

export interface SwapLimitPriceProps {
  ui?: "pro" | "normal";
  trade: Trade<Token, Token, TradeType> | null;
  orderPrice: string | Null;
  onInputOrderPrice: (value: string) => void;
}

export const SwapLimitPrice = ({ ui = "normal", trade, orderPrice, onInputOrderPrice }: SwapLimitPriceProps) => {
  const { outputToken } = useLimitOrderInfo({ refresh: undefined });

  const currentPrice = useMemo(() => {
    if (!trade) return undefined;

    return trade.executionPrice.toSignificant(6);
  }, [trade]);

  return (
    <MainCard
      border="level4"
      level={ui === "pro" ? 1 : 3}
      padding={ui === "pro" ? "10px" : "16px"}
      borderRadius={ui === "pro" ? "12px" : undefined}
    >
      <Box sx={{ display: "grid", gap: "16px 0", gridTemplateColumns: "1fr" }}>
        <Flex gap="0 4px">
          <Typography>
            <Trans>Current Price</Trans>
          </Typography>
          <Typography
            color="text.primary"
            sx={{
              textDecoration: currentPrice ? "underline" : "none",
              cursor: "pointer",
            }}
          >
            {currentPrice ?? "--"}
          </Typography>
        </Flex>

        <Flex>
          <Box sx={{ flex: 1 }}>
            <SwapInput align="left" token={outputToken} value={orderPrice} onUserInput={onInputOrderPrice} />
          </Box>

          <Flex>
            <Typography sx={{ color: "text.primary", fontWeight: 500 }}>ICS / ICP</Typography>
          </Flex>
        </Flex>

        <Typography fontSize="12px">
          <Trans>Input price may slightly differ from the market price</Trans>
        </Typography>
      </Box>
    </MainCard>
  );
};
