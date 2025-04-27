import { Typography } from "components/Mui";
import { Flex, Tooltip, BodyCell } from "@icpswap/ui";
import { StakingState, type StakingPoolControllerPoolInfo } from "@icpswap/types";
import { useToken } from "hooks/useCurrency";
import { useAccountPrincipal } from "store/auth/hooks";
import { formatDollarAmount, parseTokenAmount, toSignificantWithGroupSeparator } from "@icpswap/utils";
import { useStakingPoolState } from "@icpswap/hooks";
import { useUSDPrice } from "hooks/useUSDPrice";
import { useTokenBalance } from "hooks/token";
import dayjs from "dayjs";

const DAYJS_FORMAT0 = "MMMM D, YYYY";
const DAYJS_FORMAT1 = "h:mm A";

interface AvailableCellProps {
  poolInfo: StakingPoolControllerPoolInfo;
}

export function AvailableCell({ poolInfo }: AvailableCellProps) {
  const principal = useAccountPrincipal();

  const [, stakeToken] = useToken(poolInfo.stakingToken.address);
  const stakeTokenPrice = useUSDPrice(stakeToken);

  const state = useStakingPoolState(poolInfo);

  const { result: userStakeTokenBalance } = useTokenBalance(poolInfo.stakingToken.address, principal);

  return (
    <Flex vertical gap="5px 0" className="row-item" justify="center">
      <Flex gap="0 4px" justify="flex-end" fullWidth>
        <BodyCell
          sx={{
            maxWidth: "230px",
            overflow: "hidden",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
          }}
          title={
            userStakeTokenBalance && stakeToken
              ? `${toSignificantWithGroupSeparator(
                  parseTokenAmount(userStakeTokenBalance, stakeToken.decimals).toString(),
                )} ${stakeToken.symbol}`
              : ""
          }
        >
          {userStakeTokenBalance && stakeToken
            ? `${toSignificantWithGroupSeparator(
                parseTokenAmount(userStakeTokenBalance, stakeToken.decimals).toString(),
              )} ${stakeToken.symbol}`
            : "--"}
        </BodyCell>

        {state === StakingState.NOT_STARTED ? (
          <Tooltip
            tips={`
                  As soon as the Staking Pool goes live on ${dayjs(Number(poolInfo.startTime) * 1000).format(
                    DAYJS_FORMAT0,
                  )} at ${dayjs(Number(poolInfo.startTime) * 1000).format(DAYJS_FORMAT1)}, you can start staking.`}
            iconSize="14px"
          />
        ) : null}
      </Flex>
      <Flex gap="0 4px" justify="flex-end" fullWidth>
        <Typography sx={{ fontSize: "12px" }}>
          {userStakeTokenBalance && stakeToken && stakeTokenPrice
            ? `${formatDollarAmount(
                parseTokenAmount(userStakeTokenBalance, stakeToken.decimals).multipliedBy(stakeTokenPrice).toString(),
              )}`
            : "--"}
        </Typography>
      </Flex>
    </Flex>
  );
}

export function FinishedAvailableCell() {
  return (
    <Flex gap="5px 0" className="row-item" justify="flex-end">
      <BodyCell>--</BodyCell>
    </Flex>
  );
}
