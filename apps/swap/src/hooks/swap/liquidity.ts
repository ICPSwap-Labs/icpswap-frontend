import { useCallback } from "react";
import { Position, Token, Percent } from "@icpswap/swap-sdk";
import { decreaseLiquidity } from "hooks/swap/v3Calls";
import { useErrorTip } from "hooks/useTips";
import { useAccountPrincipal } from "store/auth/hooks";
import { getLocaleMessage } from "i18n/service";
import { useStepCalls, newStepKey } from "hooks/useStepCall";
import { getDecreaseLiquiditySteps } from "components/swap/DecreaseLiquiditySteps";
import { useStepContentManager } from "store/steps/hooks";
import { useTranslation } from "react-i18next";
import { Null } from "@icpswap/types";

interface DecreaseLiquidityCallsArgs {
  position: Position | undefined;
  liquidityToRemove: Percent;
  positionId: bigint | Null;
  poolId: string | Null;
}

function useDecreaseLiquidityCalls() {
  const principal = useAccountPrincipal();
  const [openErrorTip] = useErrorTip();

  return useCallback(({ position, liquidityToRemove, poolId, positionId }: DecreaseLiquidityCallsArgs) => {
    const __decreaseLiquidity = async () => {
      if (!position || !liquidityToRemove || !principal || !poolId || !positionId) return false;

      const partialPosition = new Position({
        pool: position.pool,
        liquidity: liquidityToRemove.multiply(position.liquidity).quotient,
        tickLower: position.tickLower,
        tickUpper: position.tickUpper,
      });

      const { status, message } = await decreaseLiquidity(poolId, {
        positionId,
        liquidity: partialPosition.liquidity.toString(),
      });

      if (status === "err") {
        openErrorTip(`${getLocaleMessage(message)}.`);
        return false;
      }

      return true;
    };

    return [__decreaseLiquidity];
  }, []);
}

export interface DecreaseLiquidityCallbackProps {
  position: Position | undefined;
  currencyA: Token | undefined;
  currencyB: Token | undefined;
  liquidityToRemove: Percent;
  positionId: bigint | Null;
  poolId: string | Null;
  formattedAmounts: { LIQUIDITY_PERCENT: string; CURRENCY_A: string; CURRENCY_B: string };
}

export function useDecreaseLiquidityCallback({
  position,
  currencyA,
  currencyB,
  liquidityToRemove,
  positionId,
  poolId,
  formattedAmounts,
}: DecreaseLiquidityCallbackProps) {
  const { t } = useTranslation();
  const getCalls = useDecreaseLiquidityCalls();
  const getStepCalls = useStepCalls();
  const stepContentManage = useStepContentManager();

  return useCallback(() => {
    const key = newStepKey();

    const calls = getCalls({
      poolId,
      position,
      positionId,
      liquidityToRemove,
    });

    const { call, reset, retry } = getStepCalls(calls, key);

    const content = getDecreaseLiquiditySteps({
      formattedAmounts,
      currencyA,
      currencyB,
      positionId,
    });

    stepContentManage(String(key), {
      content,
      title: t("swap.remove.liquidity.details"),
    });

    return { call, reset, retry, key };
  }, [
    getStepCalls,
    stepContentManage,
    position,
    currencyA,
    currencyB,
    liquidityToRemove,
    positionId,
    poolId,
    formattedAmounts,
  ]);
}
