import { Box, BoxProps, useTheme } from "components/Mui";
import { useCallback } from "react";
import { type StakingPoolControllerPoolInfo } from "@icpswap/types";
import { useAccountPrincipal } from "store/auth/hooks";
import { useNavigate } from "react-router-dom";
import { useIntervalStakingPoolInfo, useIntervalUserPoolInfo } from "hooks/staking-token/index";
import { FilterState } from "types/staking-token";

import {
  StakeTokenCell,
  RewardTokenCell,
  StateCell,
  UserRewardsCell,
  TotalRewardsCell,
  UserStakedCell,
  TotalStakedCell,
  AvailableCell,
  AprCell,
} from "./cell/index";

interface LiveRowProps {
  wrapperSx?: BoxProps["sx"];
  showState: boolean;
  poolInfo: StakingPoolControllerPoolInfo;
  filterState: FilterState;
  your?: boolean;
}

export function LiveRow({ poolInfo, wrapperSx, filterState, your, showState }: LiveRowProps) {
  const principal = useAccountPrincipal();
  const theme = useTheme();
  const navigate = useNavigate();

  const [stakingPoolInfo] = useIntervalStakingPoolInfo(poolInfo.canisterId.toString());
  const userStakingInfo = useIntervalUserPoolInfo(poolInfo.canisterId.toString(), principal);

  const handelToDetails = useCallback(() => {
    navigate(`/stake/details/${poolInfo.canisterId.toString()}`);
  }, [navigate, poolInfo]);

  return (
    <Box
      sx={{
        ...wrapperSx,
        cursor: "pointer",
        "&:hover": {
          "& .row-item": {
            background: theme.palette.background.level1,
          },
        },
        "& .row-item": {
          padding: "20px 0",
          borderTop: `1px solid ${theme.palette.background.level1}`,
          "&:first-of-type": {
            padding: "20px 0 20px 24px",
          },
          "&:last-of-type": {
            padding: "20px 24px 20px 0",
          },
        },
      }}
      onClick={handelToDetails}
    >
      <StakeTokenCell poolInfo={poolInfo} />

      <RewardTokenCell poolInfo={poolInfo} />

      <AprCell poolInfo={poolInfo} stakingPoolInfo={stakingPoolInfo} />

      {/* User available to stake */}
      <AvailableCell poolInfo={poolInfo} />

      {/* Total Staked */}
      {filterState !== FilterState.FINISHED && !your ? (
        <TotalStakedCell poolInfo={poolInfo} stakingPoolInfo={stakingPoolInfo} />
      ) : null}

      {/* Your Staked */}
      {your || filterState === FilterState.FINISHED ? (
        <UserStakedCell poolInfo={poolInfo} userStakingInfo={userStakingInfo} />
      ) : null}

      {/* Total reward tokens */}
      {filterState === FilterState.FINISHED ? <TotalRewardsCell poolInfo={poolInfo} /> : null}

      {/* Your rewards */}
      {your ? <UserRewardsCell poolInfo={poolInfo} userStakingInfo={userStakingInfo} /> : null}

      {showState ? <StateCell poolInfo={poolInfo} /> : null}
    </Box>
  );
}
