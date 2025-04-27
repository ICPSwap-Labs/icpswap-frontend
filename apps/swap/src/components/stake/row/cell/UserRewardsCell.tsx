import { Typography } from "components/Mui";
import { Flex, BodyCell } from "@icpswap/ui";
import { Null, type StakingPoolControllerPoolInfo, type StakingPoolUserInfo } from "@icpswap/types";
import { useToken } from "hooks/useCurrency";
import { formatDollarAmount, parseTokenAmount, toSignificantWithGroupSeparator } from "@icpswap/utils";
import { useUSDPrice } from "hooks/useUSDPrice";

interface UserRewardsCellProps {
  poolInfo: StakingPoolControllerPoolInfo;
  userStakingInfo: StakingPoolUserInfo | Null;
}

export function UserRewardsCell({ poolInfo, userStakingInfo }: UserRewardsCellProps) {
  const [, rewardToken] = useToken(poolInfo.rewardToken.address);
  const rewardTokenPrice = useUSDPrice(rewardToken);

  return (
    <Flex vertical gap="5px 0" className="row-item" justify="center">
      <Flex justify="flex-end" fullWidth>
        <BodyCell
          sx={{
            maxWidth: "170px",
            overflow: "hidden",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
          }}
          title={
            userStakingInfo && rewardToken
              ? `${toSignificantWithGroupSeparator(
                  parseTokenAmount(userStakingInfo.pendingReward, rewardToken.decimals).toString(),
                )} ${rewardToken.symbol}`
              : ""
          }
        >
          {userStakingInfo && rewardToken
            ? `${toSignificantWithGroupSeparator(
                parseTokenAmount(userStakingInfo.pendingReward, rewardToken.decimals).toString(),
              )} ${rewardToken.symbol}`
            : "--"}
        </BodyCell>
      </Flex>
      <Flex gap="0 4px" justify="flex-end" fullWidth>
        <Typography sx={{ fontSize: "12px" }}>
          {userStakingInfo && rewardToken && rewardTokenPrice
            ? `${formatDollarAmount(
                parseTokenAmount(userStakingInfo.pendingReward, rewardToken.decimals)
                  .multipliedBy(rewardTokenPrice)
                  .toString(),
              )}`
            : "--"}
        </Typography>
      </Flex>
    </Flex>
  );
}
