import { Typography } from "components/Mui";
import { Flex, BodyCell } from "@icpswap/ui";
import { type StakingPoolControllerPoolInfo, StakingPoolUserInfo, Null } from "@icpswap/types";
import { useToken } from "hooks/useCurrency";
import { formatDollarAmount, parseTokenAmount, toSignificantWithGroupSeparator } from "@icpswap/utils";
import { useUSDPrice } from "hooks/useUSDPrice";

interface UserStakedCellProps {
  poolInfo: StakingPoolControllerPoolInfo;
  userStakingInfo: StakingPoolUserInfo | Null;
}

export function UserStakedCell({ poolInfo, userStakingInfo }: UserStakedCellProps) {
  const [, stakeToken] = useToken(poolInfo.stakingToken.address);
  const stakeTokenPrice = useUSDPrice(stakeToken);

  return (
    <Flex vertical gap="5px 0" className="row-item" justify="center">
      <Flex gap="0 4px" justify="flex-end" fullWidth>
        <BodyCell
          sx={{
            maxWidth: "170px",
            overflow: "hidden",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
          }}
          title={
            userStakingInfo && stakeToken
              ? `${toSignificantWithGroupSeparator(
                  parseTokenAmount(userStakingInfo.stakeAmount, stakeToken.decimals).toString(),
                )} ${stakeToken.symbol}`
              : ""
          }
        >
          {userStakingInfo && stakeToken
            ? `${toSignificantWithGroupSeparator(
                parseTokenAmount(userStakingInfo.stakeAmount, stakeToken.decimals).toString(),
              )} ${stakeToken.symbol}`
            : "--"}
        </BodyCell>
      </Flex>
      <Flex gap="0 4px" justify="flex-end" fullWidth>
        <Typography sx={{ fontSize: "12px" }}>
          {userStakingInfo && stakeToken && stakeTokenPrice
            ? `${formatDollarAmount(
                parseTokenAmount(userStakingInfo.stakeAmount, stakeToken.decimals)
                  .multipliedBy(stakeTokenPrice)
                  .toString(),
              )}`
            : "--"}
        </Typography>
      </Flex>
    </Flex>
  );
}
