import { Flex } from "@icpswap/ui";
import { isUndefinedOrNull } from "@icpswap/utils";
import { Arrow } from "components/ck-bridge/ui/confirmations/Confirmations";
import { Typography } from "components/Mui";
import { BITCOIN_CONFIRMATIONS } from "constants/chain-key";
import { useBitcoinConfirmations } from "hooks/ck-bridge";
import { useMemo } from "react";
import { useBitcoinDissolveTx } from "store/wallet/hooks";
import { useBitcoinTxResponse } from "store/web3/hooks";

interface BitcoinMintConfirmationsProps {
  hash: string;
}

export function BitcoinMintConfirmations({ hash }: BitcoinMintConfirmationsProps) {
  const transactionResponse = useBitcoinTxResponse(hash);
  const confirmations = useBitcoinConfirmations(transactionResponse?.block_height);

  const block = useMemo(() => {
    if (isUndefinedOrNull(confirmations)) return undefined;

    const block = BITCOIN_CONFIRMATIONS - confirmations;

    return block < 0 ? 0 : block;
  }, [BITCOIN_CONFIRMATIONS, confirmations]);

  return (
    <Flex sx={{ gap: "0 3px" }}>
      <Arrow />
      <Typography sx={{ fontSize: "12px", color: "text.primary" }}>{block ?? "--"}</Typography>
      <Typography sx={{ fontSize: "12px" }}>blocks</Typography>
    </Flex>
  );
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
