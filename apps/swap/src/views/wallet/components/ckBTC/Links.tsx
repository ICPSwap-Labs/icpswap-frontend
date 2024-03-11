import { Box } from "@mui/material";
import { Trans } from "@lingui/macro";
import { ckBTC_CANISTER, ckBTC_DASHBOARD } from "constants/ckBTC";
import { Link } from "../Link";

export default function BTC_Links() {
  return (
    <Box sx={{ margin: "30px 0 0 0", display: "flex", flexDirection: "column", alignItems: "center", gap: "20px 0" }}>
      <Link href={ckBTC_DASHBOARD} label={<Trans>Open in ckBTC Dashboard</Trans>} />

      <Link href={ckBTC_CANISTER} label={<Trans>Open in ckBTC canister</Trans>} />
    </Box>
  );
}
