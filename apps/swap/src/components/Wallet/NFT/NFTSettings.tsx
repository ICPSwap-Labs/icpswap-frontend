import { useCallback, useRef, useState } from "react";
import { Box, Checkbox, Typography, useTheme } from "components/Mui";
import { MenuWrapper, MenuItem, Flex } from "@icpswap/ui";
import { useHideZeroNFTManager } from "store/wallet/hooks";

export function NFTSettings() {
  const ref = useRef(null);
  const theme = useTheme();
  const [open, setOpen] = useState<boolean>(false);
  const [hideZeroNFT, updateHideZeroNFT] = useHideZeroNFTManager();

  const handleMouseEnter = () => {
    setOpen(true);
  };

  const handleMouseLeave = () => {
    setOpen(false);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleHideZeroNFT = useCallback(() => {
    updateHideZeroNFT(!hideZeroNFT);
  }, [hideZeroNFT, updateHideZeroNFT]);

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
              <Checkbox size="small" checked={hideZeroNFT} />
              <Typography>Hide 0 NFTs</Typography>
            </Flex>
          }
          onMenuClick={handleHideZeroNFT}
          background={theme.palette.background.level3}
          activeBackground={theme.palette.background.level1}
          height="36px"
          padding="0 16px"
          isFirst
          isLast
        />
      </MenuWrapper>
    </Box>
  );
}
