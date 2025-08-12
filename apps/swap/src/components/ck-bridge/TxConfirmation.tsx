import { Flex } from "@icpswap/ui";
import { BigNumber, isUndefinedOrNull, numToPercent } from "@icpswap/utils";
import { Box, Typography, useTheme } from "components/Mui";
import { useMemo } from "react";
import { useBitcoinTxResponse, useErc20DissolveDetails, useEthTxResponse } from "store/web3/hooks";
import { ETHEREUM_CONFIRMATIONS } from "constants/web3";
import { useBitcoinBlockNumber } from "hooks/ck-bridge";
import { BITCOIN_CONFIRMATIONS } from "constants/ckBTC";
import { useEthereumConfirmationsByBlock } from "hooks/ck-bridge/useEthereumConfirmations";
import { erc20DissolveStatus } from "utils/web3/dissolve";

interface ConfirmationsUIProps {
  confirmations: number;
  currentConfirmations: number | undefined;
}

function ConfirmationsUI({ confirmations, currentConfirmations }: ConfirmationsUIProps) {
  const theme = useTheme();

  const width = useMemo(() => {
    if (isUndefinedOrNull(currentConfirmations)) return "0%";

    return !new BigNumber(currentConfirmations).isLessThan(confirmations)
      ? "100%"
      : numToPercent(new BigNumber(currentConfirmations).dividedBy(confirmations).toNumber());
  }, [confirmations, currentConfirmations]);

  return (
    <Flex sx={{ gap: "0 4px" }}>
      <Box sx={{ width: "40px", height: "4px", borderRadius: "20px", background: theme.palette.background.level4 }}>
        <Box sx={{ width, height: "4px", borderRadius: "20px", background: "#54C081" }} />
      </Box>

      <Flex>
        <Typography sx={{ fontSize: "12px", color: "text.primary" }}>{currentConfirmations ?? 0}</Typography>
        <Typography sx={{ fontSize: "12px" }}>/</Typography>
        <Typography sx={{ fontSize: "12px" }}>{confirmations}</Typography>
      </Flex>
    </Flex>
  );
}

interface EthereumConfirmationsProps {
  hash: string;
}

export function EthereumConfirmations({ hash }: EthereumConfirmationsProps) {
  const transactionResponse = useEthTxResponse(hash);
  const confirmations = useEthereumConfirmationsByBlock(transactionResponse?.blockNumber);

  return <ConfirmationsUI confirmations={ETHEREUM_CONFIRMATIONS} currentConfirmations={confirmations} />;
}

interface Erc20DissolveConfirmations {
  withdraw_id: string;
}

export function Erc20DissolveConfirmations({ withdraw_id }: Erc20DissolveConfirmations) {
  const erc20DissolveDetails = useErc20DissolveDetails(withdraw_id);

  return (
    <Flex sx={{ gap: "0 4px" }}>
      <Typography sx={{ fontSize: "12px" }}>
        {erc20DissolveDetails?.status ? erc20DissolveStatus(erc20DissolveDetails?.status) : "--"}
      </Typography>
    </Flex>
  );
}

interface BitcoinConfirmationsProps {
  hash: string;
}

export function BitcoinConfirmations({ hash }: BitcoinConfirmationsProps) {
  const transactionResponse = useBitcoinTxResponse(hash);
  const block = useBitcoinBlockNumber();

  const confirmations = useMemo(() => {
    if (isUndefinedOrNull(block) || isUndefinedOrNull(transactionResponse?.block_height)) return undefined;

    return Number(block) - Number(transactionResponse.block_height);
  }, [block, transactionResponse]);

  return <ConfirmationsUI confirmations={BITCOIN_CONFIRMATIONS} currentConfirmations={confirmations} />;
}
