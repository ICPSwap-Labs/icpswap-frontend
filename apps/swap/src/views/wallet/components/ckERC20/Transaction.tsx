import { Box, Typography, Table, TableBody, TableCell, TableRow, TableContainer, TableHead } from "@mui/material";
import { Trans, t } from "@lingui/macro";
import { MainCard, NoData, ALink } from "components/index";
import { parseTokenAmount, toSignificant } from "@icpswap/utils";
import dayjs from "dayjs";
import { usePrincipalTX } from "store/web3/hooks";
import { useAccountPrincipalString } from "store/auth/hooks";
import { TX } from "types/web3";
import { EXPLORER_TX_LINK, EXPLORER_ADDRESS_LINK, EXPLORER_BLOCK_LINK } from "constants/ckETH";
import { useTransaction } from "hooks/web3/useTransaction";
import { HeaderCell, BodyCell } from "@icpswap/ui";

export interface ListItemProps {
  transaction: TX;
}

function ListItem({ transaction }: ListItemProps) {
  const trans = useTransaction(transaction.hash);

  return (
    <TableRow>
      <TableCell>
        <BodyCell>{dayjs(Number(transaction.timestamp)).format("YYYY-MM-DD HH:mm:ss")}</BodyCell>
      </TableCell>
      <TableCell>
        <BodyCell>
          {trans?.blockNumber ? (
            <ALink link={`${EXPLORER_BLOCK_LINK}/${trans.blockNumber}`} color="text.primary">
              {trans.blockNumber}
            </ALink>
          ) : (
            "--"
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
          <ALink link={`${EXPLORER_TX_LINK}/${transaction.hash}`} color="primary" textDecorationColor="primary">
            {transaction.hash}
          </ALink>
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
          <ALink link={`${EXPLORER_ADDRESS_LINK}/${transaction.from}`} color="primary" textDecorationColor="primary">
            {transaction.from}
          </ALink>
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
          {transaction.to ? (
            <ALink link={`${EXPLORER_ADDRESS_LINK}/${transaction.to}`} color="primary" textDecorationColor="primary">
              {transaction.to}
            </ALink>
          ) : (
            "--"
          )}
        </BodyCell>
      </TableCell>
      <TableCell>
        <BodyCell>{toSignificant(parseTokenAmount(transaction.value, 18).toString())}</BodyCell>
      </TableCell>
      <TableCell>
        <BodyCell>{trans ? trans.confirmations : "--"}</BodyCell>
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

  const Headers = [
    { key: "Time", label: t`Time` },
    { key: "Height", label: t`Height` },
    { key: "Txid", label: t`Txid` },
    { key: "From", label: t`From` },
    { key: "To", label: t`To` },
    { key: "Amount", label: t`Amount` },
    { key: "Confirmations", label: t`Confirmations` },
  ];

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

      <Box sx={{ margin: "20px 0 3px 0" }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                {Headers.map((header) => (
                  <TableCell key={header.key}>
                    <HeaderCell>{header.label}</HeaderCell>
                  </TableCell>
                ))}
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
