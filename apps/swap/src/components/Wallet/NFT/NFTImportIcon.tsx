import { useCallback } from "react";
import { Box } from "components/Mui";
import { useWalletContext, WalletManagerPage } from "components/Wallet/context";

export function NFTImportIcon() {
  const { setPages } = useWalletContext();

  const handleToNFTImporter = useCallback(() => {
    setPages(WalletManagerPage.NFTImporter);
  }, [setPages]);

  return (
    <Box sx={{ width: "24px", height: "24px", cursor: "pointer" }} onClick={handleToNFTImporter}>
      <img width="100%" height="100%" src="/images/wallet/nft-import.svg" alt="" />
    </Box>
  );
}
