import { useMemo } from "react";
import { Box } from "@mui/material";
import PositionItemComponent from "components/swap/HistoryPositionItem";
import { usePositionInfoV1 } from "hooks/swap/v2/usePosition";
import { t } from "@lingui/macro";
import Modal from "components/modal/swap";
import { NoData } from "components/index";
import { UserPosition } from "types/swapv2";
import LoadingRow from "components/Loading/LoadingRow";
import { useUserV1Positions } from "store/swapv2/liquidity/hooks";

function hasLiquidity(position: UserPosition | undefined) {
  return position?.liquidity.toString() !== "0";
}

function PositionItem({ position: positionDetail }: { position: UserPosition | undefined }) {
  const { position } = usePositionInfoV1(positionDetail);
  const noLiquidity = !hasLiquidity(positionDetail);

  return !noLiquidity ? (
    <PositionItemComponent
      position={position}
      positionId={positionDetail?.id}
      showButtons
      invalid
      closed={noLiquidity}
    />
  ) : null;
}

export default function HistoryPositions({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { loading, result: userPositions } = useUserV1Positions();

  const hasLiquidityPositions = useMemo(() => {
    return userPositions.filter((position) => hasLiquidity(position)).length !== 0;
  }, [userPositions]);

  return (
    <Modal open={open} title={t`Your History Positions`} onClose={onClose}>
      <Box
        sx={{
          maxHeight: "500px",
          overflow: "auto",
        }}
      >
        {loading ? (
          <LoadingRow>
            <div />
            <div />
            <div />
            <div />
            <div />
            <div />
            <div />
            <div />
          </LoadingRow>
        ) : (
          <>
            {!hasLiquidityPositions || userPositions.length === 0 ? (
              <Box mt={2}>
                <NoData />
              </Box>
            ) : null}
            <Box>
              {userPositions.map((position, index) => (
                <PositionItem key={position?.id ? String(position?.id) : index} position={position} />
              ))}
            </Box>
          </>
        )}
      </Box>
    </Modal>
  );
}
