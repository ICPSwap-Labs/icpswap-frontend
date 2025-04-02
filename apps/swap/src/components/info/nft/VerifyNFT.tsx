import { Box, Grid, Typography } from "components/Mui";
import { isICPSwapOfficial } from "utils/index";
import VerifyImage from "assets/images/nft/verify.svg";
import { shorten } from "@icpswap/utils";

export interface VerifyNFTProps {
  minter: string | undefined;
  justifyContent?: string;
  sx?: any;
}

export default function VerifyNFT({ minter, sx, justifyContent }: VerifyNFTProps) {
  return isICPSwapOfficial(minter) ? (
    <Grid container alignItems="center" justifyContent={justifyContent || "flex-start"}>
      <Typography color="text.primary" fontSize="12px">
        By ICPSwap
      </Typography>
      <Box
        sx={{
          width: "14px",
          height: "14px",
          marginLeft: "4px",
          ...(sx || {}),
        }}
      >
        <img width="100%" height="100%" src={VerifyImage} alt="" />
      </Box>
    </Grid>
  ) : (
    <Grid container alignItems="center" justifyContent={justifyContent || "flex-start"}>
      <Typography color="text.primary" fontSize="12px">
        By {shorten(minter ?? "", 3)}
      </Typography>
    </Grid>
  );
}
