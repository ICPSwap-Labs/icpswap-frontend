import { useState, useCallback, ReactNode } from "react";
import { Box } from "components/Mui";
import { Position } from "@icpswap/swap-sdk";

import { TransferPositionModal } from "./Modal";

export interface TransferPositionProps {
  positionId: bigint;
  position: Position | undefined;
  children?: ReactNode;
  onTransferSuccess?: () => void;
}

export function TransferPosition({ position, positionId, children, onTransferSuccess }: TransferPositionProps) {
  const [transferShow, setTransferShow] = useState(false);

  const handleTransferPosition = useCallback(() => {
    setTransferShow(true);
  }, [setTransferShow]);

  return (
    <>
      <Box onClick={handleTransferPosition}>{children}</Box>

      {transferShow ? (
        <TransferPositionModal
          open={transferShow}
          position={position}
          positionId={positionId}
          onClose={() => setTransferShow(false)}
          onTransferSuccess={onTransferSuccess}
        />
      ) : null}
    </>
  );
}
