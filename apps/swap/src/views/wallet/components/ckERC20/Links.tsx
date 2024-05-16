import { Box } from "@mui/material";
import { Trans } from "@lingui/macro";
import { getExplorerAddress } from "constants/web3";
import { ckERC20LedgerDashboardLink, ERC20_MINTER_DASHBOARD } from "constants/ckERC20";
import { Token } from "@icpswap/swap-sdk";

import { Link } from "../Link";

export interface LinksProps {
  ckToken: Token | undefined;
  helperContract: string | undefined;
}

export default function Links({ ckToken, helperContract }: LinksProps) {
  return (
    <Box
      sx={{ margin: "16px 0 0 0", display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "10px 0" }}
    >
      <Link
        href={ERC20_MINTER_DASHBOARD}
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

      {helperContract ? (
        <Link
          href={getExplorerAddress(helperContract)}
          label={<Trans>Open the helper contract on the Ethereum network</Trans>}
          fontSize="12px"
        />
      ) : null}
    </Box>
  );
}
