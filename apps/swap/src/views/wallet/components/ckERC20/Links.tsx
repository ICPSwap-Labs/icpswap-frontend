import { Box } from "@mui/material";
import { Trans } from "@lingui/macro";
import {
  ckERC20LedgerDashboardLink,
  CK_ERC20_MINTER_DASHBOARD,
  ERC20_HELPER_SMART_CONTRACT_EXPLORER,
} from "constants/ckERC20";
import { Token } from "@icpswap/swap-sdk";

import { Link } from "../Link";

export interface LinksProps {
  ckToken: Token | undefined;
}

export default function Links({ ckToken }: LinksProps) {
  return (
    <Box
      sx={{ margin: "16px 0 0 0", display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "10px 0" }}
    >
      <Link
        href={CK_ERC20_MINTER_DASHBOARD}
        label={<Trans>Open in {ckToken?.symbol ?? "--"} Dashboard</Trans>}
        fontSize="12px"
      />

      {ckToken ? (
        <Link
          href={ckERC20LedgerDashboardLink(ckToken.address)}
          label={<Trans>Open in {ckToken.symbol} canister</Trans>}
          fontSize="12px"
        />
      ) : null}

      <Link
        href={ERC20_HELPER_SMART_CONTRACT_EXPLORER}
        label={<Trans>Open the helper contract on the Ethereum network</Trans>}
        fontSize="12px"
      />
    </Box>
  );
}
