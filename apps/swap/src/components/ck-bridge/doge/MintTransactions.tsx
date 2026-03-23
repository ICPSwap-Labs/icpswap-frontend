import type { DogeUtxo } from "@icpswap/candid";
import { BridgeChainName } from "@icpswap/constants";
import type { Null } from "@icpswap/types";
import { Flex, LoadingRow } from "@icpswap/ui";
import { isUndefinedOrNull, toHexString } from "@icpswap/utils";
import { ALink, MainCard, NoData } from "components/index";
import { Box, makeStyles, Typography, useTheme } from "components/Mui";
import { DOGE_MINT_CONFIRMATIONS } from "constants/chain-key";
import { useDogeBlockConfirmations, useUserDogeKnownUtxos } from "hooks/ck-bridge/doge";
import { useCallback, useMemo } from "react";
import { RotateCcw } from "react-feather";
import { useTranslation } from "react-i18next";
import { parseDogeAmount } from "utils/chain-key";
import { dogeBlockExplorer, dogeTransactionExplorer } from "utils/chain-key/doge";

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
  transaction: DogeUtxo;
  address: string | Null;
}

function Transaction({ transaction }: TransactionProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const classes = useStyles();

  const confirmations = useDogeBlockConfirmations(transaction.height);

  const tx = useMemo(() => {
    // The transaction ID is the hash of the transaction, which is the hash of the transaction bytes.
    // The transaction bytes are in little-endian format, so we need to reverse them before converting to hex string.
    return toHexString(transaction.outpoint.txid.reverse());
  }, [transaction]);

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
        {/* <Flex fullWidth justify="space-between" align="flex-start">
          <Typography>{t("common.time")}</Typography>
          <Typography color="text.primary">
            {transaction.status.block_time ? (
              <>{dayjs(Number(transaction.status.block_time) * 1000).format("YYYY-MM-DD HH:mm:ss")}</>
            ) : (
              <>--</>
            )}
          </Typography>
        </Flex> */}

        <Flex fullWidth justify="space-between" align="flex-start">
          <Typography>{t("common.height")}</Typography>
          <Typography color="text.primary" component="div">
            {transaction.height ? (
              <ALink
                link={dogeBlockExplorer(transaction.height)}
                color="text.primary"
                textDecorationColor="text.primary"
              >
                {transaction.height}
              </ALink>
            ) : (
              "--"
            )}
          </Typography>
        </Flex>

        <Flex fullWidth justify="space-between" align="flex-start">
          <Typography>{t("common.txid")}</Typography>

          <Typography className={classes.txLink} component="div">
            <ALink link={dogeTransactionExplorer(tx)} color="secondary" textDecorationColor="secondary" align="right">
              {tx}
            </ALink>
          </Typography>
        </Flex>

        {/* <Flex fullWidth justify="space-between" align="flex-start">
          <Typography>{t("common.from")}</Typography>
          <Typography className={classes.txLink} component="div">
            <ALink
              link={dogeAddressExplorer(transaction.vin[0]?.prevout.scriptpubkey_address)}
              color="secondary"
              textDecorationColor="secondary"
              align="right"
            >
              {transaction.vin[0]?.prevout.scriptpubkey_address}
            </ALink>
          </Typography>
        </Flex> */}

        {/* <Flex fullWidth justify="space-between" align="flex-start">
          <Typography>{t("common.to")}</Typography>
          <Typography className={classes.txLink} component="div">
            {address ? (
              <ALink
                link={dogeAddressExplorer(address)}
                color="secondary"
                textDecorationColor="secondary"
                align="right"
              >
                {address}
              </ALink>
            ) : null}
          </Typography>
        </Flex> */}

        <Flex fullWidth justify="space-between">
          <Typography>{t("common.amount")}</Typography>
          <Typography color="text.primary">{parseDogeAmount(transaction.value).toFormat()}</Typography>
        </Flex>

        <Flex fullWidth justify="space-between">
          <Typography>{t("common.confirmations")}</Typography>
          <Typography color="text.primary">{confirmations ?? "--"}</Typography>
        </Flex>
      </Flex>
    </Box>
  );
}

export interface MintTransactionProps {
  refresh?: boolean | number;
  address: string | Null;
}

export function MintTransactions({ address }: MintTransactionProps) {
  const { t } = useTranslation();
  const { data, isLoading, refetch } = useUserDogeKnownUtxos();

  const handleRefetch = useCallback(() => {
    refetch();
  }, [refetch]);

  return (
    <MainCard level={1}>
      <Flex gap="0 8px">
        <Typography sx={{ color: "text.primary", fontSize: "16px" }}>{t("common.latest.transactions")}</Typography>

        <RotateCcw color="#ffffff" size={14} style={{ cursor: "pointer" }} onClick={handleRefetch} />
      </Flex>

      <Typography sx={{ margin: "12px 0 0 0", lineHeight: "20px", fontSize: "12px" }}>
        {t("ck.bridge.sync.block", {
          chainName: BridgeChainName.doge,
          symbol: "ckDOGE",
          confirmationBlock: DOGE_MINT_CONFIRMATIONS,
        })}
      </Typography>

      <Box sx={{ margin: "16px 0 0 0" }}>
        {isLoading ? (
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
        ) : isUndefinedOrNull(data) || data.length === 0 ? (
          <NoData tip={t("ck.empty")} />
        ) : (
          data.map((transaction, index) => (
            <Box key={index} sx={{ margin: "16px 0 0 0" }}>
              <Transaction transaction={transaction} address={address} />
            </Box>
          ))
        )}
      </Box>
    </MainCard>
  );
}
