import { useEffect, useCallback } from "react";
import { Box, Drawer, useTheme } from "components/Mui";
import { TokenAssetsWrapper } from "components/Wallet/TokenAssetsWrapper";
import { TokenManager } from "components/Wallet/TokenManager";
import { WalletManagerPage, useWalletContext } from "components/Wallet/context";
import { TokenReceive, TokenSend } from "components/Wallet/token/index";
import { TokenSelector } from "components/Wallet/TokenSelector";
import { AddressBook } from "components/Wallet/address-book/AddressBook";
import { AddAddress } from "components/Wallet/address-book/AddAddress";
import { EditAddress } from "components/Wallet/address-book/EditAddress";
import { DeleteAddressConfirm } from "components/Wallet/address-book/DeleteAddressConfirm";
import { SelectContact } from "components/Wallet/address-book/SelectContact";
import { WALLET_DRAWER_WIDTH } from "constants/wallet";
import { LogoutConfirm } from "components/Wallet/LogoutConfirm";
import { RemoveTokenConfirm } from "components/Wallet/token/RemoveTokenConfirm";
import { useAccountPrincipalString } from "store/auth/hooks";
import { nonUndefinedOrNull } from "@icpswap/utils";
import { useMediaQuery640 } from "hooks/theme";
import { XTCTopUpModal } from "components/Wallet/XTCTopUpModal";
import { BalanceConvert } from "components/Wallet/BalanceConvert/BalanceConvert";
import { ConvertToIcpConfirm } from "components/Wallet/BalanceConvert/Confirm";

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
};

export function WalletIndex() {
  const theme = useTheme();
  const mediaQuery640 = useMediaQuery640();
  const principal = useAccountPrincipalString();
  const { open, setOpen, pages, setPages, xtcTopUpShow, setXTCTopUpShow } = useWalletContext();

  useEffect(() => {
    setPages(WalletManagerPage.Index);
  }, []);

  const handleDrawerClose = useCallback(() => {
    setOpen(false);
    setPages(WalletManagerPage.Index);
  }, [setOpen, setPages]);

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
      <XTCTopUpModal open={xtcTopUpShow} onClose={handleXTCCloseTopUp} />
    </>
  );
}
