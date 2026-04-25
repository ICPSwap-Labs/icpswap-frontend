import { useChainKeyTransactionPrice, useInfoToken } from "@icpswap/hooks";
import { ckETH, ICP } from "@icpswap/tokens";
import { Flex } from "@icpswap/ui";
import { formatDollarAmount, parseTokenAmount, toSignificantWithGroupSeparator } from "@icpswap/utils";
import { Box, Button, Typography, useTheme } from "components/Mui";
import { MINTER_CANISTER_ID } from "constants/ckERC20";
import { useTokenBalance } from "hooks/token";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useAccountPrincipal } from "store/auth/hooks";

export function Erc20Fee() {
  const { t } = useTranslation();
  const theme = useTheme();
  const principal = useAccountPrincipal();
  const navigate = useNavigate();

  const { result: ckETHBalance } = useTokenBalance({
    tokenId: ckETH.address,
    account: principal?.toString(),
  });
  const { data: transactionPrice } = useChainKeyTransactionPrice(MINTER_CANISTER_ID);
  const ckETHInfoToken = useInfoToken(ckETH.address);

  const handleBuy = useCallback(() => {
    navigate(`/swap?input=${ICP.address}&output=${ckETH.address}`);
  }, [navigate]);

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
          <Typography>{t("common.gas.fees")}</Typography>

          <Typography>
            {transactionPrice && ckETHInfoToken ? (
              <>
                {t("common.max.amount", {
                  amount: `${parseTokenAmount(transactionPrice.max_transaction_fee, ckETH.decimals).toFormat(6)} ${
                    ckETH.symbol
                  } `,
                })}
                {t("common.brackets", {
                  content: `${formatDollarAmount(
                    parseTokenAmount(transactionPrice.max_transaction_fee, ckETH.decimals)
                      .multipliedBy(ckETHInfoToken.price)
                      .toString(),
                  )}`,
                })}
              </>
            ) : (
              "--"
            )}
          </Typography>
        </Flex>

        <Flex justify="space-between" fullWidth>
          <Typography>{t("common.balance.symbol", { symbol: "ckETH" })}</Typography>

          <Flex gap="0 8px">
            <Typography>
              {ckETHBalance
                ? toSignificantWithGroupSeparator(parseTokenAmount(ckETHBalance, ckETH.decimals).toNumber())
                : "--"}
              &nbsp;{ckETH?.symbol}
            </Typography>

            <Button variant="outlined" onClick={handleBuy} size="small">
              {t("common.buy.token", { symbol: "ckETH" })}
            </Button>
          </Flex>
        </Flex>
      </Flex>
    </Box>
  );
}
