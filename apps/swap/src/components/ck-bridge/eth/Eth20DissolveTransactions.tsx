import { useTheme, makeStyles, Box, Typography } from "components/Mui";
import { MainCard, NoData, ALink } from "components/index";
import { useAccountPrincipalString } from "store/auth/hooks";
import { parseTokenAmount } from "@icpswap/utils";
import { ckETH } from "@icpswap/tokens";
import { Flex } from "@icpswap/ui";
import { EXPLORER_TX_LINK } from "constants/ckERC20";
import { useUserWithdrawTxs } from "store/web3/hooks";
import { StoredWithdrawTxValue } from "types/ckETH";
import { useTranslation } from "react-i18next";

const useStyles = makeStyles(() => ({
  txLink: {
    maxWidth: "380px",
    wordBreak: "break-all",
    whiteSpace: "break-spaces",
    textAlign: "right",
    lineHeight: "16px",
    "@media(max-width:640px)": { width: "220px" },
  },
}));

interface TransactionProps {
  transaction: StoredWithdrawTxValue;
}

function Transaction({ transaction }: TransactionProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const classes = useStyles();

  return (
    <Box
      sx={{
        padding: "16px",
        background: theme.palette.background.level1,
        border: `1px solid ${theme.palette.background.level4}`,
        borderRadius: "12px",
      }}
    >
      <Flex vertical gap="12px 0" align="flex-start">
        <Flex fullWidth justify="space-between">
          <Typography>{t("common.block")}</Typography>
          <Typography color="text.primary">{transaction.block_index}</Typography>
        </Flex>

        <Flex fullWidth justify="space-between">
          <Typography>{t("common.state")}</Typography>
          <Typography color="text.primary">{transaction.state ?? "--"}</Typography>
        </Flex>

        <Flex fullWidth justify="space-between">
          <Typography>{t("common.txid")}</Typography>

          <Typography color="text.primary">
            {transaction.hash ? (
              <Typography className={classes.txLink}>
                <ALink
                  link={`${EXPLORER_TX_LINK}/${transaction.hash}`}
                  color="secondary"
                  textDecorationColor="secondary"
                >
                  {transaction.hash}
                </ALink>
              </Typography>
            ) : (
              "--"
            )}
          </Typography>
        </Flex>

        <Flex fullWidth justify="space-between">
          <Typography>{t("common.amount")}</Typography>
          <Typography color="text.primary">
            {transaction.value ? parseTokenAmount(transaction.value, ckETH.decimals).toFormat() : "--"}
          </Typography>
        </Flex>
      </Flex>
    </Box>
  );
}

export function EthDissolveTransactions() {
  const { t } = useTranslation();
  const principal = useAccountPrincipalString();
  const transactions = useUserWithdrawTxs(principal);

  return (
    <MainCard level={1}>
      <Typography sx={{ color: "text.primary", fontSize: "16px" }}>{t("common.transactions")}</Typography>

      <Typography sx={{ margin: "12px 0 0 0", lineHeight: "20px", fontSize: "12px" }}>
        {t("ck.ether.sync", { symbol0: "ETH", symbol1: "ckETH" })}
      </Typography>

      <Box>
        <>
          {transactions?.map((transaction, index) => (
            <Box key={index} sx={{ margin: "16px 0 0 0" }}>
              <Transaction transaction={transaction} />
            </Box>
          ))}
          {transactions?.length === 0 || !transactions ? <NoData tip={t("ck.empty")} /> : null}
        </>
      </Box>
    </MainCard>
  );
}
