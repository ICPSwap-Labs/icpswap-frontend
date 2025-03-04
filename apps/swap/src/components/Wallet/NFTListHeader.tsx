import { Box } from "components/Mui";
import WalletPageToggle from "components/Wallet/PageToggle";

import AddNFTCanister from "./AddNFTCanister";
import { ImportEXTNft } from "./ImportEXTNFT";

export default function NFTListHeader() {
  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        justifyContent: "space-between",
      }}
    >
      <WalletPageToggle />

      <Box
        sx={{
          display: "flex",
          gap: "0 10px",
        }}
      >
        <ImportEXTNft />
        <AddNFTCanister />
      </Box>
    </Box>
  );
}
