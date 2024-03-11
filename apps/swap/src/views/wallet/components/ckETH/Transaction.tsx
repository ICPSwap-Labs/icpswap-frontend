import { Box, Typography } from "@mui/material";
import { Trans } from "@lingui/macro";
import { MainCard, NoData, ALink } from "components/index";
import { Table, TableBody, TableCell, TableRow, TableContainer, TableHead } from "@mui/material";
import { parseTokenAmount, toSignificant } from "@icpswap/utils";
import dayjs from "dayjs";
import { usePrincipalTX } from "store/web3/hooks";
import { useAccountPrincipalString } from "store/auth/hooks";
import { TX } from "types/web3";
import { EXPLORER_TX_LINK, EXPLORER_ADDRESS_LINK, EXPLORER_BLOCK_LINK } from "constants/ckETH";
import { useTransaction } from "hooks/web3/useTransaction";

export interface ListItemProps {
  transaction: TX;
}

function ListItem({ transaction }: ListItemProps) {
  const trans = useTransaction(transaction.hash);

  return (
    <TableRow>
      <TableCell>
        <Typography>{dayjs(Number(transaction.timestamp)).format("YYYY-MM-DD HH:mm:ss")}</Typography>
      </TableCell>
      <TableCell>
        {trans?.blockNumber ? (
          <ALink link={`${EXPLORER_BLOCK_LINK}/${trans.blockNumber}`}>{trans.blockNumber}</ALink>
        ) : (
          "--"
        )}
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
          <ALink link={`${EXPLORER_TX_LINK}/${transaction.hash}`}>{transaction.hash}</ALink>
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
          <ALink link={`${EXPLORER_ADDRESS_LINK}/${transaction.from}`}>{transaction.from}</ALink>
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
          {transaction.to ? <ALink link={`${EXPLORER_ADDRESS_LINK}/${transaction.to}`}>{transaction.to}</ALink> : "--"}
        </Typography>
      </TableCell>
      <TableCell>
        <Typography>{toSignificant(parseTokenAmount(transaction.value, 18).toString())}</Typography>
      </TableCell>
      <TableCell>
        <Typography>{trans ? trans.confirmations : "--"}</Typography>
      </TableCell>
    </TableRow>
  );
}

export interface TransactionsProps {
  blockNumber: number | undefined;
}

export default function Transactions({ blockNumber }: TransactionsProps) {
  const principal = useAccountPrincipalString();
  const tx = usePrincipalTX(principal);

  return (
    <MainCard>
      <Box sx={{ display: "flex", justifyItems: "center" }}>
        <Typography color="#ffffff" sx={{ margin: "0 5px 0 0" }}>
          <Trans>Network state:</Trans>
        </Typography>
      </Box>
      <Typography color="#ffffff" sx={{ margin: "5px 0 0 0" }}>
        <Trans>Ethereum network block height:</Trans>&nbsp;
        {blockNumber}
      </Typography>

      <Box sx={{ margin: "0 0 3px 0" }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <Trans>Time</Trans>
                </TableCell>
                <TableCell>
                  <Trans>Height</Trans>
                </TableCell>
                <TableCell>
                  <Trans>Txid</Trans>
                </TableCell>
                <TableCell>
                  <Trans>From</Trans>
                </TableCell>
                <TableCell>
                  <Trans>To</Trans>
                </TableCell>
                <TableCell>
                  <Trans>Amount</Trans>
                </TableCell>
                <TableCell>
                  <Trans>Confirmations</Trans>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tx?.map((transaction) => <ListItem key={transaction.hash} transaction={transaction} />)}
            </TableBody>
          </Table>
          {!tx || tx?.length === 0 ? <NoData /> : null}
        </TableContainer>
      </Box>
    </MainCard>
  );
}
