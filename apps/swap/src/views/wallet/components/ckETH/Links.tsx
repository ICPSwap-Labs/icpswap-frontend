import { Box } from "@mui/material";
import { Trans } from "@lingui/macro";
import { ckETH_CANISTER, ckETH_DASHBOARD, EXPLORER_CONTRACT_LINK } from "constants/ckETH";
import { Link } from "../Link";

export default function ETH_Links() {
  return (
    <Box
      sx={{ margin: "16px 0 0 0", display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "10px 0" }}
    >
      <Link href={ckETH_DASHBOARD} label={<Trans>Open in ckETH Dashboard</Trans>} fontSize="12px" />
      <Link href={ckETH_CANISTER} label={<Trans>Open in ckETH canister</Trans>} fontSize="12px" />
      <Link
        href={EXPLORER_CONTRACT_LINK}
        label={<Trans>Open the ckETH smart contract on the Ethereum network</Trans>}
        fontSize="12px"
      />
    </Box>
  );
}
