import { useState, useCallback, ReactNode } from "react";
import { Box } from "components/Mui";
import { Position } from "@icpswap/swap-sdk";

import { CollectFeesModal } from "./Modal";

export interface CollectFeesProps {
  positionId: bigint;
  position: Position | undefined;
  children?: ReactNode;
  onCollectSuccess?: () => void;
  disabled?: boolean;
}

export function CollectFees({ position, positionId, children, onCollectSuccess, disabled }: CollectFeesProps) {
  const [open, setOpen] = useState(false);

  const handleShowCollect = useCallback(() => {
    if (disabled) return;
    setOpen(true);
  }, [setOpen, disabled]);

  return (
    <>
      <Box onClick={handleShowCollect}>{children}</Box>

      <CollectFeesModal
        open={open}
        position={position}
        positionId={positionId}
        onClose={() => setOpen(false)}
        onCollectSuccess={onCollectSuccess}
      />
    </>
  );
}
