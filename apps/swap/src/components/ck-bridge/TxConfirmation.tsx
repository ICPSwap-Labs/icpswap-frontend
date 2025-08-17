import { Flex } from "@icpswap/ui";
import { BigNumber, isUndefinedOrNull, numToPercent } from "@icpswap/utils";
import { Box, Typography, useTheme } from "components/Mui";
import { useMemo } from "react";
import { useBitcoinTxResponse, useErc20DissolveDetails, useEthDissolveTx, useEthTxResponse } from "store/web3/hooks";
import { useBitcoinConfirmations } from "hooks/ck-bridge";
import { BITCOIN_CONFIRMATIONS } from "constants/ckBTC";
import { erc20DissolveStatus } from "utils/web3/dissolve";
import { useBitcoinDissolveTx } from "store/wallet/hooks";
import { useGlobalMinterInfoManager } from "store/global/hooks";

function Arrow() {
  return <Typography>Δ</Typography>;
}

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

interface EthereumMintConfirmationsProps {
  hash: string;
  erc20?: boolean;
}

export function EthereumMintConfirmations({ hash, erc20 }: EthereumMintConfirmationsProps) {
  const transactionResponse = useEthTxResponse(hash);
  const [minterInfo] = useGlobalMinterInfoManager();

  const { last_erc20_scraped_block, last_eth_scraped_block } = useMemo(() => {
    if (isUndefinedOrNull(minterInfo)) return {};

    return {
      last_eth_scraped_block: minterInfo.last_eth_scraped_block_number[0],
      last_erc20_scraped_block: minterInfo.last_erc20_scraped_block_number[0],
    };
  }, [minterInfo]);

  const block = useMemo(() => {
    if (isUndefinedOrNull(transactionResponse)) return undefined;

    const txBlockNumber = transactionResponse.blockNumber;

    if (isUndefinedOrNull(txBlockNumber)) return undefined;

    if (erc20) {
      if (isUndefinedOrNull(last_erc20_scraped_block)) return undefined;
      return Number(txBlockNumber) - Number(last_erc20_scraped_block);
    }

    if (isUndefinedOrNull(last_eth_scraped_block)) return undefined;

    return Number(txBlockNumber) - Number(last_eth_scraped_block);
  }, [last_erc20_scraped_block, last_eth_scraped_block, transactionResponse, erc20]);

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

interface BitcoinMintConfirmationsProps {
  hash: string;
}

export function BitcoinMintConfirmations({ hash }: BitcoinMintConfirmationsProps) {
  const transactionResponse = useBitcoinTxResponse(hash);
  const confirmations = useBitcoinConfirmations(transactionResponse?.block_height);

  return <ConfirmationsUI confirmations={BITCOIN_CONFIRMATIONS} currentConfirmations={confirmations} />;
}

interface BitcoinDissolveConfirmationsProps {
  hash: string | undefined;
}

export function BitcoinDissolveConfirmations({ hash }: BitcoinDissolveConfirmationsProps) {
  const bitcoinTx = useBitcoinDissolveTx(hash);

  return (
    <Flex sx={{ gap: "0 4px" }}>
      <Typography sx={{ fontSize: "12px" }}>{bitcoinTx?.state ?? "Pending"}</Typography>
    </Flex>
  );
}
