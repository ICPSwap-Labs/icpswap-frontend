import { Grid, Box } from "components/Mui";
import { TokenImage } from "components/index";
import { Token } from "@icpswap/swap-sdk";

export interface StakingTokenImagesProps {
  rewardToken: Token | undefined;
  stakeToken: Token | undefined;
  rewardTokenSize?: string;
  stakeTokenSize?: string;
}

export function StakingTokenImages({
  rewardToken,
  stakeToken,
  rewardTokenSize = "28px",
  stakeTokenSize = "16px",
}: StakingTokenImagesProps) {
  return (
    <Box
      sx={{
        position: "relative",
        "& .poolImageBox": {
          left: "calc(50% + 5px)",
          bottom: 0,
          position: "absolute",
        },
      }}
    >
      <TokenImage size={rewardTokenSize} logo={rewardToken?.logo} tokenId={rewardToken?.address} />

      <Grid container className="poolImageBox">
        <Box sx={{ display: "flex" }}>
          <TokenImage size={stakeTokenSize} logo={stakeToken?.logo} tokenId={stakeToken?.address} />
        </Box>
      </Grid>
    </Box>
  );
}
