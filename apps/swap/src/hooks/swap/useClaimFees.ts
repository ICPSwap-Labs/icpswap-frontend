import { useCallback } from "react";
import { Pool, CurrencyAmount, Token } from "@icpswap/swap-sdk";
import { useAccountPrincipal } from "store/auth/hooks";
import { getLocaleMessage } from "i18n/service";
import { useStepCalls, newStepKey } from "hooks/useStepCall";
import { getCollectFeeSteps } from "components/swap/CollectFeeSteps";
import { useStepContentManager } from "store/steps/hooks";
import { useSwapWithdraw, useReclaimCallback } from "hooks/swap/index";
import { useErrorTip } from "hooks/useTips";
import { collect } from "hooks/swap/v3Calls";
import { ExternalTipArgs, OpenExternalTip } from "types/index";
import { sleep, BigNumber } from "@icpswap/utils";
import { useTranslation } from "react-i18next";

export async function collectPositionFee(pool: string, positionId: bigint) {
  return await collect(pool, {
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
  refresh?: () => void;
}

function useCollectFeeCalls() {
  const principal = useAccountPrincipal();
  const [openErrorTip] = useErrorTip();
  const withdraw = useSwapWithdraw();
  const { t } = useTranslation();

  return useCallback(
    ({
      pool,
      positionId,
      currencyFeeAmount0,
      currencyFeeAmount1,
      openExternalTip,
      stepKey,
      refresh,
    }: CollectFeeCallsArgs) => {
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

        const result = await Promise.all([withdrawCurrencyA(), withdrawCurrencyB()]).catch((err) => {
          console.warn("Claim fees error: ", err);
          return [false, false];
        });

        if (refresh) refresh();

        return !result.includes(false);
      };

      const _collect = async () => {
        if (!positionId || !principal || !pool) return false;

        const { status, message } = await collectPositionFee(pool.id, positionId);

        if (status === "ok") {
          __withdraw();
          return true;
        }

        openErrorTip(getLocaleMessage(message) ?? t`Failed to claim`);
        return false;
      };

      const step1 = async () => {
        await sleep(1000);
        return true;
      };

      return [_collect, step1];
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
  const { t } = useTranslation();
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
        title: t("swap.claim.fees.details"),
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
  refresh?: () => void;
}

export function useCollectFeeCallback() {
  const getCalls = useCollectFeeCalls();
  const formatCall = useStepCalls();
  const initialSteps = useCollectFeeSteps();

  return useCallback(
    ({ pool, positionId, currencyFeeAmount0, currencyFeeAmount1, openExternalTip, refresh }: ClaimFeeArgs) => {
      const key = newStepKey();
      const calls = getCalls({
        pool,
        positionId,
        currencyFeeAmount0,
        currencyFeeAmount1,
        openExternalTip,
        stepKey: key,
        refresh,
      });
      const { call, reset, retry } = formatCall(calls, key);

      initialSteps(key, { positionId, currencyFeeAmount0, currencyFeeAmount1, retry });

      return { call, reset, retry, key };
    },
    [getCalls, formatCall, initialSteps],
  );
}
