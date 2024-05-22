import { useEffect, useCallback } from "react";
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
import { useInterval } from "@icpswap/hooks";
import { useAccountPrincipal } from "store/auth/hooks";
import { getStakingTokenPoolState } from "utils/staking";

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
}

export default function StakingPool({ stakedOnly, pool }: StakingPoolProps) {
  const principal = useAccountPrincipal();
  const theme = useTheme() as Theme;
  const [poolData, updatePoolData] = useStakingPoolData(pool?.canisterId.toString());
  const [userStakingInfo, updateUserStakingInfo] = useUserStakingInfo(pool?.canisterId.toString(), principal);

  const callback = useCallback(async () => {
    return getStakingTokenPoolState(pool);
  }, [pool]);

  const state = useInterval(callback, undefined, 1000);

  const [, rewardToken] = useToken(pool?.rewardToken.address);
  const [, stakingToken] = useToken(pool?.stakingToken.address);

  const rewardTokenPrice = useUSDPrice(rewardToken);
  const stakingTokenPrice = useUSDPrice(stakingToken);

  useEffect(() => {
    let timer: number | undefined = window.setInterval(() => {
      updateUserStakingInfo();
      updatePoolData();
    }, 5000);

    return () => {
      window.clearInterval(timer);
      timer = undefined;
    };
  }, []);

  const resetData = () => {
    if (pool?.canisterId) {
      updateUserStakingInfo();
    }
  };

  return (
    <Box
      sx={{
        width: "384px",
        borderRadius: "4px",
        overflow: "hidden",
        height: "fit-content",
        display: !stakedOnly ? "block" : userStakingInfo?.amount ? "block" : "none",
        "@media (max-width: 520px)": {
          width: "340px",
        },
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
