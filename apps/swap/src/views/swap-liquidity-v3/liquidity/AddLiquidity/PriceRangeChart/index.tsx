import { useCallback, useMemo, ReactNode } from "react";
import { saturate } from "polished";
import { BarChart2, Inbox, CloudOff, Loader } from "react-feather";
import { batch } from "react-redux";
import { useDensityChartData } from "hooks/swap/useDensityChartData";
import { format } from "d3";
import { Bound, FeeAmount } from "constants/swap";
import { Price, Currency, Token } from "@icpswap/swap-sdk";
import { Box, Grid, Typography, useTheme } from "@mui/material";
import { t } from "@lingui/macro";
import { Theme } from "@mui/material/styles";
import { ZoomLevels } from "./types";
import { Chart } from "./Chart";

const ZOOM_LEVELS: Record<FeeAmount, ZoomLevels> = {
  [FeeAmount.LOW]: {
    initialMin: 0.999,
    initialMax: 1.001,
    min: 0.00001,
    max: 1.5,
  },
  [FeeAmount.MEDIUM]: {
    initialMin: 0.5,
    initialMax: 2,
    min: 0.00001,
    max: 20,
  },
  [FeeAmount.HIGH]: {
    initialMin: 0.5,
    initialMax: 2,
    min: 0.00001,
    max: 20,
  },
};

function InfoBox({ message, icon }: { message?: ReactNode; icon: ReactNode }) {
  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      sx={{ height: "100%", minHeight: "200px" }}
      flexDirection="column"
    >
      {icon}
      {message && (
        <Typography variant="h3" color="textPrimary" align="center" sx={{ marginTop: "20px" }}>
          {message}
        </Typography>
      )}
    </Grid>
  );
}

export interface LiquidityChartRangeInputProps {
  currencyA: Currency | undefined;
  currencyB: Currency | undefined;
  feeAmount?: FeeAmount;
  ticksAtLimit: { [bound in Bound]?: boolean | undefined };
  price: number | undefined | string;
  priceLower?: Price<Token, Token>;
  priceUpper?: Price<Token, Token>;
  onLeftRangeInput: (typedValue: string) => void;
  onRightRangeInput: (typedValue: string) => void;
  interactive: boolean;
}

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
  interactive,
}: LiquidityChartRangeInputProps) {
  const theme = useTheme() as Theme;

  const tokenAColor = "#788686";
  const tokenBColor = "#bb8d00";
  const COLOR_BLUE = "#0068FC";

  const isSorted = currencyA && currencyB && currencyA?.wrapped.sortsBefore(currencyB?.wrapped);

  const { isLoading, isUninitialized, isError, formattedData } = useDensityChartData({
    currencyA,
    currencyB,
    feeAmount: feeAmount ?? FeeAmount.MEDIUM,
  });

  const onBrushDomainChangeEnded = useCallback(
    (domain, mode) => {
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
          onLeftRangeInput(leftRangeValue.toFixed(6));
        }
        if ((!ticksAtLimit[isSorted ? Bound.UPPER : Bound.LOWER] || mode === "reset") && rightRangeValue > 0) {
          // todo: remove this check. Upper bound for large numbers
          // sometimes fails to parse to tick.
          if (rightRangeValue < 1e35) {
            onRightRangeInput(rightRangeValue.toFixed(6));
          }
        }
      });
    },
    [isSorted, onLeftRangeInput, onRightRangeInput, ticksAtLimit],
  );

  const _interactive = interactive && Boolean(formattedData?.length);

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

  // if (isError) {
  //   ReactGA.exception({
  //     ...error,
  //     category: "Liquidity",
  //     fatal: false,
  //   });
  // }

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
        <Grid container alignItems="center" justifyContent="center">
          <Chart
            data={{ series: formattedData, current: Number(price) }}
            dimensions={{ width: 400, height: 200 }}
            margins={{ top: 10, right: 2, bottom: 20, left: 0 }}
            styles={{
              area: {
                selection: COLOR_BLUE,
              },
              brush: {
                handle: {
                  west: saturate(0.1, tokenAColor),
                  east: saturate(0.1, tokenBColor) ?? COLOR_BLUE,
                },
              },
            }}
            interactive={_interactive}
            brushLabels={brushLabelValue}
            brushDomain={brushDomain}
            onBrushDomainChange={onBrushDomainChangeEnded}
            zoomLevels={ZOOM_LEVELS[feeAmount ?? FeeAmount.MEDIUM]}
            ticksAtLimit={ticksAtLimit}
          />
        </Grid>
      )}
    </Box>
  );
}
