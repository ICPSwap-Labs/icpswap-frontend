import { Box, Typography, Table, TableBody, TableCell, TableRow, TableContainer, TableHead } from "@mui/material";
import { Trans, t } from "@lingui/macro";
import { MainCard, NoData, ALink } from "components/index";
import { useUserWithdrawTxs } from "store/web3/hooks";
import { useAccountPrincipalString } from "store/auth/hooks";
import { StoredWithdrawTxValue } from "types/ckETH";
import { parseTokenAmount } from "@icpswap/utils";
import { EXPLORER_TX_LINK } from "constants/ckETH";
import { ckETH } from "@icpswap/tokens";
import { HeaderCell, BodyCell, Flex } from "@icpswap/ui";
import type { Erc20MinterInfo } from "@icpswap/types";

function ListItem({ tx }: { tx: StoredWithdrawTxValue }) {
  return (
    <TableRow>
      <TableCell>
        <BodyCell>{tx.block_index}</BodyCell>
      </TableCell>
      <TableCell>
        <BodyCell>{tx.state ?? "--"}</BodyCell>
      </TableCell>
      <TableCell>
        {tx.hash ? (
          <BodyCell
            sx={{
              maxWidth: "400px",
              wordBreak: "break-all",
              whiteSpace: "break-spaces",
              "@media(max-width:640px)": { width: "300px" },
            }}
          >
            <ALink link={`${EXPLORER_TX_LINK}/${tx.hash}`} color="primary" textDecorationColor="primary">
              {tx.hash}
            </ALink>
          </BodyCell>
        ) : (
          <Typography>--</Typography>
        )}
      </TableCell>
      <TableCell>
        {tx.value ? (
          <BodyCell>{parseTokenAmount(tx.value, ckETH.decimals).toFormat()}</BodyCell>
        ) : (
          <BodyCell>--</BodyCell>
        )}
      </TableCell>
    </TableRow>
  );
}

export interface DissolveRecordsProps {
  blockNumber: number | undefined;
  minterInfo?: Erc20MinterInfo;
}

export default function DissolveRecords({ blockNumber, minterInfo }: DissolveRecordsProps) {
  const principal = useAccountPrincipalString();
  const userTxs = useUserWithdrawTxs(principal);

  const Headers = [
    { key: "block_index", label: t`Block Index` },
    { key: "state", label: t`State` },
    { key: "tx_id", label: t`Txid` },
    { key: "amount", label: t`Amount` },
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

      <Box sx={{ margin: "0 0 3px 0" }}>
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
            <TableBody>{userTxs?.map((tx) => <ListItem key={tx.block_index} tx={tx} />)}</TableBody>
          </Table>
          {userTxs?.length === 0 || !userTxs ? <NoData /> : null}
        </TableContainer>
      </Box>
    </MainCard>
  );
}
