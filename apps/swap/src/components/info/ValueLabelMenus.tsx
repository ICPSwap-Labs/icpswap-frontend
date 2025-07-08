import { Flex, MenuWrapper, MenuItem, Fish, Dolphin, Whale, FishValue, DolphinValue, WhaleValue } from "@icpswap/ui";
import { formatDollarAmount } from "@icpswap/utils";
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
          <Typography color="text.primary">
            Fish ({formatDollarAmount(FishValue, { dollarDigits: 0 })} –
            {formatDollarAmount(DolphinValue, { dollarDigits: 0 })})
          </Typography>
        </Flex>
      </MenuItem>
      <MenuItem value="dolphin" background={theme.palette.background.level3}>
        <Flex gap="0 4px">
          <Dolphin />
          <Typography color="text.primary">
            Dolphin ({formatDollarAmount(DolphinValue, { dollarDigits: 0 })} –
            {formatDollarAmount(WhaleValue, { dollarDigits: 0 })})
          </Typography>
        </Flex>
      </MenuItem>
      <MenuItem value="whale" background={theme.palette.background.level3} isLast>
        <Flex gap="0 4px">
          <Whale />
          <Typography color="text.primary">
            Whale (&gt;{formatDollarAmount(WhaleValue, { dollarDigits: 0 })})
          </Typography>
        </Flex>
      </MenuItem>
    </MenuWrapper>
  );
}
