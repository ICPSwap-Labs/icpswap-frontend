import { useMemo } from "react";
import { Box } from "@mui/material";
import PositionItemComponent from "components/swap/v2/PositionItem";
import { usePositionInfo } from "hooks/swap/v2/usePosition";
import { useUserInvalidPositions } from "store/swapv2/liquidity/hooks";
import { t } from "@lingui/macro";
import Modal from "components/modal/swap";
import { ImageLoading as Loading, NoData } from "components/index";
import { UserPosition } from "types/swapv2";

function hasLiquidity(position: UserPosition | undefined) {
  return position?.liquidity.toString() !== "0";
}

function PositionItem({ position: positionDetail }: { position: UserPosition | undefined }) {
  const { position } = usePositionInfo(positionDetail);
  const noLiquidity = !hasLiquidity(positionDetail);

  return noLiquidity ? null : (
    <PositionItemComponent position={position} positionId={positionDetail?.id} showButtons invalid />
  );
}

export default function InvalidPositions({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { positions: userPositions, loading } = useUserInvalidPositions();

  const noPositions = useMemo(() => {
    return userPositions.filter((position) => hasLiquidity(position)).length === 0;
  }, [userPositions]);

  return (
    <Modal open={open} title={t`Your Invalid Positions`} onClose={onClose}>
      <Box
        sx={{
          maxHeight: "500px",
          overflow: "auto",
        }}
      >
        {loading ? <Loading loading={loading} /> : null}
        {noPositions && !loading && (
          <Box mt={2}>
            <NoData />
          </Box>
        )}
        {!noPositions && (
          <Box mt={2}>
            {userPositions.map((position, index) => (
              <PositionItem key={position?.id ? String(position.id) : index} position={position} />
            ))}
          </Box>
        )}
      </Box>
    </Modal>
  );
}
