import { useCallback } from "react";
import { Position, Token, Percent } from "@icpswap/swap-sdk";
import { decreaseLiquidity } from "hooks/swap/v3Calls";
import { useErrorTip } from "hooks/useTips";
import { useAccountPrincipal } from "store/auth/hooks";
import { getLocaleMessage } from "i18n/service";
import { useStepCalls, newStepKey } from "hooks/useStepCall";
import { getDecreaseLiquiditySteps } from "components/swap/DecreaseLiquiditySteps";
import { useStepContentManager } from "store/steps/hooks";
import { OpenExternalTip } from "types/index";
import { useReclaimCallback } from "hooks/swap/useReclaimCallback";
import { Principal } from "@dfinity/principal";
import { BURN_FIELD } from "constants/swap";
import { useUpdateDecreaseLiquidityAmount } from "store/swap/hooks";
import { useSwapKeepTokenInPoolsManager } from "store/swap/cache/hooks";
import { useTranslation } from "react-i18next";

type updateStepsArgs = {
  formattedAmounts: { [key in BURN_FIELD]?: string };
  currencyA: Token | undefined;
  currencyB: Token | undefined;
  positionId: bigint;
  retry?: () => Promise<boolean>;
  principal: Principal | undefined;
  key: string;
};

function useUpdateStepContent() {
  const { t } = useTranslation();
  const updateStep = useStepContentManager();
  const handleReclaim = useReclaimCallback();
  const [keepTokenInPools] = useSwapKeepTokenInPoolsManager();

  return useCallback(
    ({ formattedAmounts, currencyA, currencyB, positionId, principal, key }: updateStepsArgs) => {
      const content = getDecreaseLiquiditySteps({
        formattedAmounts,
        currencyA,
        currencyB,
        positionId,
        principal,
        key,
        handleReclaim,
        keepTokenInPools,
      });

      updateStep(String(key), {
        content,
        title: t("swap.remove.liquidity.details"),
      });
    },
    [keepTokenInPools],
  );
}

interface DecreaseLiquidityCallsArgs {
  position: Position | undefined;
  currencyA: Token | undefined;
  currencyB: Token | undefined;
  liquidityToRemove: Percent;
  positionId: bigint;
  poolId: string;
  formattedAmounts: { LIQUIDITY_PERCENT: string; CURRENCY_A: string; CURRENCY_B: string };
  openExternalTip: OpenExternalTip;
  tipKey: string;
}

function useDecreaseLiquidityCalls() {
  const principal = useAccountPrincipal();
  const [openErrorTip] = useErrorTip();

  const updateDecreaseLiquidityAmount = useUpdateDecreaseLiquidityAmount();
  const updateStepContent = useUpdateStepContent();
  const [keepTokenInPools] = useSwapKeepTokenInPoolsManager();

  return useCallback(
    ({
      position,
      liquidityToRemove,
      poolId,
      positionId,
      currencyA,
      currencyB,
      formattedAmounts,
      tipKey,
    }: DecreaseLiquidityCallsArgs) => {
      const _decreaseLiquidity = async () => {
        if (!position || !liquidityToRemove || !principal) return false;

        const partialPosition = new Position({
          pool: position.pool,
          liquidity: liquidityToRemove.multiply(position.liquidity).quotient,
          tickLower: position.tickLower,
          tickUpper: position.tickUpper,
        });

        const { status, message, data } = await decreaseLiquidity(poolId, {
          positionId,
          liquidity: partialPosition.liquidity.toString(),
        });

        if (status === "err") {
          openErrorTip(`${getLocaleMessage(message)}.`);
          return false;
        }

        updateDecreaseLiquidityAmount(tipKey, data?.amount0, data?.amount1);

        updateStepContent({
          formattedAmounts,
          currencyA,
          currencyB,
          positionId,
          principal,
          key: tipKey,
        });

        return true;
      };

      return [_decreaseLiquidity];
    },
    [keepTokenInPools],
  );
}

export interface DecreaseLiquidityCallbackProps {
  position: Position | undefined;
  currencyA: Token | undefined;
  currencyB: Token | undefined;
  liquidityToRemove: Percent;
  positionId: bigint;
  poolId: string;
  formattedAmounts: { LIQUIDITY_PERCENT: string; CURRENCY_A: string; CURRENCY_B: string };
  feeAmount0: bigint | undefined;
  feeAmount1: bigint | undefined;
}

export function useDecreaseLiquidityCallback({
  position,
  currencyA,
  currencyB,
  liquidityToRemove,
  positionId,
  poolId,
  formattedAmounts,
  feeAmount0,
  feeAmount1,
}: DecreaseLiquidityCallbackProps) {
  const { t } = useTranslation();
  const principal = useAccountPrincipal();
  const getCalls = useDecreaseLiquidityCalls();
  const getStepCalls = useStepCalls();
  const stepContentManage = useStepContentManager();
  const handleReclaim = useReclaimCallback();
  const [keepTokenInPools] = useSwapKeepTokenInPoolsManager();

  return useCallback(
    ({ openExternalTip }: { openExternalTip: OpenExternalTip }) => {
      const key = newStepKey();

      const calls = getCalls({
        currencyA,
        currencyB,
        poolId,
        position,
        positionId,
        formattedAmounts,
        tipKey: key,
        openExternalTip,
        liquidityToRemove,
      });

      const { call, reset, retry } = getStepCalls(calls, key);

      const content = getDecreaseLiquiditySteps({
        formattedAmounts,
        currencyA,
        currencyB,
        positionId,
        principal,
        handleReclaim,
        key,
        keepTokenInPools,
      });

      stepContentManage(String(key), {
        content,
        title: t("swap.remove.liquidity.details"),
      });

      return { call, reset, retry, key };
    },
    [
      getStepCalls,
      stepContentManage,
      position,
      currencyA,
      currencyB,
      liquidityToRemove,
      positionId,
      poolId,
      formattedAmounts,
      feeAmount0,
      feeAmount1,
      keepTokenInPools,
    ],
  );
}
