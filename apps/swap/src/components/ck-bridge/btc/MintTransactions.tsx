import { useMemo } from "react";
import { Box, Typography, useTheme, makeStyles } from "components/Mui";
import { Trans } from "@lingui/macro";
import { MainCard, NoData, ALink } from "components/index";
import { parseTokenAmount } from "@icpswap/utils";
import { Flex, LoadingRow } from "@icpswap/ui";
import { useBtcTransactions, BTCTx } from "hooks/ck-bridge/index";
import { Null } from "@icpswap/types";
import dayjs from "dayjs";
import { RotateCcw } from "react-feather";
import { useRefreshTriggerManager } from "hooks/index";

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

function getTransactionAmountOut(transaction: BTCTx | undefined, address: string | undefined | null) {
  if (!transaction || !address) return "--";

  let amount: number | string = "--";

  for (let i = 0; i < transaction.vout.length; i++) {
    const trans = transaction.vout[i];

    if (trans.scriptpubkey_address === address) {
      amount = trans.value;
      break;
    }
  }

  return amount;
}

interface TransactionProps {
  transaction: BTCTx;
  address: string | Null;
  block: string | number | Null;
}

function Transaction({ transaction, address, block }: TransactionProps) {
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
          <Typography>
            <Trans>Time</Trans>
          </Typography>
          <Typography color="text.primary">
            {transaction.status.block_time ? (
              <>{dayjs(Number(transaction.status.block_time) * 1000).format("YYYY-MM-DD HH:mm:ss")}</>
            ) : (
              <>--</>
            )}
          </Typography>
        </Flex>

        <Flex fullWidth justify="space-between" align="flex-start">
          <Typography>
            <Trans>Height</Trans>
          </Typography>
          <Typography color="text.primary">
            {transaction.status.block_height ? (
              <ALink
                link={`https://explorer.btc.com/btc/block/${transaction.status.block_height}`}
                color="text.primary"
              >
                {transaction.status.block_height}
              </ALink>
            ) : (
              "--"
            )}
          </Typography>
        </Flex>

        <Flex fullWidth justify="space-between" align="flex-start">
          <Typography>
            <Trans>Txid</Trans>
          </Typography>

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
        </Flex>

        <Flex fullWidth justify="space-between" align="flex-start">
          <Typography>
            <Trans>From</Trans>
          </Typography>
          <Typography className={classes.txLink}>
            <ALink
              link={`https://explorer.btc.com/btc/address/${transaction.vin[0]?.prevout.scriptpubkey_address}`}
              color="secondary"
              textDecorationColor="secondary"
              align="right"
            >
              {transaction.vin[0]?.prevout.scriptpubkey_address}
            </ALink>
          </Typography>
        </Flex>

        <Flex fullWidth justify="space-between" align="flex-start">
          <Typography>
            <Trans>To</Trans>
          </Typography>
          <Typography className={classes.txLink}>
            <ALink
              link={`https://explorer.btc.com/btc/address/${address}`}
              color="secondary"
              textDecorationColor="secondary"
              align="right"
            >
              {address}
            </ALink>
          </Typography>
        </Flex>

        <Flex fullWidth justify="space-between">
          <Typography>
            <Trans>Amount</Trans>
          </Typography>
          <Typography color="text.primary">
            {parseTokenAmount(getTransactionAmountOut(transaction, address), 8).toFormat()}
          </Typography>
        </Flex>

        <Flex fullWidth justify="space-between">
          <Typography>
            <Trans>Confirmations</Trans>
          </Typography>
          <Typography color="text.primary">
            {block && transaction.status.block_height ? Number(block) - transaction.status.block_height : "--"}
          </Typography>
        </Flex>
      </Flex>
    </Box>
  );
}

function isTransactionContainedFrom(transaction: BTCTx, address: string) {
  if (!transaction || !address) return false;

  let contained = false;

  for (let i = 0; i < transaction.vin.length; i++) {
    const trans = transaction.vin[i];

    if (trans.prevout.scriptpubkey_address === address) {
      contained = true;
      break;
    }
  }

  return contained;
}

export interface MintTransactionProps {
  refresh?: boolean | number;
  btc_address: string | Null;
  block: string | number | Null;
}

export function MintTransactions({ btc_address, block }: MintTransactionProps) {
  const [refreshTrigger, setRefreshTrigger] = useRefreshTriggerManager("BtcMintTransactions");

  const { result: transactions, loading } = useBtcTransactions(btc_address, refreshTrigger);

  const slicedTransactions = useMemo(() => {
    if (!btc_address) return [];
    return transactions?.filter((ele) => !isTransactionContainedFrom(ele, btc_address)).slice(0, 8);
  }, [transactions, btc_address]);

  return (
    <MainCard level={1}>
      <Flex gap="0 8px">
        <Typography sx={{ color: "text.primary", fontSize: "16px" }}>
          <Trans>Latest Transactions</Trans>
        </Typography>

        <RotateCcw color="#ffffff" size={14} style={{ cursor: "pointer" }} onClick={setRefreshTrigger} />
      </Flex>

      <Typography sx={{ margin: "12px 0 0 0", lineHeight: "20px", fontSize: "12px" }}>
        <Trans>
          After the IC's Bitcoin network syncs to the Bitcoin mainnet height and the transaction receives 6 block
          confirmations, your ckBTC balance will be updated accordingly.
        </Trans>
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
            {slicedTransactions?.map((transaction, index) => (
              <Box key={index} sx={{ margin: "16px 0 0 0" }}>
                <Transaction transaction={transaction} address={btc_address} block={block} />
              </Box>
            ))}
            {transactions?.length === 0 || !transactions ? <NoData /> : null}
          </>
        )}
      </Box>
    </MainCard>
  );
}
