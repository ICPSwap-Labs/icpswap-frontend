import { Box, useTheme, Typography } from "components/Mui";
import { useCallback, useRef, useState } from "react";
import { Flex, MenuWrapper, MenuItem } from "@icpswap/ui";
import { useWalletContext, WalletManagerPage } from "components/Wallet/context";
import type { AddressBook as AddressBookType } from "@icpswap/types";
import { useRemoveAddressHandler } from "hooks/wallet/useRemoveAddressHandler";

interface AddressBookManager {
  addressBook: AddressBookType;
}

export function AddressBookManager({ addressBook }: AddressBookManager) {
  const ref = useRef(null);
  const theme = useTheme();
  const [open, setOpen] = useState<boolean>(false);
  const { setPages, setEditAddressBook } = useWalletContext();
  const removeAddressHandler = useRemoveAddressHandler();

  const handleMouseEnter = () => {
    setOpen(true);
  };

  const handleMouseLeave = () => {
    setOpen(false);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleEditAddress = useCallback(() => {
    setPages(WalletManagerPage.EditAddress, false);
    setEditAddressBook(addressBook);
  }, [setPages, addressBook]);

  return (
    <Box
      ref={ref}
      sx={{ width: "20px", height: "20px", cursor: "pointer" }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <img width="100%" height="100%" src="/images/wallet/dot.svg" alt="" />

      <MenuWrapper
        open={open}
        anchor={ref?.current}
        placement="bottom-start"
        onClickAway={handleClose}
        menuWidth="186px"
        background={theme.palette.background.level3}
        border="1px solid #49588E"
      >
        <MenuItem
          value="Swap"
          onMenuClick={handleEditAddress}
          background={theme.palette.background.level3}
          activeBackground={theme.palette.background.level1}
          height="36px"
          padding="0 16px"
          isFirst
        >
          <Flex fullWidth justify="space-between">
            <Typography color="text.primary">Edit</Typography>
            <img width="20px" height="20px" src="/images/wallet/edit.svg" alt="" />
          </Flex>
        </MenuItem>

        <MenuItem
          value="Swap"
          onMenuClick={() => removeAddressHandler(addressBook)}
          background={theme.palette.background.level3}
          activeBackground={theme.palette.background.level1}
          height="36px"
          padding="0 16px"
          isLast
        >
          <Flex fullWidth justify="space-between">
            <Typography color="#D3625B">Remove</Typography>
            <img width="20px" height="20px" src="/images/wallet/remove.svg" alt="" />
          </Flex>
        </MenuItem>
      </MenuWrapper>
    </Box>
  );
}
