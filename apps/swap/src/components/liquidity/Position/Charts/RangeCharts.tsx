import { ReactNode, useEffect, useRef, useState } from "react";
import { BarChart2, Inbox, CloudOff, Loader } from "react-feather";
import { useDensityChartData } from "hooks/swap/useDensityChartData";
import {
  FeeAmount,
  ZOOM_LEVEL_INITIAL_MIN_MAX,
  Bound,
  SWAP_CHART_RANGE_AREA_COLOR,
  SWAP_CHART_RANGE_LEFT_COLOR,
  SWAP_CHART_RANGE_RIGHT_COLOR,
} from "constants/swap";
import { Token } from "@icpswap/swap-sdk";
import { Box, Typography, useTheme } from "components/Mui";
import { Flex } from "components/index";
import type { Null } from "@icpswap/types";
import { ZoomLevels } from "components/liquidity/PriceRangeChart/types";
import { useTranslation } from "react-i18next";

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
  priceLower?: string;
  priceUpper?: string;
  ticksAtLimit: { [bound in Bound]?: boolean | undefined };
  poolPriceLower: string | number | Null;
  poolPriceUpper: string | number | Null;
}

export default function LiquidityChartRangeInput({
  currencyA,
  currencyB,
  feeAmount,
  price,
  priceLower,
  priceUpper,
  ticksAtLimit,
  poolPriceLower,
  poolPriceUpper,
}: LiquidityChartRangeInputProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const wrapperRef = useRef<HTMLDivElement>();

  const [wrapperWidth, setWrapperWidth] = useState<null | number>(null);

  const { isLoading, isUninitialized, isError, formattedData } = useDensityChartData({
    currencyA,
    currencyB,
    feeAmount: feeAmount ?? FeeAmount.MEDIUM,
  });

  useEffect(() => {
    if (wrapperRef.current) {
      const width = wrapperRef.current.clientWidth;
      setWrapperWidth(width);
    }
  }, [wrapperRef]);

  return (
    <Box style={{ minHeight: "200px" }} ref={wrapperRef}>
      {isUninitialized ? (
        <InfoBox
          message={t("liquidity.position.appear")}
          icon={<Inbox size={56} stroke={theme.palette.background.level3} />}
        />
      ) : isLoading ? (
        <InfoBox icon={<Loader size="40px" stroke={theme.palette.background.level3} />} />
      ) : isError ? (
        <InfoBox
          message={t("liquidity.data.not.available")}
          icon={<CloudOff size={56} stroke={theme.palette.background.level3} />}
        />
      ) : !formattedData || formattedData.length === 0 || !price ? (
        <InfoBox
          message={t("liquidity.no.data")}
          icon={<BarChart2 size={56} stroke={theme.palette.background.level3} />}
        />
      ) : (
        <Flex fullWidth justify="center">
          {wrapperWidth ? (
            <Chart
              data={{
                series: formattedData,
                current: Number(price),
                lower: priceLower ? Number(priceLower) : undefined,
                upper: priceUpper ? Number(priceUpper) : undefined,
              }}
              dimensions={{ width: wrapperWidth, height: 265 }}
              margins={{ top: 0, right: 0, bottom: 28, left: 0 }}
              styles={{
                area: {
                  selection: SWAP_CHART_RANGE_AREA_COLOR,
                  leftColor: SWAP_CHART_RANGE_LEFT_COLOR,
                  rightColor: SWAP_CHART_RANGE_RIGHT_COLOR,
                },
              }}
              zoomLevels={ZOOM_LEVELS[feeAmount ?? FeeAmount.MEDIUM]}
              ticksAtLimit={ticksAtLimit}
              poolPriceLower={poolPriceLower}
              poolPriceUpper={poolPriceUpper}
            />
          ) : null}
        </Flex>
      )}
    </Box>
  );
}
