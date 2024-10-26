import { Trans } from "@lingui/macro";
import { Typography } from "components/Mui";
import { useFinalizedBlockNumber } from "hooks/web3/useBlockNumber";

export function EthereumFinalizedBlock() {
  const blockNumber = useFinalizedBlockNumber();

  return blockNumber ? (
    <Typography sx={{ fontSize: "12px" }}>
      <Trans>Ethereum Network Last Finalized Block Height:</Trans> {blockNumber}
    </Typography>
  ) : null;
}
