import { Box } from "components/Mui";
import { Flex, TokenImage } from "components/index";
import { Token } from "@icpswap/swap-sdk";

export interface FarmTokenImagesProps {
  rewardToken: Token | undefined;
  token0: Token | undefined;
  token1: Token | undefined;
  rewardTokenSize?: string;
  stakeTokenSize?: string;
}

export function FarmTokenImages({
  rewardToken,
  token0,
  token1,
  rewardTokenSize = "28px",
  stakeTokenSize = "16px",
}: FarmTokenImagesProps) {
  return (
    <Flex align="flex-end">
      <TokenImage size={rewardTokenSize} logo={rewardToken?.logo} tokenId={rewardToken?.address} />

      <Flex sx={{ position: "relative", left: "calc(-20% )" }}>
        <Box sx={{ display: "flex" }}>
          <TokenImage size={stakeTokenSize} logo={token0?.logo} tokenId={token0?.address} />
          <TokenImage size={stakeTokenSize} logo={token1?.logo} tokenId={token1?.address} />
        </Box>
      </Flex>
    </Flex>
  );
}
