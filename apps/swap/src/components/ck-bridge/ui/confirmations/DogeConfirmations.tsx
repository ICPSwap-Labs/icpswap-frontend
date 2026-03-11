import { Flex } from "@icpswap/ui";
import { isUndefinedOrNull } from "@icpswap/utils";
import { Typography } from "components/Mui";
import { useMemo } from "react";
import { useDogeDissolveTx, useDogeBlockConfirmations } from "hooks/ck-bridge";
import { DOGE_MINT_CONFIRMATIONS } from "constants/chain-key";
import { Arrow } from "components/ck-bridge/ui/confirmations/Confirmations";

interface DogeMintConfirmationsProps {
  hash: string;
}

export function DogeMintConfirmations({ hash }: DogeMintConfirmationsProps) {
  const tx = useDogeDissolveTx(hash);
  const confirmations = useDogeBlockConfirmations(tx?.block_index);

  const block = useMemo(() => {
    if (isUndefinedOrNull(confirmations)) return undefined;

    const block = DOGE_MINT_CONFIRMATIONS - confirmations;

    return block < 0 ? 0 : block;
  }, [DOGE_MINT_CONFIRMATIONS, confirmations]);

  return (
    <Flex sx={{ gap: "0 3px" }}>
      <Arrow />
      <Typography sx={{ fontSize: "12px", color: "text.primary" }}>{block ?? "--"}</Typography>
      <Typography sx={{ fontSize: "12px" }}>blocks</Typography>
    </Flex>
  );
}

interface DogeDissolveConfirmationsProps {
  hash: string | undefined;
}

export function DogeDissolveConfirmations({ hash }: DogeDissolveConfirmationsProps) {
  const tx = useDogeDissolveTx(hash);

  return (
    <Flex sx={{ gap: "0 4px" }}>
      <Typography sx={{ fontSize: "12px" }}>{tx?.state ?? "Pending"}</Typography>
    </Flex>
  );
}
