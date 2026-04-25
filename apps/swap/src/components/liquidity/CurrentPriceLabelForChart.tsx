import type { Pool, Token } from "@icpswap/swap-sdk";
import type { Null } from "@icpswap/types";
import { Flex } from "@icpswap/ui";
import { Box, Typography } from "components/Mui";
import { PoolCurrentPrice } from "components/swap/index";
import { SWAP_CHART_CURRENT_PRICE_COLOR } from "constants/swap";
import { memo } from "react";
import { useTranslation } from "react-i18next";

export interface CurrentPriceLabelForChartProps {
  baseCurrency?: Token | Null;
  pool: Pool | Null;
  showInverted?: boolean;
  onInverted?: (inverted: boolean) => void;
}

export const CurrentPriceLabelForChart = memo(
  ({ baseCurrency, showInverted = false, pool, onInverted }: CurrentPriceLabelForChartProps) => {
    const { t } = useTranslation();

    return (
      <Flex fullWidth gap="4px 2px" wrap="wrap">
        <Flex gap="0 12px">
          <Box sx={{ background: SWAP_CHART_CURRENT_PRICE_COLOR, width: "8px", height: "2px" }} />
          <Typography fontSize="12px" sx={{ lineHeight: "16px", width: "fit-content", whiteSpace: "nowrap" }}>
            {t("common.current.price.colon")}&nbsp;
          </Typography>
        </Flex>

        <PoolCurrentPrice
          pool={pool}
          token={baseCurrency}
          sx={{ width: "fit-content", flexWrap: "wrap" }}
          showInverted={showInverted}
          onInverted={onInverted}
        />
      </Flex>
    );
  },
);
