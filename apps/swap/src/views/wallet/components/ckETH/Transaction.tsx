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
import { HeaderCell, BodyCell, Flex } from "@icpswap/ui";
import type { Erc20MinterInfo } from "@icpswap/types";

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
  minterInfo?: Erc20MinterInfo;
}

export default function Transactions({ blockNumber, minterInfo }: TransactionsProps) {
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
      <Flex vertical gap="12px 0" align="flex-start">
        <Typography fontSize="18px" fontWeight={500} color="text.primary">
          <Trans>Network state</Trans>
        </Typography>

        <Typography>
          <Trans>Ethereum network block height:</Trans>&nbsp;
          <Typography component="span" color="text.primary">
            {blockNumber ?? "--"}
          </Typography>
        </Typography>

        {minterInfo ? (
          <Typography>
            <Trans>Last ETH synced block number:</Trans>&nbsp;
            <Typography component="span" color="text.primary">
              {minterInfo.last_eth_scraped_block_number[0]?.toString()}
            </Typography>
          </Typography>
        ) : null}
      </Flex>

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
