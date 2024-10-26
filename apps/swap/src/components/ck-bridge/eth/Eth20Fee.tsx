import { Trans } from "@lingui/macro";
import { Box, Typography, useTheme, Button } from "components/Mui";
import { useCallback } from "react";
import { Flex } from "@icpswap/ui";
import { ckETH, ICP } from "@icpswap/tokens";
import { useChainKeyTransactionPrice } from "@icpswap/hooks";
import { parseTokenAmount, toSignificantWithGroupSeparator } from "@icpswap/utils";
import { useTokenBalance } from "hooks/token";
import { useAccountPrincipal } from "store/auth/hooks";
import { MINTER_CANISTER_ID } from "constants/ckERC20";
import { useInfoToken } from "hooks/info/useInfoTokens";
import { useHistory } from "react-router-dom";

export function EthFee() {
  const theme = useTheme();
  const principal = useAccountPrincipal();
  const history = useHistory();

  const { result: ckETHBalance } = useTokenBalance(ckETH.address, principal?.toString());
  const { result: transactionPrice } = useChainKeyTransactionPrice(MINTER_CANISTER_ID);
  const ckETHInfoToken = useInfoToken(ckETH.address);

  const handleBuy = useCallback(() => {
    history.push(`/swap?input=${ICP.address}&output=${ckETH.address}`);
  }, [ICP, ckETH, history]);

  return (
    <Box
      sx={{
        width: "100%",
        padding: "16px",
        border: `1px solid ${theme.palette.background.level4}`,
        borderRadius: "16px",
      }}
    >
      <Flex vertical align="flex-start" gap="16px 0">
        <Flex justify="space-between" fullWidth>
          <Typography>
            <Trans>Gas fees</Trans>
          </Typography>

          <Typography>
            {transactionPrice && ckETHInfoToken ? (
              <Trans>
                Max {parseTokenAmount(transactionPrice.max_transaction_fee, ckETH.decimals).toFormat(6)}&nbsp;
                {ckETH.symbol} ($
                {parseTokenAmount(transactionPrice.max_transaction_fee, ckETH.decimals)
                  .multipliedBy(ckETHInfoToken.priceUSD)
                  .toFormat(2)}
                )
              </Trans>
            ) : (
              "--"
            )}
          </Typography>
        </Flex>

        <Flex justify="space-between" fullWidth>
          <Typography>
            <Trans>ckETH Balance</Trans>
          </Typography>

          <Flex gap="0 8px">
            <Typography>
              {ckETHBalance
                ? toSignificantWithGroupSeparator(parseTokenAmount(ckETHBalance, ckETH.decimals).toNumber())
                : "--"}
              &nbsp;{ckETH?.symbol}
            </Typography>

            <Button variant="outlined" onClick={handleBuy} size="small">
              <Trans>Buy ckETH</Trans>
            </Button>
          </Flex>
        </Flex>
      </Flex>
    </Box>
  );
}
