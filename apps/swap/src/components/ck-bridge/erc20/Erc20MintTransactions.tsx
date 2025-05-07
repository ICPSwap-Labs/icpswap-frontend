import { useTheme, Box, Typography, makeStyles } from "components/Mui";
import { MainCard, NoData, ALink } from "components/index";
import { toSignificant } from "@icpswap/utils";
import dayjs from "dayjs";
import { useAccountPrincipalString } from "store/auth/hooks";
import { TX } from "types/web3";
import { EXPLORER_TX_LINK, EXPLORER_ADDRESS_LINK, EXPLORER_BLOCK_LINK } from "constants/ckETH";
import { useTransaction } from "hooks/web3/useTransaction";
import { Flex } from "@icpswap/ui";
import { useUserErc20TX } from "store/web3/hooks";
import { Token } from "@icpswap/swap-sdk";
import { Null } from "@icpswap/types";
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
  transaction: TX;
}

function Transaction({ transaction }: TransactionProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const classes = useStyles();
  const trans = useTransaction(transaction.hash);

  return (
    <Box
      sx={{
        margin: "16px 0  0 0",
        padding: "16px",
        background: theme.palette.background.level1,
        border: `1px solid ${theme.palette.background.level4}`,
        borderRadius: "12px",
      }}
    >
      <Flex vertical gap="12px 0" align="flex-start">
        <Flex fullWidth justify="space-between">
          <Typography>{t("common.time")}</Typography>
          <Typography>{dayjs(Number(transaction.timestamp)).format("YYYY-MM-DD HH:mm:ss")}</Typography>
        </Flex>

        <Flex fullWidth justify="space-between">
          <Typography>{t("common.height")}</Typography>
          <Typography>
            {trans?.blockNumber ? (
              <ALink
                link={`${EXPLORER_BLOCK_LINK}/${trans.blockNumber}`}
                color="secondary"
                textDecorationColor="secondary"
              >
                {trans.blockNumber}
              </ALink>
            ) : (
              "--"
            )}
          </Typography>
        </Flex>

        <Flex fullWidth justify="space-between">
          <Typography>{t("common.txid")}</Typography>

          <Typography className={classes.txLink}>
            <ALink link={`${EXPLORER_TX_LINK}/${transaction.hash}`} color="secondary" textDecorationColor="secondary">
              {transaction.hash}
            </ALink>
          </Typography>
        </Flex>

        <Flex fullWidth justify="space-between">
          <Typography>{t("common.from")}</Typography>

          <Typography className={classes.txLink}>
            {trans ? (
              <ALink link={`${EXPLORER_ADDRESS_LINK}/${trans.from}`} color="secondary" textDecorationColor="secondary">
                {trans.from}
              </ALink>
            ) : (
              "--"
            )}
          </Typography>
        </Flex>

        <Flex fullWidth justify="space-between">
          <Typography>{t("common.to")}</Typography>

          <Typography className={classes.txLink}>
            {trans?.to ? (
              <ALink link={`${EXPLORER_ADDRESS_LINK}/${trans.to}`} color="secondary" textDecorationColor="secondary">
                {trans.to}
              </ALink>
            ) : (
              "--"
            )}
          </Typography>
        </Flex>

        <Flex fullWidth justify="space-between">
          <Typography>{t("common.amount")}</Typography>

          <Typography>{toSignificant(transaction.value)}</Typography>
        </Flex>

        <Flex fullWidth justify="space-between">
          <Typography>{t("common.confirmations")}</Typography>

          <Typography>{trans ? trans.confirmations : "--"}</Typography>
        </Flex>
      </Flex>
    </Box>
  );
}

export interface Erc20MintTransactionsProps {
  refresh?: boolean | number;
  ledger: string | undefined;
  token: Token | Null;
}

export function Erc20MintTransactions({ token, ledger }: Erc20MintTransactionsProps) {
  const { t } = useTranslation();
  const principal = useAccountPrincipalString();
  const transactions = useUserErc20TX(principal, ledger);

  return (
    <MainCard level={1}>
      <Typography sx={{ color: "text.primary", fontSize: "16px" }}>{t("common.transactions")}</Typography>

      <Typography sx={{ margin: "12px 0 0 0", lineHeight: "20px", fontSize: "12px" }}>
        {t("ck.ether.sync", { symbol0: token?.symbol.replace("ck", ""), symbol1: token?.symbol })}
      </Typography>

      <Box>
        <>
          {transactions?.map((transaction, index) => <Transaction key={index} transaction={transaction} />)}
          {transactions?.length === 0 || !transactions ? <NoData tip={t("ck.empty")} /> : null}
        </>
      </Box>
    </MainCard>
  );
}
