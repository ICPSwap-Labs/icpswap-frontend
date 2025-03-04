import { Box, Grid, Typography } from "components/Mui";
import { isICPSwapOfficial } from "utils/index";
import VerifyImage from "assets/images/nft/verify.svg";
import { shorten } from "@icpswap/utils";

export interface LabelProps {
  minter?: string;
  secondaryColor?: boolean;
  fontSize?: string;
  textSX?: any;
}

function Label({ minter, secondaryColor, fontSize = "12px", textSX }: LabelProps) {
  const value = isICPSwapOfficial(minter) ? "ICPSwap" : minter;

  return (
    <Typography color="text.primary" fontSize={fontSize} sx={{ ...(textSX ?? {}) }}>
      By{" "}
      {secondaryColor ? (
        <Typography color="secondary" fontSize={fontSize} component="span" sx={{ ...(textSX ?? {}) }}>
          {shorten(value ?? "", 3)}
        </Typography>
      ) : (
        shorten(value ?? "", 3)
      )}
    </Typography>
  );
}

export default function VerifyNFT({
  minter,
  sx,
  justifyContent,
  secondaryColor,
  fontSize,
  textSX,
}: {
  minter: string | undefined;
  justifyContent?: string;
  sx?: any;
  secondaryColor?: boolean;
  fontSize?: string;
  textSX?: any;
}) {
  return isICPSwapOfficial(minter) ? (
    <Grid container alignItems="center" justifyContent={justifyContent || "flex-start"}>
      <Label fontSize={fontSize} secondaryColor={secondaryColor} minter={minter} textSX={textSX} />
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
      <Label fontSize={fontSize} secondaryColor={secondaryColor} minter={minter} textSX={textSX} />
    </Grid>
  );
}
