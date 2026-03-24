import { nonUndefinedOrNull } from "@icpswap/utils";
import { Box, Drawer, useTheme } from "components/Mui";
import { AddAddress } from "components/Wallet/address-book/AddAddress";
import { AddressBook } from "components/Wallet/address-book/AddressBook";
import { DeleteAddressConfirm } from "components/Wallet/address-book/DeleteAddressConfirm";
import { EditAddress } from "components/Wallet/address-book/EditAddress";
import { SelectContact } from "components/Wallet/address-book/SelectContact";
import { BalanceConvert } from "components/Wallet/BalanceConvert/BalanceConvert";
import { ConvertToIcpConfirm } from "components/Wallet/BalanceConvert/Confirm";
import { LogoutConfirm } from "components/Wallet/LogoutConfirm";
import { NFTCanister } from "components/Wallet/NFT/NFTCanister";
import { NFTExtCanister } from "components/Wallet/NFT/NFTExtCanister";
import { NFTExtSend } from "components/Wallet/NFT/NFTExtSend";
import { NFTExtTokenDetails } from "components/Wallet/NFT/NFTExtTokenDetails";
import { NFTImporter } from "components/Wallet/NFT/NFTImporter";
import { NFTSend } from "components/Wallet/NFT/NFTSend";
import { NFTTokenDetails } from "components/Wallet/NFT/NFTTokenDetails";
import { useWalletStore, WalletManagerPage } from "components/Wallet/store";
import { TokenAssetsWrapper } from "components/Wallet/TokenAssetsWrapper";
import { TokenManager } from "components/Wallet/TokenManager";
import { TokenSelector } from "components/Wallet/TokenSelector";
import { TokenReceive, TokenSend } from "components/Wallet/token/index";
import { RemoveTokenConfirm } from "components/Wallet/token/RemoveTokenConfirm";
import { AssetsType, useWalletTokenStore } from "components/Wallet/token/store";
import { XTCTopUpModal } from "components/Wallet/XTCTopUpModal";
import { WALLET_DRAWER_WIDTH } from "constants/wallet";
import { useMediaQuery640 } from "hooks/theme";
import { useCallback, useEffect } from "react";
import { useAccountPrincipalString } from "store/auth/hooks";

const components = {
  [WalletManagerPage.Index]: <TokenAssetsWrapper />,
  [WalletManagerPage.ManageTokens]: <TokenManager />,
  [WalletManagerPage.Receive]: <TokenReceive />,
  [WalletManagerPage.Send]: <TokenSend />,
  [WalletManagerPage.TokenSelector]: <TokenSelector />,
  [WalletManagerPage.AddressBook]: <AddressBook />,
  [WalletManagerPage.AddAddress]: <AddAddress />,
  [WalletManagerPage.EditAddress]: <EditAddress />,
  [WalletManagerPage.SelectContact]: <SelectContact />,
  [WalletManagerPage.Convert]: <BalanceConvert />,
  [WalletManagerPage.NFTCanister]: <NFTCanister />,
  [WalletManagerPage.NFTTokenDetails]: <NFTTokenDetails />,
  [WalletManagerPage.NFTSend]: <NFTSend />,
  [WalletManagerPage.NFTImporter]: <NFTImporter />,
  [WalletManagerPage.NFTExtCanister]: <NFTExtCanister />,
  [WalletManagerPage.NFTExtTokenDetails]: <NFTExtTokenDetails />,
  [WalletManagerPage.NFTExtSend]: <NFTExtSend />,
};

export function WalletIndex() {
  const theme = useTheme();
  const mediaQuery640 = useMediaQuery640();
  const principal = useAccountPrincipalString();
  const { open, setOpen, pages, setPages } = useWalletStore();
  const { xtcTopUpShow, setXTCTopUpShow, setActiveAssetsTab } = useWalletTokenStore();

  useEffect(() => {
    setPages(WalletManagerPage.Index);
  }, [setPages]);

  const handleDrawerClose = useCallback(() => {
    setOpen(false);
    setPages(WalletManagerPage.Index);
    setActiveAssetsTab(AssetsType.Token);
  }, [setOpen, setPages, setActiveAssetsTab]);

  const handleStopPropagation = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
  }, []);

  const handleXTCCloseTopUp = useCallback(() => {
    setXTCTopUpShow(false);
  }, [setXTCTopUpShow]);

  return (
    <>
      <Drawer
        anchor="right"
        // Make sure the drawer is closed when user logout
        open={open && nonUndefinedOrNull(principal)}
        onClose={handleDrawerClose}
        sx={{
          width: "100%",
          "& .MuiPaper-root": {
            width: "100%",
            maxWidth: `${WALLET_DRAWER_WIDTH}px`,
            background: "transparent",
            padding: "8px",
          },

          "& ::-webkit-scrollbar-thumb": {
            background: theme.palette.background.wallet,
          },
        }}
      >
        <Box
          sx={{ width: "100%", padding: mediaQuery640 ? "60px 0 0 0" : "0px", overflow: "hidden", height: "100%" }}
          onClick={handleDrawerClose}
        >
          <Box
            sx={{
              background: theme.palette.background.wallet,
              borderRadius: "24px",
              overflow: "hidden",
              width: "100%",
              height: "100%",
            }}
            onClick={handleStopPropagation}
          >
            {components[pages[0]]}
          </Box>
        </Box>
      </Drawer>

      <DeleteAddressConfirm />
      <LogoutConfirm />
      <RemoveTokenConfirm />
      <ConvertToIcpConfirm />
      {xtcTopUpShow ? <XTCTopUpModal open={xtcTopUpShow} onClose={handleXTCCloseTopUp} /> : null}
    </>
  );
}
