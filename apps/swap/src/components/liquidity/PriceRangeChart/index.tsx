import { useCallback, useMemo, ReactNode } from "react";
import { saturate } from "polished";
import { BarChart2, Inbox, CloudOff, Loader } from "react-feather";
import { batch } from "react-redux";
import { useDensityChartData } from "hooks/swap/useDensityChartData";
import { format } from "d3";
import {
  Bound,
  ZOOM_LEVEL_INITIAL_MIN_MAX,
  SWAP_CHART_RANGE_LEFT_COLOR,
  SWAP_CHART_RANGE_RIGHT_COLOR,
  SWAP_CHART_RANGE_AREA_COLOR,
} from "constants/swap";
import { Price, Token, FeeAmount } from "@icpswap/swap-sdk";
import { Box, Typography, useTheme } from "components/Mui";
import { Flex } from "components/index";
import { Null } from "@icpswap/types";
import { useTranslation } from "react-i18next";

import { ZoomLevels } from "./types";
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
  ticksAtLimit: { [bound in Bound]?: boolean | undefined };
  price: number | undefined | string;
  priceLower?: Price<Token, Token>;
  priceUpper?: Price<Token, Token>;
  onLeftRangeInput?: (typedValue: string) => void;
  onRightRangeInput?: (typedValue: string) => void;
  poolPriceLower: string | number | Null;
  poolPriceUpper: string | number | Null;
}

// Todo: Duplicate LiquidityChartRangeInput
export default function LiquidityChartRangeInput({
  currencyA,
  currencyB,
  feeAmount,
  ticksAtLimit,
  price,
  priceLower,
  priceUpper,
  onLeftRangeInput,
  onRightRangeInput,
  poolPriceLower,
  poolPriceUpper,
}: LiquidityChartRangeInputProps) {
  const { t } = useTranslation();
  const theme = useTheme();

  const isSorted = currencyA && currencyB && currencyA?.wrapped.sortsBefore(currencyB?.wrapped);

  const { isLoading, isUninitialized, isError, formattedData } = useDensityChartData({
    currencyA,
    currencyB,
    feeAmount: feeAmount ?? FeeAmount.MEDIUM,
  });

  const onBrushDomainChangeEnded = useCallback(
    (domain: [number, number], mode: string | undefined) => {
      let leftRangeValue = Number(domain[0]);
      const rightRangeValue = Number(domain[1]);

      if (leftRangeValue <= 0) {
        leftRangeValue = 1 / 10 ** 6;
      }

      batch(() => {
        // simulate user input for auto-formatting and other validations
        if (
          (!ticksAtLimit[isSorted ? Bound.LOWER : Bound.UPPER] || mode === "handle" || mode === "reset") &&
          leftRangeValue > 0
        ) {
          if (onLeftRangeInput) onLeftRangeInput(leftRangeValue.toFixed(6));
        }
        if ((!ticksAtLimit[isSorted ? Bound.UPPER : Bound.LOWER] || mode === "reset") && rightRangeValue > 0) {
          // todo: remove this check. Upper bound for large numbers
          // sometimes fails to parse to tick.
          if (rightRangeValue < 1e35) {
            if (onRightRangeInput) onRightRangeInput(rightRangeValue.toFixed(6));
          }
        }
      });
    },
    [isSorted, onLeftRangeInput, onRightRangeInput, ticksAtLimit],
  );

  const interactive = Boolean(formattedData?.length);

  const brushDomain: [number, number] | undefined = useMemo(() => {
    const leftPrice = isSorted ? priceLower : priceUpper?.invert();
    const rightPrice = isSorted ? priceUpper : priceLower?.invert();

    return leftPrice && rightPrice
      ? [parseFloat(leftPrice?.toSignificant(6)), parseFloat(rightPrice?.toSignificant(6))]
      : undefined;
  }, [isSorted, priceLower, priceUpper]);

  const brushLabelValue = useCallback(
    (d: "w" | "e", x: number) => {
      if (!price) return "";

      if (d === "w" && ticksAtLimit[isSorted ? Bound.LOWER : Bound.UPPER]) return "0";
      if (d === "e" && ticksAtLimit[isSorted ? Bound.UPPER : Bound.LOWER]) return "∞";

      const percent =
        (x < Number(price) ? -1 : 1) *
        ((Math.max(x, Number(price)) - Math.min(x, Number(price))) / Number(price)) *
        100;

      return price ? `${format(Math.abs(percent) > 1 ? ".2~s" : ".2~f")(percent)}%` : "";
    },
    [isSorted, price, ticksAtLimit],
  );

  return (
    <Box style={{ minHeight: "200px" }}>
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
          <Chart
            data={{ series: formattedData, current: Number(price) }}
            dimensions={{ width: 400, height: 240 }}
            margins={{ top: 0, right: 0, bottom: 30, left: 0 }}
            styles={{
              area: {
                selection: SWAP_CHART_RANGE_AREA_COLOR,
              },
              brush: {
                handle: {
                  west: saturate(0.1, SWAP_CHART_RANGE_LEFT_COLOR),
                  east: saturate(0.1, SWAP_CHART_RANGE_RIGHT_COLOR),
                },
              },
            }}
            interactive={interactive}
            brushLabels={brushLabelValue}
            brushDomain={brushDomain}
            onBrushDomainChange={onBrushDomainChangeEnded}
            zoomLevels={ZOOM_LEVELS[feeAmount ?? FeeAmount.MEDIUM]}
            ticksAtLimit={ticksAtLimit}
            poolPriceLower={poolPriceLower}
            poolPriceUpper={poolPriceUpper}
          />
        </Flex>
      )}
    </Box>
  );
}
