import { Box, Typography , Table, TableBody, TableCell, TableRow, TableContainer, TableHead } from "@mui/material";
import { Trans } from "@lingui/macro";
import { MainCard, NoData, ALink } from "components/index";
import { useUserTxs } from "store/wallet/hooks";
import { useAccountPrincipalString } from "store/auth/hooks";
import { StoredTxValue } from "types/ckBTC";
import { parseTokenAmount } from "@icpswap/utils";

function ListItem({ tx }: { tx: StoredTxValue }) {
  return (
    <TableRow>
      <TableCell>
        <Typography>{tx.block_index}</Typography>
      </TableCell>
      <TableCell>
        <Typography>{tx.state ?? "--"}</Typography>
      </TableCell>
      <TableCell>
        {tx.txid ? (
          <Typography
            sx={{
              maxWidth: "400px",
              wordBreak: "break-all",
              whiteSpace: "break-spaces",
              "@media(max-width:640px)": { width: "300px" },
            }}
          >
            <ALink link={`https://explorer.btc.com/btc/transaction/${tx.txid}`}>{tx.txid}</ALink>
          </Typography>
        ) : (
          <Typography>--</Typography>
        )}
      </TableCell>
      <TableCell>
        {tx.value ? <Typography>{parseTokenAmount(tx.value, 8).toFormat()}</Typography> : <Typography>--</Typography>}
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
                  <Trans>Block Index</Trans>
                </TableCell>
                <TableCell>
                  <Trans>State</Trans>
                </TableCell>
                <TableCell>
                  <Trans>Txid</Trans>
                </TableCell>
                <TableCell>
                  <Trans>Amount</Trans>
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
