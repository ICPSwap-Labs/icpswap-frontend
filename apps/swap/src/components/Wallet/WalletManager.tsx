import { useCallback, useRef, useState } from "react";
import { Box, Checkbox, Typography, useTheme } from "components/Mui";
import { MenuWrapper, MenuItem, Flex } from "@icpswap/ui";
import { useWalletContext, WalletManagerPage } from "components/Wallet/context";
import { useHideSmallBalanceManager } from "store/wallet/hooks";

export function WalletManager() {
  const ref = useRef(null);
  const theme = useTheme();
  const [open, setOpen] = useState<boolean>(false);
  const [hideSmallBalance, updateHideSmallBalance] = useHideSmallBalanceManager();
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

  const handleManageTokens = useCallback(() => {
    setPages(WalletManagerPage.ManageTokens);
  }, [setPages]);

  const handleHideBalance = useCallback(() => {
    updateHideSmallBalance(!hideSmallBalance);
  }, [hideSmallBalance, updateHideSmallBalance]);

  return (
    <Box
      ref={ref}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      sx={{ alignItems: "center", width: "24px", height: "24px" }}
    >
      <img src="/images/wallet/manage.svg" alt="" style={{ cursor: "pointer" }} />

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
          label={
            <Flex gap="0 4px">
              <Checkbox size="small" checked={hideSmallBalance} />
              <Typography>Hide &lt;$1 Balance</Typography>
            </Flex>
          }
          onMenuClick={handleHideBalance}
          background={theme.palette.background.level3}
          activeBackground={theme.palette.background.level1}
          height="36px"
          padding="0 16px"
          isFirst
        />

        <MenuItem
          value="Swap"
          label={
            <Flex gap="0 4px">
              <img src="/images/wallet/manage-token.svg" alt="" />
              <Typography>Manage tokens</Typography>
            </Flex>
          }
          onMenuClick={handleManageTokens}
          background={theme.palette.background.level3}
          activeBackground={theme.palette.background.level1}
          height="36px"
          padding="0 16px"
          isLast
        />
      </MenuWrapper>
    </Box>
  );
}
