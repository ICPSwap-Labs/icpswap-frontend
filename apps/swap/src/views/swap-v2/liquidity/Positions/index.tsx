import { useCallback, useState, useMemo } from "react";
import { Typography, Box, Grid, Checkbox, useMediaQuery, useTheme } from "@mui/material";
import PositionItemComponent from "components/swap/v2/PositionItem";
import { usePositionInfo } from "hooks/swap/v2/usePosition";
import { useUserPositions, useQueryUserPositions } from "store/swapv2/liquidity/hooks";
import { Trans } from "@lingui/macro";
import HistoryPositions from "components/swap/HistoryPositions";
import { TextButton, NoData, MainCard, LoadingRow } from "components/index";
import { UserPosition } from "types/swapv2";
import { useClosedPositionManager } from "store/swap/cache/hooks";

function hasLiquidity(position: UserPosition | undefined) {
  return position?.liquidity?.toString() !== "0";
}

function PositionItem({
  position: positionDetail,
  showClosedPosition,
}: {
  position: UserPosition | undefined;
  showClosedPosition?: boolean;
}) {
  const { position } = usePositionInfo(positionDetail);
  const noLiquidity = !hasLiquidity(positionDetail);

  return !showClosedPosition && noLiquidity ? null : (
    <PositionItemComponent closed={noLiquidity} position={position} positionId={positionDetail?.id} showButtons />
  );
}

export default function Positions() {
  const userPositions = useUserPositions();
  const theme = useTheme();
  const [open, setOpen] = useState(false);

  const loading = useQueryUserPositions();

  const [showClosedPosition, updateShowClosedPosition] = useClosedPositionManager();

  const handleShowClosedPosition = useCallback(() => {
    updateShowClosedPosition(!showClosedPosition);
  }, [updateShowClosedPosition, showClosedPosition]);

  const hasLiquidityPositions = useMemo(() => {
    return userPositions.filter((position) => hasLiquidity(position)).length !== 0;
  }, [userPositions]);

  const matchDownSM = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <>
      <Grid item xs={12} lg={6} sx={{ height: "100%" }}>
        <MainCard level={1} className="lightGray200">
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "1fr 2fr",
              margin: "0px 0px 16px 0",
            }}
          >
            <Box>
              <Grid container alignItems="center" sx={{ height: "100%" }}>
                <Typography variant="h3" color="textPrimary">
                  <Trans>Your Positions</Trans>
                </Typography>
              </Grid>
            </Box>
            <Box>
              <Grid
                container
                justifyContent="flex-end"
                alignItems="center"
                sx={{
                  cursor: "pointer",
                  userSelect: "none",
                }}
              >
                <Typography
                  color="textPrimary"
                  component="span"
                  onClick={handleShowClosedPosition}
                  sx={{
                    ...(matchDownSM ? { fontSize: "12px" } : {}),
                    marginRight: "5px",
                  }}
                >
                  <Trans>Show closed positions</Trans>
                </Typography>
                <Checkbox
                  sx={{ padding: "0" }}
                  checked={showClosedPosition}
                  onChange={({ target: { checked } }) => {
                    updateShowClosedPosition(checked);
                  }}
                />
              </Grid>
            </Box>
          </Box>
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
              {(!hasLiquidityPositions && !showClosedPosition) || userPositions.length === 0 ? (
                <Box mt={2}>
                  <NoData />
                </Box>
              ) : null}
              <Box>
                {userPositions.map((position, index) => (
                  <PositionItem
                    key={position?.id ? String(position?.id) : index}
                    position={position}
                    showClosedPosition={showClosedPosition}
                  />
                ))}
              </Box>
            </>
          )}
        </MainCard>
        <TextButton sx={{ padding: "0 0 0 20px", margin: "5px 0 0 0" }} to="/liquidity">
          <Trans>Check your positions in Swap V3</Trans>
        </TextButton>
      </Grid>
      {open ? <HistoryPositions open={open} onClose={() => setOpen(false)} /> : null}
    </>
  );
}
