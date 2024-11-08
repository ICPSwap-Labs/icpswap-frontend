import { useState, useCallback, useMemo } from "react";
import { Box, Typography, useTheme } from "components/Mui";
import { BigNumber, toSignificantWithGroupSeparator } from "@icpswap/utils";
import { Trans } from "@lingui/macro";
import Button from "components/authentication/ButtonConnector";
import { Flex } from "@icpswap/ui";
import { ArrowRight } from "react-feather";
import { LimitTransaction } from "@icpswap/types";
import { TokenImage } from "components/index";
import dayjs from "dayjs";
import { useToken } from "hooks/index";

import { WithdrawTokens } from "./WithdrawTokens";

export interface LimitTransactionProps {
  transaction: LimitTransaction;
}

export function LimitTransactionCard({ transaction }: LimitTransactionProps) {
  const theme = useTheme();

  const [showWithdrawTokens, setShowWithdrawTokens] = useState(false);
  const [invertPrice, setInvertPrice] = useState(false);

  const [, inputToken] = useToken(transaction.token0Id);
  const [, outputToken] = useToken(transaction.token1Id);

  const limitPrice = useMemo(() => {
    return new BigNumber(transaction.token1ChangeAmount)
      .dividedBy(transaction.token0InAmount)
      .toFixed(transaction.token1Decimals);
  }, [transaction]);

  const handleInvert = useCallback(() => {
    setInvertPrice(!invertPrice);
  }, [invertPrice, setInvertPrice]);

  return (
    <>
      <Box sx={{ background: theme.palette.background.level2, padding: "24px", borderRadius: "16px", width: "100%" }}>
        <Typography sx={{ fontSize: "12px" }}>
          <Trans>Filled {dayjs(Number(transaction.timestamp * BigInt(1000))).format("MM/DD/YYYY h:mm A")}</Trans>
        </Typography>

        <Flex gap="0 16px" sx={{ margin: "12px 0 0 0" }} fullWidth>
          <Flex gap="0 6px">
            <TokenImage tokenId={inputToken?.address} logo={inputToken?.logo} size="20px" />
            <Typography sx={{ fontSize: "16px", fontWeight: 500, color: "text.primary" }}>
              {toSignificantWithGroupSeparator(transaction.token0InAmount)} {transaction.token0Symbol}
            </Typography>
          </Flex>

          <ArrowRight color="#ffffff" size={16} />

          <Flex gap="0 6px">
            <TokenImage tokenId={outputToken?.address} logo={outputToken?.logo} size="20px" />
            <Typography sx={{ fontSize: "16px", fontWeight: 500, color: "text.primary" }}>
              {toSignificantWithGroupSeparator(transaction.token1ChangeAmount)} {transaction.token1Symbol}
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
              <Typography>
                <Trans>Limit Price</Trans>
              </Typography>
              <Flex gap="0 2px">
                <Typography sx={{ color: "text.primary" }}>
                  {limitPrice
                    ? invertPrice
                      ? `1 ${transaction.token1Symbol} = ${toSignificantWithGroupSeparator(
                          new BigNumber(1).dividedBy(limitPrice).toString(),
                        )} ${transaction.token0Symbol}`
                      : `1 ${transaction.token0Symbol} = ${limitPrice} ${transaction.token1Symbol}`
                    : "--"}
                </Typography>
                <Box sx={{ width: "20px", height: "20px", cursor: "pointer" }} onClick={handleInvert}>
                  <img src="/images/ck-bridge-switch.svg" style={{ width: "20px", height: "20px" }} alt="" />
                </Box>
              </Flex>
            </Flex>
          </Box>

          <Button variant="contained" className="secondary" onClick={() => setShowWithdrawTokens(true)}>
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
