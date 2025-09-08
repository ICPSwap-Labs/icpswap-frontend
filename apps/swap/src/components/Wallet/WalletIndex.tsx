import { useEffect, useCallback } from "react";
import { Drawer } from "components/Mui";
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
};

export function WalletIndex() {
  const { open, setOpen, pages, setPages } = useWalletContext();

  useEffect(() => {
    setPages(WalletManagerPage.Index);
  }, []);

  const handleDrawerClose = useCallback(() => {
    setOpen(false);
    setPages(WalletManagerPage.Index);
  }, [setOpen, setPages]);

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={handleDrawerClose}
      sx={{
        width: "100%",
        "& .MuiPaper-root": {
          width: "100%",
          maxWidth: `${WALLET_DRAWER_WIDTH}px`,
          background: "#1B223F",
          borderRadius: "24px",
        },
      }}
    >
      {components[pages[0]]}
      <DeleteAddressConfirm />
      <LogoutConfirm />
    </Drawer>
  );
}
