import { Grid } from "components/Mui";
import VerifyImage from "assets/images/nft/verify.svg";

export function NFTVerifyLabel() {
  return (
    <Grid
      sx={{
        width: "16px",
        height: "16px",
        zIndex: 2,
      }}
      container
      justifyContent="center"
      alignItems="center"
    >
      <img width="100%" height="100%" src={VerifyImage} alt="" />
    </Grid>
  );
}
