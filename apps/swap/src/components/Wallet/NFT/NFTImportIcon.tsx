import { Box } from "components/Mui";
import { useWalletStore, WalletManagerPage } from "components/Wallet/store";
import { useCallback } from "react";

export function NFTImportIcon() {
  const { setPages } = useWalletStore();

  const handleToNFTImporter = useCallback(() => {
    setPages(WalletManagerPage.NFTImporter);
  }, [setPages]);

  return (
    <Box sx={{ width: "24px", height: "24px", cursor: "pointer" }} onClick={handleToNFTImporter}>
      <img width="100%" height="100%" src="/images/wallet/nft-import.svg" alt="" />
    </Box>
  );
}
