import { Typography, Box, Popper, ClickAwayListener } from "components/Mui";
import { LiquidityLocks } from "components/LiquidityLocks";
import { usePoolByPoolId } from "hooks/swap/usePools";
import { Flex } from "@icpswap/ui";
import { Unlock } from "react-feather";
import { useCallback, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

export interface LiquidityLocksWrapperProps {
  poolId: string;
}

export function LiquidityLocksWrapper({ poolId }: LiquidityLocksWrapperProps) {
  const { t } = useTranslation();
  const [popper, setPopper] = useState(false);

  const ref = useRef();

  const [, pool] = usePoolByPoolId(poolId);

  const handleMouseEnter = useCallback(() => {
    setPopper(true);
  }, [setPopper]);

  const handleMouseLeave = useCallback(() => {
    setPopper(false);
  }, [setPopper]);

  return (
    <Box ref={ref} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} sx={{ cursor: "pointer" }}>
      <Flex justify="space-between">
        <Typography>{t("common.liquidity.locks")}</Typography>

        <Unlock size={14} />
      </Flex>

      <Popper
        open={popper}
        anchorEl={ref.current}
        placement="right"
        popperOptions={{
          modifiers: [
            {
              name: "offset",
              options: {
                offset: [0, 16],
              },
            },
          ],
        }}
      >
        <ClickAwayListener onClickAway={() => setPopper(false)}>
          <Box sx={{ minWidth: "280px" }}>
            <LiquidityLocks pool={pool} poolId={poolId} />
          </Box>
        </ClickAwayListener>
      </Popper>
    </Box>
  );
}
