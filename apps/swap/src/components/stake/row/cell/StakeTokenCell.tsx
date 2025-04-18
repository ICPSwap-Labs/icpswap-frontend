import { Flex, BodyCell } from "@icpswap/ui";
import { type StakingPoolControllerPoolInfo } from "@icpswap/types";
import { useToken } from "hooks/useCurrency";
import { TokenImage } from "components/Image";

interface StakeTokenCellProps {
  poolInfo: StakingPoolControllerPoolInfo;
}

export function StakeTokenCell({ poolInfo }: StakeTokenCellProps) {
  const [, stakeToken] = useToken(poolInfo.stakingToken.address);

  return (
    <Flex gap="0 8px" className="row-item">
      <TokenImage logo={stakeToken?.logo} tokenId={stakeToken?.address} size="24px" />
      <BodyCell
        sx={{
          width: "150px",
          overflow: "hidden",
          whiteSpace: "nowrap",
          textOverflow: "ellipsis",
        }}
        title={stakeToken?.symbol ?? ""}
      >
        {stakeToken ? `${stakeToken.symbol} ` : "--"}
      </BodyCell>
    </Flex>
  );
}
