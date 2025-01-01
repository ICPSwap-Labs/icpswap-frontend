import { Trans } from "@lingui/macro";
import { Typography } from "components/Mui";
import type { ChainKeyETHMinterInfo, Null } from "@icpswap/types";

export interface LastSyncBlockProps {
  minterInfo: ChainKeyETHMinterInfo | Null;
}

export function LastSyncBlock({ minterInfo }: LastSyncBlockProps) {
  return (
    <Typography sx={{ margin: "8px 0 0 0", fontSize: "12px" }}>
      <Trans>Last Ethereum Synced Block Height:</Trans>{" "}
      {minterInfo?.last_erc20_scraped_block_number[0]?.toString() ?? "--"}
    </Typography>
  );
}
