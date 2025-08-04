import { Box, Typography, useTheme, makeStyles } from "components/Mui";
import { MainCard, NoData, ALink } from "components/index";
import { isUndefinedOrNull, parseTokenAmount } from "@icpswap/utils";
import { Flex, LoadingRow } from "@icpswap/ui";
import { useBtcMintTransactions } from "hooks/ck-bridge/index";
import { Null } from "@icpswap/types";
import dayjs from "dayjs";
import { RotateCcw } from "react-feather";
import { useRefreshTriggerManager } from "hooks/index";
import { useTranslation } from "react-i18next";
import {
  bitcoinAddressExplorer,
  bitcoinBlockExplorer,
  bitcoinTransactionExplorer,
  BTC_MINT_REFRESH,
} from "constants/ckBTC";
import { BitcoinTransaction } from "types/ckBTC";
import { getBitcoinAmountFromTrans } from "utils/web3/ck-bridge";

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
  transaction: BitcoinTransaction;
  address: string | Null;
  block: string | number | Null;
}

function Transaction({ transaction, address, block }: TransactionProps) {
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
        <Flex fullWidth justify="space-between" align="flex-start">
          <Typography>{t("common.time")}</Typography>
          <Typography color="text.primary">
            {transaction.status.block_time ? (
              <>{dayjs(Number(transaction.status.block_time) * 1000).format("YYYY-MM-DD HH:mm:ss")}</>
            ) : (
              <>--</>
            )}
          </Typography>
        </Flex>

        <Flex fullWidth justify="space-between" align="flex-start">
          <Typography>{t("common.height")}</Typography>
          <Typography color="text.primary" component="div">
            {transaction.status.block_height ? (
              <ALink
                link={bitcoinBlockExplorer(transaction.status.block_height)}
                color="text.primary"
                textDecorationColor="text.primary"
              >
                {transaction.status.block_height}
              </ALink>
            ) : (
              "--"
            )}
          </Typography>
        </Flex>

        <Flex fullWidth justify="space-between" align="flex-start">
          <Typography>{t("common.txid")}</Typography>

          <Typography className={classes.txLink} component="div">
            <ALink
              link={bitcoinTransactionExplorer(transaction.txid)}
              color="secondary"
              textDecorationColor="secondary"
              align="right"
            >
              {transaction.txid}
            </ALink>
          </Typography>
        </Flex>

        <Flex fullWidth justify="space-between" align="flex-start">
          <Typography>{t("common.from")}</Typography>
          <Typography className={classes.txLink} component="div">
            <ALink
              link={bitcoinAddressExplorer(transaction.vin[0]?.prevout.scriptpubkey_address)}
              color="secondary"
              textDecorationColor="secondary"
              align="right"
            >
              {transaction.vin[0]?.prevout.scriptpubkey_address}
            </ALink>
          </Typography>
        </Flex>

        <Flex fullWidth justify="space-between" align="flex-start">
          <Typography>{t("common.to")}</Typography>
          <Typography className={classes.txLink} component="div">
            {address ? (
              <ALink
                link={bitcoinAddressExplorer(address)}
                color="secondary"
                textDecorationColor="secondary"
                align="right"
              >
                {address}
              </ALink>
            ) : null}
          </Typography>
        </Flex>

        <Flex fullWidth justify="space-between">
          <Typography>{t("common.amount")}</Typography>
          <Typography color="text.primary">
            {parseTokenAmount(getBitcoinAmountFromTrans(transaction, address), 8).toFormat()}
          </Typography>
        </Flex>

        <Flex fullWidth justify="space-between">
          <Typography>{t("common.confirmations")}</Typography>
          <Typography color="text.primary">
            {block && transaction.status.block_height ? Number(block) - transaction.status.block_height : "--"}
          </Typography>
        </Flex>
      </Flex>
    </Box>
  );
}

export interface MintTransactionProps {
  refresh?: boolean | number;
  btc_address: string | Null;
  block: string | number | Null;
}

export function MintTransactions({ btc_address, block }: MintTransactionProps) {
  const { t } = useTranslation();
  const [, setRefreshTrigger] = useRefreshTriggerManager(BTC_MINT_REFRESH);
  const { result: transactions, loading } = useBtcMintTransactions();

  return (
    <MainCard level={1}>
      <Flex gap="0 8px">
        <Typography sx={{ color: "text.primary", fontSize: "16px" }}>{t("common.latest.transactions")}</Typography>

        <RotateCcw color="#ffffff" size={14} style={{ cursor: "pointer" }} onClick={setRefreshTrigger} />
      </Flex>

      <Typography sx={{ margin: "12px 0 0 0", lineHeight: "20px", fontSize: "12px" }}>
        {t("ck.bitcoin.sync.block")}
      </Typography>

      <Box sx={{ margin: "16px 0 0 0" }}>
        {loading ? (
          <Box sx={{ padding: "12px" }}>
            <LoadingRow>
              <div />
              <div />
              <div />
              <div />
              <div />
              <div />
              <div />
              <div />
              <div />
              <div />
              <div />
              <div />
            </LoadingRow>
          </Box>
        ) : (
          <>
            {isUndefinedOrNull(transactions) || transactions.length === 0 ? (
              <NoData tip={t("ck.empty")} />
            ) : (
              transactions.map((transaction, index) => (
                <Box key={index} sx={{ margin: "16px 0 0 0" }}>
                  <Transaction transaction={transaction} address={btc_address} block={block} />
                </Box>
              ))
            )}
          </>
        )}
      </Box>
    </MainCard>
  );
}
