import type { NFTControllerInfo } from "@icpswap/types";
import { Avatar, Box, Grid } from "components/Mui";
import VerifyNFT from "components/NFT/VerifyNFT";

export default function CollectionAvatar({ metadata }: { metadata: NFTControllerInfo | undefined | null }) {
  return (
    <Box
      className="avatarWrapper"
      sx={{
        borderRadius: "12px",
        width: "100%",
        height: "100%",
        position: "relative",
      }}
    >
      <Box
        sx={{
          backgroundSize: "cover",
          backgroundPosition: "center center",
          borderRadius: "inherit",
          width: "100%",
          height: "100%",
          filter: "blur(30px)",
          "-webkit-mask": "linear-gradient(0deg, rgb(53, 56, 64) 0%, rgba(53, 56, 64, 0.4) 100%)",
          overflow: "hidden",
          fontSize: "28px",
          backgroundImage: `url(${metadata?.image})`,
        }}
      />

      <Box sx={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}>
        <Avatar
          sx={{
            width: "94px",
            height: "94px",
            border: "3px solid #ffffff",
            borderRadius: "50%",
          }}
          src={metadata?.image ?? ""}
        >
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
