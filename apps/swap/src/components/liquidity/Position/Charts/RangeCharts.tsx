import { useCallback, useMemo, ReactNode } from "react";
import { BarChart2, Inbox, CloudOff, Loader } from "react-feather";
import { useDensityChartData } from "hooks/swap/useDensityChartData";
import { FeeAmount, ZOOM_LEVEL_INITIAL_MIN_MAX, Bound } from "constants/swap";
import { Price, Token } from "@icpswap/swap-sdk";
import { Box, Typography, useTheme } from "components/Mui";
import { Flex } from "components/index";
import { t } from "@lingui/macro";
import type { Null, PositionPricePeriodRange } from "@icpswap/types";

import { ZoomLevels } from "components/liquidity/PriceRangeChart/types";
import { Chart } from "./Chart";

const ZOOM_LEVELS: Record<FeeAmount, ZoomLevels> = {
  [FeeAmount.LOW]: {
    initialMin: ZOOM_LEVEL_INITIAL_MIN_MAX[FeeAmount.LOW].min,
    initialMax: ZOOM_LEVEL_INITIAL_MIN_MAX[FeeAmount.LOW].max,
    min: 0.00001,
    max: 1.5,
  },
  [FeeAmount.MEDIUM]: {
    initialMin: ZOOM_LEVEL_INITIAL_MIN_MAX[FeeAmount.MEDIUM].min,
    initialMax: ZOOM_LEVEL_INITIAL_MIN_MAX[FeeAmount.MEDIUM].max,
    min: 0.00001,
    max: 20,
  },
  [FeeAmount.HIGH]: {
    initialMin: ZOOM_LEVEL_INITIAL_MIN_MAX[FeeAmount.HIGH].min,
    initialMax: ZOOM_LEVEL_INITIAL_MIN_MAX[FeeAmount.HIGH].max,
    min: 0.00001,
    max: 20,
  },
};

function InfoBox({ message, icon }: { message?: ReactNode; icon: ReactNode }) {
  return (
    <Flex fullWidth justify="center" align="center" sx={{ height: "100%", minHeight: "200px" }} vertical>
      {icon}
      {message && (
        <Typography variant="h3" color="textPrimary" align="center" sx={{ marginTop: "20px" }}>
          {message}
        </Typography>
      )}
    </Flex>
  );
}

export interface LiquidityChartRangeInputProps {
  currencyA: Token | undefined;
  currencyB: Token | undefined;
  feeAmount?: FeeAmount;
  price: number | undefined | string;
  priceLower?: Price<Token, Token>;
  priceUpper?: Price<Token, Token>;
  periodPriceRange: PositionPricePeriodRange | Null;
  ticksAtLimit: { [bound in Bound]?: boolean | undefined };
}

export default function LiquidityChartRangeInput({
  currencyA,
  currencyB,
  feeAmount,
  price,
  priceLower,
  priceUpper,
  periodPriceRange,
  ticksAtLimit,
}: LiquidityChartRangeInputProps) {
  const theme = useTheme();

  const COLOR_BLUE = "#0068FC";

  const { isLoading, isUninitialized, isError, formattedData } = useDensityChartData({
    currencyA,
    currencyB,
    feeAmount: feeAmount ?? FeeAmount.MEDIUM,
  });

  return (
    <Box style={{ minHeight: "200px" }}>
      {isUninitialized ? (
        <InfoBox
          message={t`Your position will appear here.`}
          icon={<Inbox size={56} stroke={theme.palette.background.level3} />}
        />
      ) : isLoading ? (
        <InfoBox icon={<Loader size="40px" stroke={theme.palette.background.level3} />} />
      ) : isError ? (
        <InfoBox
          message={t`Liquidity data not available.`}
          icon={<CloudOff size={56} stroke={theme.palette.background.level3} />}
        />
      ) : !formattedData || formattedData.length === 0 || !price ? (
        <InfoBox
          message={t`There is no liquidity data.`}
          icon={<BarChart2 size={56} stroke={theme.palette.background.level3} />}
        />
      ) : (
        <Flex fullWidth justify="center">
          <Chart
            data={{
              series: formattedData,
              current: Number(price),
              lower: priceLower ? Number(priceLower?.toFixed()) : undefined,
              upper: priceUpper ? Number(priceUpper.toFixed()) : undefined,
            }}
            dimensions={{ width: 400, height: 220 }}
            margins={{ top: 0, right: 0, bottom: 28, left: 0 }}
            styles={{
              area: {
                selection: COLOR_BLUE,
              },
            }}
            zoomLevels={ZOOM_LEVELS[feeAmount ?? FeeAmount.MEDIUM]}
            periodPriceRange={periodPriceRange}
            ticksAtLimit={ticksAtLimit}
          />
        </Flex>
      )}
    </Box>
  );
}
