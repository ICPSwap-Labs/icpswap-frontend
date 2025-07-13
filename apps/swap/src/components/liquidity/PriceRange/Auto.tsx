import { memo, useMemo, useCallback } from "react";
import { Token, Pool } from "@icpswap/swap-sdk";
import { BigNumber, isUndefinedOrNull } from "@icpswap/utils";
import { Null } from "@icpswap/types";
import { useTranslation } from "react-i18next";
import { RangeButton } from "components/liquidity/RangeButton";
import { useLiquidityChartPriceRange } from "@icpswap/hooks";

export interface AutoPriceRangeButtonProps {
  onLeftRangeInput: (value: string) => void;
  onRightRangeInput: (value: string) => void;
  baseCurrency: Token | undefined;
  quoteCurrency: Token | undefined;
  pool: Pool | Null;
  rangeValue: string | Null;
  setRangeValue: (value: string) => void;
}

export const AutoPriceRangeButton = memo(
  ({
    onLeftRangeInput,
    onRightRangeInput,
    baseCurrency,
    quoteCurrency,
    pool,
    rangeValue,
    setRangeValue,
  }: AutoPriceRangeButtonProps) => {
    const { t } = useTranslation();

    const isSorted = baseCurrency && quoteCurrency && baseCurrency.sortsBefore(quoteCurrency);

    const { result: __chartPriceRange } = useLiquidityChartPriceRange(pool?.id);

    const chartPriceRange = useMemo(() => {
      if (!__chartPriceRange) return undefined;

      const { minPrice, maxPrice } = __chartPriceRange;

      return {
        min: isSorted ? minPrice : new BigNumber(1).dividedBy(maxPrice).toString(),
        max: isSorted ? maxPrice : new BigNumber(1).dividedBy(minPrice).toString(),
      };
    }, [isSorted, __chartPriceRange]);

    const handleAutoRange = useCallback(() => {
      if (isUndefinedOrNull(chartPriceRange)) return;
      setRangeValue("Auto");

      onLeftRangeInput(chartPriceRange.min);
      onRightRangeInput(chartPriceRange.max);
    }, [chartPriceRange]);

    return (
      <RangeButton key="Auto" text={t("common.auto")} value="Auto" onClick={handleAutoRange} active={rangeValue} />
    );
  },
);
