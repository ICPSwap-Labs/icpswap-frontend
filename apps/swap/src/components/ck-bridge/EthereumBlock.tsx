import { Trans } from "@lingui/macro";
import { Typography } from "components/Mui";
import { useBlockNumber } from "hooks/web3/useBlockNumber";

export function EthereumBlock() {
  const blockNumber = useBlockNumber();

  return blockNumber ? (
    <Typography sx={{ fontSize: "12px" }}>
      <Trans>Ethereum network block height:</Trans> {blockNumber}
    </Typography>
  ) : null;
}
