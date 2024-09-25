import { useCallback } from "react";
import { Position, Token, Percent } from "@icpswap/swap-sdk";
import { decreaseLiquidity } from "hooks/swap/v3Calls";
import { useSwapWithdraw } from "hooks/swap/index";
import { useErrorTip } from "hooks/useTips";
import { t } from "@lingui/macro";
import { useAccountPrincipal } from "store/auth/hooks";
import { getLocaleMessage } from "locales/services";
import { useStepCalls, newStepKey } from "hooks/useStepCall";
import { getDecreaseLiquiditySteps } from "components/swap/DecreaseLiquiditySteps";
import { useStepContentManager } from "store/steps/hooks";
import { ExternalTipArgs, OpenExternalTip } from "types/index";
import { useReclaimCallback } from "hooks/swap/useReclaimCallback";
import { Principal } from "@dfinity/principal";
import { BURN_FIELD } from "constants/swap";
import { useUpdateDecreaseLiquidityAmount, getDecreaseLiquidityAmount } from "store/swap/hooks";
import { useSwapKeepTokenInPoolsManager } from "store/swap/cache/hooks";

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
        title: t`Remove Liquidity Details`,
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

  const withdraw = useSwapWithdraw();
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
      openExternalTip,
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

      const withdrawCurrencyA = async () => {
        const { amount0 } = getDecreaseLiquidityAmount(tipKey);

        if (!currencyA || amount0 === undefined) return false;
        // skip if amount is less than 0 or is 0
        if (amount0 - BigInt(currencyA.transFee) <= BigInt(0)) return "skip";

        return await withdraw(currencyA, poolId, amount0.toString(), ({ message }: ExternalTipArgs) => {
          openExternalTip({ message, tipKey, poolId });
        });
      };

      const withdrawCurrencyB = async () => {
        const { amount1 } = getDecreaseLiquidityAmount(tipKey);

        if (!currencyB || amount1 === undefined) return false;
        // skip if amount is less than 0 or is 0
        if (amount1 - BigInt(currencyB.transFee) <= BigInt(0)) return true;

        return await withdraw(currencyB, poolId, amount1.toString(), ({ message }: ExternalTipArgs) => {
          openExternalTip({ message, tipKey, poolId });
        });
      };

      return keepTokenInPools ? [_decreaseLiquidity] : [_decreaseLiquidity, withdrawCurrencyA, withdrawCurrencyB];
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
        title: t`Remove Liquidity Details`,
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
