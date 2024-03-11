import { Box } from "@mui/material";
import { Trans } from "@lingui/macro";
import { ckETH_CANISTER, ckETH_DASHBOARD, EXPLORER_CONTRACT_LINK } from "constants/ckETH";
import { Link } from "../Link";

export default function ETH_Links() {
  return (
    <Box sx={{ margin: "30px 0 0 0", display: "flex", flexDirection: "column", alignItems: "center", gap: "20px 0" }}>
      <Link href={ckETH_DASHBOARD} label={<Trans>Open in ckETH Dashboard</Trans>} />
      <Link href={ckETH_CANISTER} label={<Trans>Open in ckETH canister</Trans>} />
      <Link
        href={EXPLORER_CONTRACT_LINK}
        label={<Trans>Open the ckETH smart contract on the Ethereum network</Trans>}
      />
    </Box>
  );
}
