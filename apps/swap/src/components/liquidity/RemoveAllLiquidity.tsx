import { useCallback, useMemo, useState } from "react";
import { Button, useMediaQuery, useTheme } from "components/Mui";
import { CurrencyAmount, Percent, Position } from "@icpswap/swap-sdk";
import { BURN_FIELD } from "constants/swap";
import { useSuccessTip, useLoadingTip } from "hooks/useTips";
import { CurrencyAmountFormatDecimals } from "constants/index";
import { useAccountPrincipal } from "store/auth/hooks";
import StepViewButton from "components/Steps/View";
import { useDecreaseLiquidityCallback } from "hooks/swap/liquidity";
import { useTranslation } from "react-i18next";
import { DecreaseLiquidityConfirm } from "components/liquidity/Decrease/Confirm";
import { Null } from "@icpswap/types";

export interface RemoveAllLiquidityProps {
  position: Position | undefined;
  positionId: number | string | bigint | Null;
  onDecreaseSuccess?: () => void;
}

export function RemoveAllLiquidity({ position, positionId, onDecreaseSuccess }: RemoveAllLiquidityProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down("sm"));

  const principal = useAccountPrincipal();

  const [confirmModalShow, setConfirmModalShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const [openSuccessTip] = useSuccessTip();
  const [openLoadingTip, closeLoadingTip] = useLoadingTip();

  const { currencyA, currencyB } = useMemo(() => {
    if (!position) return {};

    return {
      currencyA: position.pool.token0,
      currencyB: position.pool.token1,
    };
  }, [position]);

  const liquidityToRemove = new Percent("100", "100");
  const percentToRemove = new Percent("100", "100");

  const discountedAmount0 = position ? percentToRemove.multiply(position.amount0.quotient).quotient : undefined;
  const discountedAmount1 = position ? percentToRemove.multiply(position.amount1.quotient).quotient : undefined;

  const parsedAmounts = {
    [BURN_FIELD.LIQUIDITY_PERCENT]: percentToRemove,
    [BURN_FIELD.CURRENCY_A]:
      currencyA && discountedAmount0 && percentToRemove && percentToRemove.greaterThan("0")
        ? CurrencyAmount.fromRawAmount(currencyA, discountedAmount0)
        : undefined,
    [BURN_FIELD.CURRENCY_B]:
      currencyB && discountedAmount1 && percentToRemove && percentToRemove.greaterThan("0")
        ? CurrencyAmount.fromRawAmount(currencyB, discountedAmount1)
        : undefined,
  };

  const formattedAmounts = {
    [BURN_FIELD.LIQUIDITY_PERCENT]: "100",
    [BURN_FIELD.CURRENCY_A]:
      parsedAmounts[BURN_FIELD.CURRENCY_A]?.toFixed(
        CurrencyAmountFormatDecimals(parsedAmounts[BURN_FIELD.CURRENCY_A]?.currency.decimals),
      ) ?? "",
    [BURN_FIELD.CURRENCY_B]:
      parsedAmounts[BURN_FIELD.CURRENCY_B]?.toFixed(
        CurrencyAmountFormatDecimals(parsedAmounts[BURN_FIELD.CURRENCY_B]?.currency.decimals),
      ) ?? "",
  };

  const getDecreaseLiquidityCall = useDecreaseLiquidityCallback({
    position,
    poolId: position?.pool.id,
    positionId: positionId ? BigInt(positionId) : null,
    liquidityToRemove,
    currencyA,
    currencyB,
    formattedAmounts,
  });

  const handleRemoveAll = useCallback(async () => {
    if (!position || loading || !principal) return;

    setLoading(true);

    const { key, call } = getDecreaseLiquidityCall();

    const loadingTipKey = openLoadingTip(`Remove ${currencyA?.symbol}/${currencyB?.symbol} liquidity`, {
      extraContent: <StepViewButton step={key} />,
    });

    setConfirmModalShow(false);

    const result = await call();

    closeLoadingTip(loadingTipKey);

    if (result === true) {
      openSuccessTip(t("swap.remove.liquidity.success"));
      if (onDecreaseSuccess) onDecreaseSuccess();
    }

    setLoading(false);
  }, [position, liquidityToRemove, loading]);

  return (
    <>
      <Button
        variant="contained"
        className="secondary"
        size={matchDownSM ? "medium" : "large"}
        onClick={() => setConfirmModalShow(true)}
        disabled={loading}
      >
        {t("common.remove.all")}
      </Button>

      {confirmModalShow && (
        <DecreaseLiquidityConfirm
          open={confirmModalShow}
          onConfirm={handleRemoveAll}
          onCancel={() => setConfirmModalShow(false)}
          currencyA={currencyA}
          currencyB={currencyB}
          formattedAmounts={formattedAmounts}
        />
      )}
    </>
  );
}
