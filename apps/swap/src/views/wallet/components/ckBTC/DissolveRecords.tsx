import { Box, Typography, Table, TableBody, TableCell, TableRow, TableContainer, TableHead } from "@mui/material";
import { Trans } from "@lingui/macro";
import { MainCard, NoData, ALink } from "components/index";
import { useUserTxs } from "store/wallet/hooks";
import { useAccountPrincipalString } from "store/auth/hooks";
import { StoredTxValue } from "types/ckBTC";
import { parseTokenAmount } from "@icpswap/utils";
import { HeaderCell, BodyCell } from "@icpswap/ui";

function ListItem({ tx }: { tx: StoredTxValue }) {
  return (
    <TableRow>
      <TableCell>
        <BodyCell>{tx.block_index}</BodyCell>
      </TableCell>
      <TableCell>
        <BodyCell>{tx.state ?? "--"}</BodyCell>
      </TableCell>
      <TableCell>
        {tx.txid ? (
          <BodyCell
            sx={{
              maxWidth: "400px",
              wordBreak: "break-all",
              whiteSpace: "break-spaces",
              "@media(max-width:640px)": { width: "300px" },
            }}
          >
            <ALink
              link={`https://explorer.btc.com/btc/transaction/${tx.txid}`}
              color="primary"
              textDecorationColor="primary"
            >
              {tx.txid}
            </ALink>
          </BodyCell>
        ) : (
          <BodyCell>--</BodyCell>
        )}
      </TableCell>
      <TableCell>
        {tx.value ? <BodyCell>{parseTokenAmount(tx.value, 8).toFormat()}</BodyCell> : <BodyCell>--</BodyCell>}
      </TableCell>
    </TableRow>
  );
}

export default function DissolveRecords() {
  const principal = useAccountPrincipalString();
  const userTxs = useUserTxs(principal);

  return (
    <MainCard>
      <Box sx={{ display: "flex", justifyItems: "center" }}>
        <Typography color="#ffffff">
          <Trans>Retrieved:</Trans>
        </Typography>
      </Box>

      <Box sx={{ margin: "0 0 3px 0" }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <HeaderCell>
                    <Trans>Block Index</Trans>
                  </HeaderCell>
                </TableCell>
                <TableCell>
                  <HeaderCell>
                    <Trans>State</Trans>
                  </HeaderCell>
                </TableCell>
                <TableCell>
                  <HeaderCell>
                    <Trans>Txid</Trans>
                  </HeaderCell>
                </TableCell>
                <TableCell>
                  <HeaderCell>
                    <Trans>Amount</Trans>
                  </HeaderCell>
                </TableCell>
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
