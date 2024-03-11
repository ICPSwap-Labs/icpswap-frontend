import { Grid, useTheme, useMediaQuery, Box } from "@mui/material";
import WalletPageToggle from "components/Wallet/PageToggle";
import AddNFTCanister from "./AddNFTCanister";
import { ImportEXTNft } from "./ImportEXTNFT";

export default function NFTListHeader() {
  const theme = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        justifyContent: "space-between",
        "@media(max-width: 640px)": {
          flexDirection: "column",
          gap: "20px 0",
        },
      }}
    >
      <WalletPageToggle />

      <Box
        sx={{
          display: "flex",
          gap: "0 20px",
          "@media(max-width: 640px)": {
            justifyContent: "flex-end",
          },
        }}
      >
        <ImportEXTNft />
        <AddNFTCanister />
      </Box>
    </Box>
  );
}
