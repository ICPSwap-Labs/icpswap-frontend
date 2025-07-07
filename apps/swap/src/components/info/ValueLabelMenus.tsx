import { Flex, MenuWrapper, MenuItem, Fish, Dolphin, Whale } from "@icpswap/ui";
import { Typography, useTheme } from "components/Mui";

export interface ValueLabelMenusProps {
  open: boolean;
  onClickAway: () => void;
  anchor: any;
}

export function ValueLabelMenus({ open, onClickAway, anchor }: ValueLabelMenusProps) {
  const theme = useTheme();

  return (
    <MenuWrapper
      open={open}
      onClickAway={onClickAway}
      anchor={anchor}
      border="1px solid #49588E"
      background={theme.palette.background.level3}
    >
      <MenuItem value="fish" background={theme.palette.background.level3} isFirst>
        <Flex gap="0 4px">
          <Fish />
          <Typography color="text.primary">Fish ($2K – $10K)</Typography>
        </Flex>
      </MenuItem>
      <MenuItem value="dolphin" background={theme.palette.background.level3}>
        <Flex gap="0 4px">
          <Dolphin />
          <Typography color="text.primary">Dolphin ($10K – $50K)</Typography>
        </Flex>
      </MenuItem>
      <MenuItem value="whale" background={theme.palette.background.level3} isLast>
        <Flex gap="0 4px">
          <Whale />
          <Typography color="text.primary">Whale (&gt;$50K)</Typography>
        </Flex>
      </MenuItem>
    </MenuWrapper>
  );
}
