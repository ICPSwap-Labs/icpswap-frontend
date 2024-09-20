import { Trans } from "@lingui/macro";
import { Typography } from "components/Mui";
import type { Erc20MinterInfo, Null } from "@icpswap/types";

export interface LastSyncBlockProps {
  minterInfo: Erc20MinterInfo | Null;
}

export function LastSyncBlock({ minterInfo }: LastSyncBlockProps) {
  return (
    <Typography sx={{ margin: "8px 0 0 0", fontSize: "12px" }}>
      <Trans>Last Ethereum synced block number:</Trans>{" "}
      {minterInfo?.last_erc20_scraped_block_number[0]?.toString() ?? "--"}
    </Typography>
  );
}
