import { Typography, Box, BoxProps } from "components/Mui";
import { Flex } from "@icpswap/ui";
import { useTheme } from "@mui/styles";
import { useCallback, useMemo } from "react";
import type { StakingPoolControllerPoolInfo } from "@icpswap/types";
import { useStateColors } from "hooks/staking-token";
import { useToken } from "hooks/useCurrency";
import { useAccountPrincipal } from "store/auth/hooks";
import { formatDollarAmount, parseTokenAmount, toSignificantWithGroupSeparator } from "@icpswap/utils";
import { useStakingPoolState } from "@icpswap/hooks";
import { Theme } from "@mui/material/styles";
import { useUSDPrice } from "hooks/useUSDPrice";
import { TokenImage } from "components/Image";
import upperFirst from "lodash/upperFirst";
import { useHistory } from "react-router-dom";
import { useApr } from "hooks/staking-token/useApr";
import { useIntervalStakingPoolInfo } from "hooks/staking-token/index";
import { useTokenBalance } from "hooks/token";

interface FarmListCardProps {
  wrapperSx?: BoxProps["sx"];
  showState: boolean;
  poolInfo: StakingPoolControllerPoolInfo;
}

export function PoolListCard({ poolInfo, wrapperSx, showState }: FarmListCardProps) {
  const principal = useAccountPrincipal();
  const theme = useTheme() as Theme;
  const history = useHistory();

  const [, stakeToken] = useToken(poolInfo.stakingToken.address);
  const [, rewardToken] = useToken(poolInfo.rewardToken.address);
  const stakeTokenPrice = useUSDPrice(stakeToken);
  const rewardTokenPrice = useUSDPrice(rewardToken);

  const [stakingPoolInfo] = useIntervalStakingPoolInfo(poolInfo.canisterId.toString());

  const state = useStakingPoolState(poolInfo);

  const { result: userStakeTokenBalance } = useTokenBalance(poolInfo.stakingToken.address, principal);

  const poolStakeTvl = useMemo(() => {
    if (!stakeToken || !stakeTokenPrice || !stakingPoolInfo) return undefined;
    return parseTokenAmount(stakingPoolInfo.totalDeposit, stakeToken.decimals).multipliedBy(stakeTokenPrice).toString();
  }, [stakeToken, stakeTokenPrice, stakingPoolInfo]);

  const apr = useApr({
    poolInfo: stakingPoolInfo,
    stakeToken,
    stakeTokenPrice,
    rewardToken,
    rewardTokenPrice,
  });

  const stateColor = useStateColors(state);

  const handelToDetails = useCallback(() => {
    history.push(`/stake/details/${poolInfo.canisterId.toString()}`);
  }, [history, poolInfo]);

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
      <Flex gap="0 8px" className="row-item">
        <TokenImage logo={stakeToken?.logo} tokenId={stakeToken?.address} size="24px" />

        <Typography variant="body2" sx={{ color: "text.primary" }}>
          {stakeToken ? `${stakeToken.symbol} ` : "--"}
        </Typography>
      </Flex>

      <Flex gap="0 8px" className="row-item">
        <TokenImage logo={rewardToken?.logo} tokenId={rewardToken?.address} size="24px" />
        <Typography variant="body2" sx={{ color: "text.primary" }}>
          {rewardToken ? `${rewardToken.symbol} ` : "--"}
        </Typography>
      </Flex>

      <Flex justify="flex-end" className="row-item">
        <Typography variant="body2" sx={{ color: "text.theme-secondary" }}>
          {apr ?? "--"}
        </Typography>
      </Flex>

      <Flex gap="0 4px" justify="flex-end" className="row-item">
        <Typography variant="body2" sx={{ color: "text.primary" }}>
          {userStakeTokenBalance && rewardToken
            ? `${toSignificantWithGroupSeparator(
                parseTokenAmount(userStakeTokenBalance, rewardToken.decimals).toString(),
              )} ${rewardToken.symbol}`
            : "--"}
        </Typography>
      </Flex>

      <Flex justify="flex-end" className="row-item">
        <Typography variant="body2" sx={{ color: "text.primary" }}>
          {poolStakeTvl ? formatDollarAmount(poolStakeTvl) : "--"}
        </Typography>
      </Flex>

      {showState ? (
        <Flex justify="flex-end" className="row-item">
          {state ? (
            <Flex gap="0 8px">
              <Box sx={{ width: "8px", height: "8px", borderRadius: "50%", background: stateColor }} />
              <Typography variant="body2" sx={{ color: stateColor }}>
                {state === "NOT_STARTED" ? "Unstart" : upperFirst(state.toLocaleLowerCase())}
              </Typography>
            </Flex>
          ) : (
            "--"
          )}
        </Flex>
      ) : null}
    </Box>
  );
}
