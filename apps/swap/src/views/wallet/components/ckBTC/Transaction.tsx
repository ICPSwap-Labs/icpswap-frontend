import { useState, useMemo } from "react";
import { Box, Typography, Table, TableBody, TableCell, TableRow, TableContainer, TableHead } from "@mui/material";
import { Trans } from "@lingui/macro";
import { MainCard, ListLoading, NoData, ALink } from "components/index";
import { useBTCTransactions, BTCTx } from "hooks/ck-btc/useBTCCalls";
import { parseTokenAmount } from "@icpswap/utils";
import dayjs from "dayjs";
import { BodyCell, HeaderCell } from "@icpswap/ui";

function RefreshIcon() {
  return (
    <svg width="12" height="14" viewBox="0 0 12 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M6.0013 3.33268V0.666016L2.66797 3.99935L6.0013 7.33268V4.66602C8.20797 4.66602 10.0013 6.45935 10.0013 8.66602C10.0013 10.8727 8.20797 12.666 6.0013 12.666C3.79464 12.666 2.0013 10.8727 2.0013 8.66602H0.667969C0.667969 11.6127 3.05464 13.9993 6.0013 13.9993C8.94797 13.9993 11.3346 11.6127 11.3346 8.66602C11.3346 5.71935 8.94797 3.33268 6.0013 3.33268Z"
        fill="white"
      />
    </svg>
  );
}

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

export interface ListItemProps {
  address: string | undefined | null;
  transaction: BTCTx;
  block: number | undefined | null;
}

function ListItem({ transaction, block, address }: ListItemProps) {
  return (
    <TableRow>
      <TableCell>
        <BodyCell>
          {transaction.status.block_time ? (
            <>{dayjs(Number(transaction.status.block_time) * 1000).format("YYYY-MM-DD HH:mm:ss")}</>
          ) : (
            <>--</>
          )}
        </BodyCell>
      </TableCell>
      <TableCell>
        <BodyCell>
          {transaction.status.block_height ? (
            <ALink link={`https://explorer.btc.com/btc/block/${transaction.status.block_height}`} color="text.primary">
              {transaction.status.block_height}
            </ALink>
          ) : (
            <BodyCell>--</BodyCell>
          )}
        </BodyCell>
      </TableCell>
      <TableCell>
        <BodyCell
          sx={{
            maxWidth: "200px",
            wordBreak: "break-all",
            whiteSpace: "break-spaces",
            "@media(max-width:640px)": { width: "300px" },
          }}
        >
          <ALink
            link={`https://explorer.btc.com/btc/transaction/${transaction.txid}`}
            color="primary"
            textDecorationColor="primary"
          >
            {transaction.txid}
          </ALink>
        </BodyCell>
      </TableCell>
      <TableCell>
        <Typography
          sx={{
            maxWidth: "200px",
            wordBreak: "break-all",
            whiteSpace: "break-spaces",
            "@media(max-width:640px)": { width: "300px" },
          }}
        >
          <ALink
            link={`https://explorer.btc.com/btc/address/${transaction.vin[0]?.prevout.scriptpubkey_address}`}
            color="primary"
            textDecorationColor="primary"
          >
            {transaction.vin[0]?.prevout.scriptpubkey_address}
          </ALink>
        </Typography>
      </TableCell>
      <TableCell>
        <Typography
          sx={{
            maxWidth: "200px",
            wordBreak: "break-all",
            whiteSpace: "break-spaces",
            "@media(max-width:640px)": { width: "300px" },
          }}
        >
          <ALink link={`https://explorer.btc.com/btc/address/${address}`} color="primary" textDecorationColor="primary">
            {address}
          </ALink>
        </Typography>
      </TableCell>
      <TableCell>
        <BodyCell>{parseTokenAmount(getTransactionAmountOut(transaction, address), 8).toFormat()}</BodyCell>
      </TableCell>
      <TableCell>
        <BodyCell>
          {block && transaction.status.block_height ? Number(block) - transaction.status.block_height : "--"}
        </BodyCell>
      </TableCell>
    </TableRow>
  );
}

export interface TransactionsProps {
  block: number | undefined;
  address: string | undefined | null;
}

export default function Transactions({ address, block }: TransactionsProps) {
  const [reload, setReload] = useState(false);

  const { result: list, loading } = useBTCTransactions(address, reload);

  const data = useMemo(() => {
    if (!address) return [];

    return list?.filter((ele) => !isTransactionContainedFrom(ele, address)).slice(0, 8);
  }, [list, address]);

  return (
    <MainCard>
      <Box sx={{ display: "flex", justifyItems: "center" }}>
        <Typography color="#ffffff" sx={{ margin: "0 5px 0 0" }}>
          <Trans>Lastest Transactions: </Trans>
        </Typography>

        <Box sx={{ cursor: "pointer" }} onClick={() => setReload(!reload)}>
          <RefreshIcon />
        </Box>
      </Box>
      <Typography color="#ffffff" sx={{ margin: "5px 0 0 0" }}>
        <Trans>Wait for 12 confirmations, then update ckBTC balance.</Trans>
      </Typography>

      <Box sx={{ margin: "20px 0 3px 0" }}>
        <TableContainer className={loading || !address ? "with-loading" : ""}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <HeaderCell>
                    <Trans>Time</Trans>
                  </HeaderCell>
                </TableCell>
                <TableCell>
                  <HeaderCell>
                    <Trans>Height</Trans>
                  </HeaderCell>
                </TableCell>
                <TableCell>
                  <HeaderCell>
                    <Trans>Txid</Trans>
                  </HeaderCell>
                </TableCell>
                <TableCell>
                  <HeaderCell>
                    <Trans>From</Trans>
                  </HeaderCell>
                </TableCell>
                <TableCell>
                  <HeaderCell>
                    <Trans>To</Trans>
                  </HeaderCell>
                </TableCell>
                <TableCell>
                  <HeaderCell>
                    <Trans>Amount</Trans>
                  </HeaderCell>
                </TableCell>
                <TableCell>
                  <HeaderCell>
                    <Trans>Confirmations</Trans>
                  </HeaderCell>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data?.map((transaction) => (
                <ListItem key={transaction.txid} transaction={transaction} block={block} address={address} />
              ))}
            </TableBody>
          </Table>
          {data?.length === 0 && !loading ? <NoData /> : null}
          <ListLoading loading={loading || !address} />
        </TableContainer>
      </Box>
    </MainCard>
  );
}
