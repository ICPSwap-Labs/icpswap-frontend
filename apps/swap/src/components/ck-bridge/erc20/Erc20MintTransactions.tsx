import { useTheme, Box, Typography, makeStyles } from "components/Mui";
import { MainCard, NoData, ALink } from "components/index";
import { BigNumber, isUndefinedOrNull, parseTokenAmount, toSignificant } from "@icpswap/utils";
import dayjs from "dayjs";
import { TX } from "types/web3";
import { EXPLORER_TX_LINK, EXPLORER_ADDRESS_LINK, EXPLORER_BLOCK_LINK } from "constants/ckETH";
import { Flex } from "@icpswap/ui";
import { useErc20MintTxs, useEthTxResponse } from "store/web3/hooks";
import { Token } from "@icpswap/swap-sdk";
import { Null } from "@icpswap/types";
import { useTranslation } from "react-i18next";
import { useMemo } from "react";

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
  token: Token | Null;
}

function Transaction({ token, transaction }: TransactionProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const classes = useStyles();
  const transactionResponse = useEthTxResponse(transaction.hash);

  const amount = useMemo(() => {
    if (isUndefinedOrNull(token)) return undefined;

    // The time that the value has changed to formatted with decimals
    const codeUpgradeTime = 1753717359197;

    return new BigNumber(transaction.timestamp).isLessThan(codeUpgradeTime)
      ? transaction.value
      : parseTokenAmount(transaction.value, token.decimals).toString();
  }, [transaction, token]);

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
          <Typography component="div">
            {transactionResponse?.blockNumber ? (
              <ALink
                link={`${EXPLORER_BLOCK_LINK}/${transactionResponse.blockNumber}`}
                color="secondary"
                textDecorationColor="secondary"
              >
                {transactionResponse.blockNumber}
              </ALink>
            ) : (
              "--"
            )}
          </Typography>
        </Flex>

        <Flex fullWidth justify="space-between">
          <Typography>{t("common.txid")}</Typography>

          <Typography className={classes.txLink} component="div">
            <ALink link={`${EXPLORER_TX_LINK}/${transaction.hash}`} color="secondary" textDecorationColor="secondary">
              {transaction.hash}
            </ALink>
          </Typography>
        </Flex>

        <Flex fullWidth justify="space-between">
          <Typography>{t("common.from")}</Typography>
          <Typography className={classes.txLink} component="div">
            {transactionResponse ? (
              <ALink
                link={`${EXPLORER_ADDRESS_LINK}/${transactionResponse.from}`}
                color="secondary"
                textDecorationColor="secondary"
              >
                {transactionResponse.from}
              </ALink>
            ) : (
              "--"
            )}
          </Typography>
        </Flex>

        <Flex fullWidth justify="space-between">
          <Typography>{t("common.to")}</Typography>

          <Typography className={classes.txLink} component="div">
            {transactionResponse?.to ? (
              <ALink
                link={`${EXPLORER_ADDRESS_LINK}/${transactionResponse.to}`}
                color="secondary"
                textDecorationColor="secondary"
              >
                {transactionResponse.to}
              </ALink>
            ) : (
              "--"
            )}
          </Typography>
        </Flex>

        <Flex fullWidth justify="space-between">
          <Typography>{t("common.amount")}</Typography>
          <Typography>{amount ? toSignificant(amount) : "--"}</Typography>
        </Flex>

        <Flex fullWidth justify="space-between">
          <Typography>{t("common.confirmations")}</Typography>
          <Typography>{transactionResponse ? transactionResponse.confirmations : "--"}</Typography>
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
  const transactions = useErc20MintTxs(ledger);

  return (
    <MainCard level={1}>
      <Typography sx={{ color: "text.primary", fontSize: "16px" }}>{t("common.transactions")}</Typography>

      <Typography sx={{ margin: "12px 0 0 0", lineHeight: "20px", fontSize: "12px" }}>
        {t("ck.ether.sync", { symbol0: token?.symbol.replace("ck", ""), symbol1: token?.symbol })}
      </Typography>

      <Box>
        <>
          {isUndefinedOrNull(transactions) || transactions.length === 0 ? (
            <NoData tip={t("ck.empty")} />
          ) : (
            transactions.map((transaction, index) => (
              <Transaction key={index} transaction={transaction} token={token} />
            ))
          )}
        </>
      </Box>
    </MainCard>
  );
}
