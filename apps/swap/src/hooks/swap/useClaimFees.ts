import { useCallback } from "react";
import BigNumber from "bignumber.js";
import { Pool, CurrencyAmount, Token } from "@icpswap/swap-sdk";
import { t } from "@lingui/macro";
import { getActorIdentity } from "components/Identity";
import { useAccountPrincipal } from "store/auth/hooks";
import { getLocaleMessage } from "locales/services";
import { useStepCalls, newStepKey } from "hooks/useStepCall";
import { getCollectFeeSteps } from "components/swap/CollectFeeSteps";
import { useStepContentManager } from "store/steps/hooks";
import { useSwapWithdraw, useReclaimCallback } from "hooks/swap/index";
import { useErrorTip } from "hooks/useTips";
import { collect } from "hooks/swap/v3Calls";
import { ExternalTipArgs, OpenExternalTip } from "types/index";

export async function collectPositionFee(pool: string, positionId: bigint) {
  const identity = await getActorIdentity();

  return await collect(pool, identity, {
    positionId,
  });
}

interface CollectFeeCallsArgs {
  currencyFeeAmount0: CurrencyAmount<Token>;
  pool: Pool;
  positionId: bigint;
  currencyFeeAmount1: CurrencyAmount<Token>;
  openExternalTip: OpenExternalTip;
  stepKey: string;
}

function useCollectFeeCalls() {
  const principal = useAccountPrincipal();
  const [openErrorTip] = useErrorTip();
  const withdraw = useSwapWithdraw();

  return useCallback(
    ({ pool, positionId, currencyFeeAmount0, currencyFeeAmount1, openExternalTip, stepKey }: CollectFeeCallsArgs) => {
      const _collect = async () => {
        if (!positionId || !principal || !pool) return false;

        const { status, message } = await collectPositionFee(pool.id, positionId);

        if (status === "ok") {
          return true;
        }
        openErrorTip(getLocaleMessage(message) ?? t`Failed to claim`);
        return false;
      };

      const __withdraw = async () => {
        const withdrawCurrencyA = async () => {
          if (!currencyFeeAmount0 || !pool) return false;

          if (
            !new BigNumber(currencyFeeAmount0.quotient.toString())
              .minus(currencyFeeAmount0.currency.transFee)
              .isGreaterThan(0)
          )
            return true;

          return await withdraw(
            currencyFeeAmount0.currency,
            pool.id,
            currencyFeeAmount0.quotient.toString(),
            ({ message }: ExternalTipArgs) => {
              openExternalTip({ message, tipKey: stepKey, poolId: pool.id });
            },
          );
        };

        const withdrawCurrencyB = async () => {
          if (!currencyFeeAmount1 || !pool) return false;

          if (
            !new BigNumber(currencyFeeAmount1.quotient.toString())
              .minus(currencyFeeAmount1.currency.transFee)
              .isGreaterThan(0)
          )
            return true;

          const result = await withdraw(
            currencyFeeAmount1.currency,
            pool.id,
            currencyFeeAmount1.quotient.toString(),
            ({ message }: ExternalTipArgs) => {
              openExternalTip({ message, tipKey: stepKey, tokenId: currencyFeeAmount1.currency.address });
            },
          );

          return result;
        };

        const result = await Promise.all([withdrawCurrencyA(), withdrawCurrencyB()]);
        return !result.includes(false);
      };

      return [_collect, __withdraw];
    },
    [principal],
  );
}

interface AddLiquidityStepsArgs {
  positionId: bigint;
  retry: () => Promise<boolean>;
  currencyFeeAmount0: CurrencyAmount<Token>;
  currencyFeeAmount1: CurrencyAmount<Token>;
}

function useCollectFeeSteps() {
  const principal = useAccountPrincipal();
  const stepContentManage = useStepContentManager();

  const handleReclaim = useReclaimCallback();

  return useCallback(
    (key: string, { positionId, retry, currencyFeeAmount0, currencyFeeAmount1 }: AddLiquidityStepsArgs) => {
      const content = getCollectFeeSteps({
        positionId,
        retry,
        currencyFeeAmount1,
        currencyFeeAmount0,
        principal,
        handleReclaim,
      });

      stepContentManage(String(key), {
        content,
        title: t`Claim Fees Details`,
      });
    },
    [principal],
  );
}

export interface ClaimFeeArgs {
  currencyFeeAmount0: CurrencyAmount<Token>;
  pool: Pool;
  positionId: bigint;
  currencyFeeAmount1: CurrencyAmount<Token>;
  openExternalTip: OpenExternalTip;
}

export function useCollectFeeCallback() {
  const getCalls = useCollectFeeCalls();
  const formatCall = useStepCalls();
  const initialSteps = useCollectFeeSteps();

  return useCallback(
    ({ pool, positionId, currencyFeeAmount0, currencyFeeAmount1, openExternalTip }: ClaimFeeArgs) => {
      const key = newStepKey();
      const calls = getCalls({
        pool,
        positionId,
        currencyFeeAmount0,
        currencyFeeAmount1,
        openExternalTip,
        stepKey: key,
      });
      const { call, reset, retry } = formatCall(calls, key);

      initialSteps(key, { positionId, currencyFeeAmount0, currencyFeeAmount1, retry });

      return { call, reset, retry, key };
    },
    [getCalls, formatCall, initialSteps],
  );
}
