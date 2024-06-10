import { useEffect } from "react";
import { Box, Typography } from "@mui/material";
import { useTheme } from "@mui/styles";
import { useUSDPrice } from "hooks/useUSDPrice";
import { useToken } from "hooks/useCurrency";
import { Theme } from "@mui/material/styles";
import { STATE } from "types/staking-token";
import upperFirst from "lodash/upperFirst";
import type { StakingPoolControllerPoolInfo } from "@icpswap/types";
import PoolDetails from "components/staking-token/PoolDetails";
import UserStaking from "components/staking-token/UserStaking";
import StakingAndClaim from "components/staking-token/StakingAndClaim";
import { useStakingPoolData, useUserStakingInfo } from "hooks/staking-token/index";
import { Token } from "@icpswap/swap-sdk";
import { TokenImage } from "@icpswap/ui";
import { useAccountPrincipal } from "store/auth/hooks";
import { useCalcPoolState } from "hooks/staking-token/useCalcPoolState";

export interface PoolInfoProps {
  pool: StakingPoolControllerPoolInfo | undefined | null;
  state: STATE | undefined;
  rewardToken: Token | undefined;
  stakingToken: Token | undefined;
}

function PoolInfo({ pool, rewardToken, state, stakingToken }: PoolInfoProps) {
  const theme = useTheme() as Theme;

  return (
    <Box
      sx={{
        position: "relative",
        height: "196px",
        background: "rgba(101, 80, 186, 0.18)",
        borderRadius: "4px 4px 0 0",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          width: "212px",
          height: "131px",
          background: "rgba(53, 6, 89, 0.50)",
          filter: "blur(27px)",
          position: "absolute",
          left: "-61px",
          zIndex: 1,
          bottom: "-60px",
        }}
      />

      <Typography
        fontSize="14px"
        sx={{
          display: "inline-block",
          minWidth: "77px",
          height: "30px",
          padding: "6px",
          background: "#654DA9",
          borderRadius: "4px 0 4px 0",
          textAlign: "center",
          border: "1px solid #654DA9",
          color: theme.palette.mode === "dark" ? theme.colors.darkTextPrimary : theme.colors.primaryMain,
        }}
        component="span"
      >
        {state ? upperFirst(state.toLocaleLowerCase()) : "--"}
      </Typography>

      <Box sx={{ margin: "23px 0 26px 0", display: "flex", justifyContent: "center" }}>
        <Box sx={{ width: "85px", height: "85px", position: "relative" }}>
          <TokenImage logo={rewardToken?.logo} size="85px" />

          <Box
            sx={{
              width: "44px",
              height: "44px",
              position: "absolute",
              bottom: "-10px",
              right: "-3px",
              zIndex: "2",
            }}
          >
            <TokenImage logo={stakingToken?.logo} size="44px" />
          </Box>
        </Box>
      </Box>

      <Typography align="center" sx={{ position: "relative", color: "text.primary", fontWeight: 500, zIndex: 1 }}>
        Stake {pool?.stakingTokenSymbol} to earn {pool?.rewardTokenSymbol}
      </Typography>
    </Box>
  );
}

export interface StakingPoolProps {
  stakedOnly: boolean;
  pool: StakingPoolControllerPoolInfo | undefined;
  updatePoolStaked?: (poolId: string, staked: boolean) => void;
  filterState: STATE;
}

export default function StakingPool({ stakedOnly, pool, filterState, updatePoolStaked }: StakingPoolProps) {
  const principal = useAccountPrincipal();
  const theme = useTheme() as Theme;
  const [poolData] = useStakingPoolData(pool?.canisterId.toString());
  const [userStakingInfo, updateUserStakingInfo] = useUserStakingInfo(pool?.canisterId.toString(), principal);

  const state = useCalcPoolState({ pool });

  const [, rewardToken] = useToken(pool?.rewardToken.address);
  const [, stakingToken] = useToken(pool?.stakingToken.address);

  const rewardTokenPrice = useUSDPrice(rewardToken);
  const stakingTokenPrice = useUSDPrice(stakingToken);

  const resetData = () => {
    updateUserStakingInfo();
  };

  useEffect(() => {
    if (userStakingInfo && pool && updatePoolStaked && state === STATE.LIVE) {
      updatePoolStaked(pool.canisterId.toString(), userStakingInfo.stakeAmount !== BigInt(0));
    }
  }, [userStakingInfo, pool, updatePoolStaked, state]);

  return (
    <Box
      sx={{
        width: "384px",
        borderRadius: "4px",
        overflow: "hidden",
        height: "fit-content",
        display:
          filterState !== STATE.LIVE
            ? "block"
            : !stakedOnly
            ? "block"
            : userStakingInfo?.stakeAmount
            ? "block"
            : "none",
        "@media (max-width: 520px)": {
          width: "340px",
        },
        background: theme.palette.background.level1,
      }}
      className="staking-token-pool-item"
    >
      <PoolInfo state={state} pool={pool} rewardToken={rewardToken} stakingToken={stakingToken} />

      <Box sx={{ background: theme.palette.background.level1 }}>
        <UserStaking
          state={state}
          pool={pool}
          poolData={poolData}
          rewardToken={rewardToken}
          stakingToken={stakingToken}
          stakingTokenPrice={stakingTokenPrice}
          rewardTokenPrice={rewardTokenPrice}
          userStakingInfo={userStakingInfo}
          StakingAndClaim={
            <StakingAndClaim userStakingInfo={userStakingInfo} onStakingSuccess={resetData} pool={pool} state={state} />
          }
        />
      </Box>

      <PoolDetails
        pool={pool}
        state={state}
        poolData={poolData}
        rewardToken={rewardToken}
        stakingToken={stakingToken}
        stakingTokenPrice={stakingTokenPrice}
        rewardTokenPrice={rewardTokenPrice}
      />
    </Box>
  );
}
