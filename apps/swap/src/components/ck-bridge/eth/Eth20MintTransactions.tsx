import { useTheme, Box, Typography, makeStyles } from "components/Mui";
import { MainCard, NoData, ALink } from "components/index";
import { toSignificant, parseTokenAmount, isUndefinedOrNull, nonUndefinedOrNull } from "@icpswap/utils";
import dayjs from "dayjs";
import { TX } from "types/web3";
import { EXPLORER_TX_LINK, EXPLORER_ADDRESS_LINK, EXPLORER_BLOCK_LINK } from "constants/ckETH";
import { Flex } from "@icpswap/ui";
import { useEthMintTxs, useEthTxResponse } from "store/web3/hooks";
import { useTranslation } from "react-i18next";
import { useEthereumConfirmations } from "hooks/ck-bridge/useEthereumConfirmations";

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
  const transactionResponse = useEthTxResponse(transaction.hash);
  const confirmations = useEthereumConfirmations(transactionResponse);

  return (
    <Box
      sx={{
        margin: "16px 0 0 0",
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
            {transactionResponse?.blockNumber ? (
              <ALink
                link={`${EXPLORER_BLOCK_LINK}/${transactionResponse.blockNumber}`}
                color="secondary"
                textDecorationColor="secondary"
              >
                {transactionResponse.blockNumber.toString()}
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
            <ALink
              link={`${EXPLORER_ADDRESS_LINK}/${transaction.from}`}
              color="secondary"
              textDecorationColor="secondary"
            >
              {transaction.from}
            </ALink>
          </Typography>
        </Flex>

        <Flex fullWidth justify="space-between">
          <Typography>{t("common.to")}</Typography>

          <Typography className={classes.txLink}>
            {transaction.to ? (
              <ALink
                link={`${EXPLORER_ADDRESS_LINK}/${transaction.to}`}
                color="secondary"
                textDecorationColor="secondary"
              >
                {transaction.to}
              </ALink>
            ) : (
              "--"
            )}
          </Typography>
        </Flex>

        <Flex fullWidth justify="space-between">
          <Typography>{t("common.amount")}</Typography>
          <Typography>{toSignificant(parseTokenAmount(transaction.value, 18).toString())}</Typography>
        </Flex>

        <Flex fullWidth justify="space-between">
          <Typography>{t("common.confirmations")}</Typography>
          <Typography>{nonUndefinedOrNull(confirmations) ? confirmations : "--"}</Typography>
        </Flex>
      </Flex>
    </Box>
  );
}

export function EthMintTransactions() {
  const { t } = useTranslation();
  const transactions = useEthMintTxs();

  return (
    <MainCard level={1}>
      <Typography sx={{ color: "text.primary", fontSize: "16px" }}>{t("common.transactions")}</Typography>

      <Typography sx={{ margin: "12px 0 0 0", lineHeight: "20px", fontSize: "12px" }}>
        {t("ck.ether.sync", { symbol0: "ETH", symbol1: "ckETH" })}
      </Typography>

      <Box>
        <>
          {isUndefinedOrNull(transactions) || transactions.length === 0 ? (
            <NoData tip={t("ck.empty")} />
          ) : (
            transactions.map((transaction, index) => <Transaction key={index} transaction={transaction} />)
          )}
        </>
      </Box>
    </MainCard>
  );
}
