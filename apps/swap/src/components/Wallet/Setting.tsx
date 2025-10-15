import { Box, useTheme, Typography } from "components/Mui";
import { useCallback, useRef, useState } from "react";
import { Flex, MenuWrapper, MenuItem } from "@icpswap/ui";
import { useWalletContext, WalletManagerPage } from "components/Wallet/context";

export function Setting() {
  const ref = useRef(null);
  const theme = useTheme();
  const [open, setOpen] = useState<boolean>(false);
  const { setPages } = useWalletContext();

  const handleMouseEnter = () => {
    setOpen(true);
  };

  const handleMouseLeave = () => {
    setOpen(false);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleClick = useCallback(() => {
    setPages(WalletManagerPage.AddressBook, false);
  }, [setPages]);

  return (
    <Box
      ref={ref}
      sx={{ width: "36px", height: "36px" }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <img width="100%" height="100%" src="/images/wallet/setting.svg" alt="" style={{ cursor: "pointer" }} />

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
          onMenuClick={handleClick}
          background={theme.palette.background.level3}
          activeBackground={theme.palette.background.level1}
          height="36px"
          padding="0 16px"
          isFirst
          isLast
        >
          <Flex gap="0 8px">
            <img width="20px" height="20px" src="/images/wallet/book.svg" alt="" />
            <Typography color="text.primary">Address book</Typography>
          </Flex>
        </MenuItem>
      </MenuWrapper>
    </Box>
  );
}
