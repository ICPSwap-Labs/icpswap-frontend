import { Flex } from "@icpswap/ui";
import { isUndefinedOrNull } from "@icpswap/utils";
import { Typography } from "components/Mui";
import { useMemo } from "react";
import { useEthDissolveTx, useEthTxResponse } from "store/web3/hooks";
import { useEthereumTxBlocksToSyncedBlock } from "hooks/ck-bridge/useEthereumConfirmations";
import { Arrow } from "components/ck-bridge/ui/confirmations/Confirmations";

interface EthereumMintConfirmationsProps {
  hash: string;
  erc20?: boolean;
}

export function EthereumMintConfirmations({ hash, erc20 }: EthereumMintConfirmationsProps) {
  const transactionResponse = useEthTxResponse(hash);
  const getBlocksToSyncedBlock = useEthereumTxBlocksToSyncedBlock();

  const block = useMemo(() => {
    if (isUndefinedOrNull(transactionResponse) || isUndefinedOrNull(transactionResponse.blockNumber)) return undefined;
    return getBlocksToSyncedBlock(Number(transactionResponse.blockNumber), erc20);
  }, [getBlocksToSyncedBlock, transactionResponse, erc20]);

  return (
    <Flex sx={{ gap: "0 3px" }}>
      <Arrow />
      <Typography sx={{ fontSize: "12px", color: "text.primary" }}>{block ?? "--"}</Typography>
      <Typography sx={{ fontSize: "12px" }}>blocks</Typography>
    </Flex>
  );
}

interface EthereumDissolveConfirmationsProps {
  hash: string | undefined;
}

export function EthereumDissolveConfirmations({ hash }: EthereumDissolveConfirmationsProps) {
  const ethereumDissolveTx = useEthDissolveTx(hash);

  return (
    <Flex sx={{ gap: "0 4px" }}>
      <Typography sx={{ fontSize: "12px" }}>{ethereumDissolveTx?.state ? ethereumDissolveTx?.state : "--"}</Typography>
    </Flex>
  );
}
