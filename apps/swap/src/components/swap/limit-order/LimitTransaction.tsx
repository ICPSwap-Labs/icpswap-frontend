import { useState, useCallback, useMemo } from "react";
import { Box, Typography, useTheme } from "components/Mui";
import { BigNumber, isNullArgs, toSignificantWithGroupSeparator } from "@icpswap/utils";
import { Trans } from "@lingui/macro";
import Button from "components/authentication/ButtonConnector";
import { Flex } from "@icpswap/ui";
import { ArrowRight } from "react-feather";
import { LimitTransaction } from "@icpswap/types";
import { TokenImage } from "components/index";
import dayjs from "dayjs";
import { useToken } from "hooks/index";
import { useUserUnusedBalance } from "@icpswap/hooks";
import { useAccountPrincipal } from "store/auth/hooks";

import { WithdrawTokens } from "./WithdrawTokens";

export interface LimitTransactionProps {
  transaction: LimitTransaction;
}

export function LimitTransactionCard({ transaction }: LimitTransactionProps) {
  const theme = useTheme();
  const principal = useAccountPrincipal();

  const [showWithdrawTokens, setShowWithdrawTokens] = useState(false);
  const [invertPrice, setInvertPrice] = useState(false);

  const { result: unusedBalance } = useUserUnusedBalance(transaction.poolId, principal);

  const { inputTokenId, outputTokenId, inputAmount, outputChangeAmount } = useMemo(() => {
    const inputTokenId = new BigNumber(transaction.token0InAmount).isEqualTo(0)
      ? transaction.token1Id
      : transaction.token0Id;

    const outputTokenId = inputTokenId === transaction.token1Id ? transaction.token0Id : transaction.token1Id;
    const inputAmount = inputTokenId === transaction.token1Id ? transaction.token1InAmount : transaction.token0InAmount;
    const outputChangeAmount =
      inputTokenId === transaction.token1Id ? transaction.token0ChangeAmount : transaction.token1ChangeAmount;

    return {
      inputTokenId,
      outputTokenId,
      inputAmount,
      outputChangeAmount,
    };
  }, [transaction]);

  const [, inputToken] = useToken(inputTokenId);
  const [, outputToken] = useToken(outputTokenId);

  const limitPrice = useMemo(() => {
    if (!outputToken) return undefined;
    return new BigNumber(outputChangeAmount).dividedBy(inputAmount).toFixed(outputToken.decimals);
  }, [outputChangeAmount, outputToken, inputAmount]);

  const handleInvert = useCallback(() => {
    setInvertPrice(!invertPrice);
  }, [invertPrice, setInvertPrice]);

  const disableWithdraw = useMemo(() => {
    if (isNullArgs(unusedBalance) || isNullArgs(inputToken) || isNullArgs(outputToken)) return true;

    const token0 = inputToken.sortsBefore(outputToken) ? inputToken : outputToken;
    const token1 = inputToken.sortsBefore(outputToken) ? outputToken : inputToken;

    return (
      !new BigNumber(unusedBalance.balance0.toString()).isGreaterThan(token0.transFee) &&
      !new BigNumber(unusedBalance.balance1.toString()).isGreaterThan(token1.transFee)
    );
  }, [unusedBalance, inputToken, outputToken]);

  return (
    <>
      <Box sx={{ background: theme.palette.background.level2, padding: "24px", borderRadius: "16px", width: "100%" }}>
        <Typography sx={{ fontSize: "12px" }}>
          <Trans>Filled {dayjs(Number(transaction.timestamp * BigInt(1000))).format("YYYY-MM-DD HH:mm")}</Trans>
        </Typography>

        <Flex gap="0 16px" sx={{ margin: "12px 0 0 0" }} fullWidth>
          <Flex gap="0 6px">
            <TokenImage tokenId={inputToken?.address} logo={inputToken?.logo} size="20px" />
            <Typography sx={{ fontSize: "16px", fontWeight: 500, color: "text.primary" }}>
              {toSignificantWithGroupSeparator(inputAmount)} {inputToken?.symbol}
            </Typography>
          </Flex>

          <ArrowRight color="#ffffff" size={16} />

          <Flex gap="0 6px">
            <TokenImage tokenId={outputToken?.address} logo={outputToken?.logo} size="20px" />
            <Typography sx={{ fontSize: "16px", fontWeight: 500, color: "text.primary" }}>
              {toSignificantWithGroupSeparator(outputChangeAmount)} {outputToken?.symbol}
            </Typography>
          </Flex>
        </Flex>

        <Flex
          align="flex-end"
          justify="space-between"
          sx={{
            margin: "24px 0 0 0",
            "@media(max-width: 640px)": {
              flexDirection: "column",
              alignItems: "flex-start",
              gap: "12px 0",
            },
          }}
        >
          <Box>
            <Flex gap="0 8px">
              <Typography sx={{ whiteSpace: "nowrap" }}>
                <Trans>Limit Price</Trans>
              </Typography>
              <Flex gap="0 2px" sx={{ textAlign: "right", cursor: "pointer" }} onClick={handleInvert}>
                <Typography sx={{ color: "text.primary" }}>
                  {limitPrice
                    ? invertPrice
                      ? `1 ${outputToken?.symbol} = ${toSignificantWithGroupSeparator(
                          new BigNumber(1).dividedBy(limitPrice).toString(),
                        )} ${inputToken?.symbol}`
                      : `1 ${inputToken?.symbol} = ${limitPrice} ${outputToken?.symbol}`
                    : "--"}
                </Typography>
                <Box sx={{ width: "20px", height: "20px" }}>
                  <img src="/images/ck-bridge-switch.svg" style={{ width: "20px", height: "20px" }} alt="" />
                </Box>
              </Flex>
            </Flex>
          </Box>

          <Button
            variant="contained"
            className="secondary"
            onClick={() => setShowWithdrawTokens(true)}
            disabled={disableWithdraw}
          >
            <Trans>Withdraw</Trans>
          </Button>
        </Flex>
      </Box>

      <WithdrawTokens
        open={showWithdrawTokens}
        onClose={() => setShowWithdrawTokens(false)}
        transaction={transaction}
      />
    </>
  );
}
