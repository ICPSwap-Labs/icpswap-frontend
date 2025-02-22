import { Box, Typography, useTheme, makeStyles } from "components/Mui";
import { MainCard, NoData, ALink } from "components/index";
import { useAccountPrincipalString } from "store/auth/hooks";
import { parseTokenAmount } from "@icpswap/utils";
import { Flex } from "@icpswap/ui";
import { useUserTxs } from "store/wallet/hooks";
import { StoredTxValue } from "types/ckBTC";
import { useFetchUserTxStates } from "hooks/ck-bridge/index";
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
  transaction: StoredTxValue;
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
          <Typography>{t("common.block.index")}</Typography>
          <Typography color="text.primary">{transaction.block_index}</Typography>
        </Flex>

        <Flex fullWidth justify="space-between">
          <Typography>{t("common.state")}</Typography>
          <Typography color="text.primary">{transaction.state ?? "--"}</Typography>
        </Flex>

        <Flex fullWidth justify="space-between">
          <Typography>{t("common.txid")}</Typography>

          <Typography>
            {transaction.txid ? (
              <Typography className={classes.txLink}>
                <ALink
                  link={`https://explorer.btc.com/btc/transaction/${transaction.txid}`}
                  color="secondary"
                  textDecorationColor="secondary"
                  align="right"
                >
                  {transaction.txid}
                </ALink>
              </Typography>
            ) : (
              <Typography>--</Typography>
            )}
          </Typography>
        </Flex>

        <Flex fullWidth justify="space-between">
          <Typography>{t("common.amount")}</Typography>
          <Typography color="text.primary">
            {transaction.value ? parseTokenAmount(transaction.value, 8).toFormat() : "--"}
          </Typography>
        </Flex>
      </Flex>
    </Box>
  );
}

export interface DissolveTransactionProps {
  refresh?: boolean | number;
}

export function DissolveTransactions() {
  const { t } = useTranslation();
  const principal = useAccountPrincipalString();
  const transactions = useUserTxs(principal);

  useFetchUserTxStates();

  return (
    <MainCard level={1}>
      <Typography sx={{ color: "text.primary", fontSize: "16px" }}>{t("common.retrieved")}</Typography>

      <Box>
        <>
          {transactions?.map((transaction, index) => (
            <Box key={index} sx={{ margin: "16px 0 0 0" }}>
              <Transaction transaction={transaction} />
            </Box>
          ))}
          {transactions?.length === 0 || !transactions ? <NoData /> : null}
        </>
      </Box>
    </MainCard>
  );
}
