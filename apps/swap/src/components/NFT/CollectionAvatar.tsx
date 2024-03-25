import { Box, Grid, Avatar } from "@mui/material";
import { makeStyles } from "@mui/styles";
import type { NFTControllerInfo } from "@icpswap/types";
import VerifyNFT from "components/NFT/VerifyNFT";

const useStyles = makeStyles(() => {
  return {
    avatarWrapper: {
      borderRadius: "12px",
      width: "100%",
      height: "100%",
      position: "relative",
    },

    bg: {
      backgroundSize: "cover",
      backgroundPosition: "center center",
      borderRadius: "inherit",
      width: "100%",
      height: "100%",
      filter: "blur(30px)",
      "-webkit-mask": "linear-gradient(0deg, rgb(53, 56, 64) 0%, rgba(53, 56, 64, 0.4) 100%)",
      overflow: "hidden",
    },

    avatarBox: {
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
    },

    avatar: {
      width: "94px",
      height: "94px",
      border: "3px solid #ffffff",
      borderRadius: "50%",
    },
  };
});

export default function CollectionAvatar({ metadata }: { metadata: NFTControllerInfo | undefined | null }) {
  const classes = useStyles();

  return (
    <Box className={`${classes.avatarWrapper} avatarWrapper`}>
      <Box className={classes.bg} sx={{ fontSize: "28px", backgroundImage: `url(${metadata?.image})` }} />

      <Box className={classes.avatarBox}>
        <Avatar className={classes.avatar} src={metadata?.image ?? ""}>
          &nbsp;
        </Avatar>

        <Grid container justifyContent="center" mt="20px">
          <VerifyNFT
            minter={metadata?.creator}
            justifyContent="center"
            fontSize="14px"
            textSX={{
              textShadow: "0px 3px 4px rgba(0, 0, 0, 0.1)",
            }}
          />
        </Grid>
      </Box>
    </Box>
  );
}
