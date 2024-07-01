import { Box, Typography, Button } from "components/Mui";
import { Modal } from "@icpswap/ui";
import { Trans } from "@lingui/macro";
import { FarmPositionCard } from "components/farm/index";
import type { FarmInfo, InitFarmArgs, UserPositionInfoWithId } from "@icpswap/types";
import { Token } from "@icpswap/swap-sdk";

export interface AllPositionsProps {
  farmId: string;
  farmInfo: FarmInfo | undefined;
  token0: Token | undefined;
  token1: Token | undefined;
  rewardToken: Token | undefined;
  positions: UserPositionInfoWithId[];
  open: boolean;
  onClose?: () => void;
  refreshData?: () => void;
  farmInitArgs: InitFarmArgs | undefined;
}

export function AllPositions({
  farmId,
  positions,
  farmInfo,
  token0,
  token1,
  rewardToken,
  open,
  onClose,
  refreshData,
  farmInitArgs,
}: AllPositionsProps) {
  return (
    <Modal open={open} onClose={onClose} title={`${token0?.symbol}/${token1?.symbol} Positions`} background="level1">
      <Box mt="16px">
        <Typography mt="8px">
          <Trans>{positions.length} Position Available To Stake</Trans>
        </Typography>

        <Box sx={{ margin: "8px 0 0 0", maxHeight: "432px", overflow: "hidden auto" }}>
          {positions.map((ele) => (
            <Box
              key={ele.id.toString()}
              sx={{
                margin: "32px 0 0 0",
                "&:first-of-type": {
                  margin: "0px",
                },
              }}
            >
              <FarmPositionCard
                key={ele.id.toString()}
                farmInfo={farmInfo}
                farmId={farmId}
                positionInfo={{
                  id: ele.id,
                  tickLower: ele.tickLower,
                  tickUpper: ele.tickUpper,
                  liquidity: ele.liquidity,
                }}
                farmInitArgs={farmInitArgs}
                rewardToken={rewardToken}
                resetData={refreshData}
              />
            </Box>
          ))}
        </Box>
      </Box>

      <Box mt="24px">
        <Button
          fullWidth
          variant="contained"
          size="large"
          href={`/liquidity/add/${token0?.address}/${token1?.address}`}
        >
          <Trans>Add Liquidity</Trans>
        </Button>
      </Box>
    </Modal>
  );
}
