import { Typography } from "components/Mui";
import { Flex, BodyCell } from "@icpswap/ui";
import { useMemo } from "react";
import { useToken } from "hooks/useCurrency";
import { useAccountPrincipal } from "store/auth/hooks";
import { formatDollarAmount, parseTokenAmount, BigNumber, toSignificantWithGroupSeparator } from "@icpswap/utils";
import { useFarmUserPositions, useV3UserFarmRewardInfo } from "@icpswap/hooks";
import type { FarmInfo, Null, InitFarmArgs } from "@icpswap/types";
import { useUSDPrice } from "hooks/useUSDPrice";

interface UserRewardsCellProps {
  farmId: string;
  farmInfo: FarmInfo | Null;
  initArgs: InitFarmArgs | Null;
}

export function UserRewardsCell({ farmId, initArgs, farmInfo }: UserRewardsCellProps) {
  const principal = useAccountPrincipal();

  const [, rewardToken] = useToken(farmInfo?.rewardToken.address);
  const { result: deposits } = useFarmUserPositions(farmId, principal?.toString());

  const positionIds = useMemo(() => {
    return deposits?.map((position) => position.positionId) ?? [];
  }, [deposits]);

  const { result: userFarmRewardAmount } = useV3UserFarmRewardInfo(farmId, positionIds);

  const userRewardAmount = useMemo(() => {
    if (!initArgs || userFarmRewardAmount === undefined || !rewardToken) return undefined;
    const userRewardRatio = new BigNumber(1).minus(new BigNumber(initArgs.fee.toString()).dividedBy(1000));
    return parseTokenAmount(userFarmRewardAmount, rewardToken.decimals).multipliedBy(userRewardRatio).toString();
  }, [userFarmRewardAmount, initArgs, rewardToken]);

  const rewardTokenPrice = useUSDPrice(rewardToken);

  return (
    <Flex vertical gap="5px 0" className="row-item" justify="center" align="flex-end">
      <Flex justify="flex-end">
        <BodyCell>
          {userRewardAmount && rewardToken ? (
            <>
              {toSignificantWithGroupSeparator(userRewardAmount, 4)}&nbsp;
              {rewardToken.symbol}
            </>
          ) : (
            "--"
          )}
        </BodyCell>
      </Flex>
      <Flex justify="flex-end">
        <Typography sx={{ fontSize: "12px" }}>
          {userRewardAmount && rewardTokenPrice
            ? `~${formatDollarAmount(new BigNumber(userRewardAmount).multipliedBy(rewardTokenPrice).toString())}`
            : "--"}
        </Typography>
      </Flex>
    </Flex>
  );
}
